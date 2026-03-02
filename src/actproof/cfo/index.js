const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Configuration
const CONFIG = {
  pollIntervalSec: parseInt(process.env.POLL_INTERVAL_SEC || '5'),
  baselineWindowSec: parseInt(process.env.BASELINE_WINDOW_SEC || '120'),
  thresholdK: parseFloat(process.env.THRESHOLD_K || '1.5'),
  holdSec: parseInt(process.env.HOLD_SEC || '60'),
  cooldownSec: parseInt(process.env.COOLDOWN_SEC || '120'),
  servicexMcpUrl: process.env.SERVICEX_MCP_URL || 'http://servicex:3000/mcp/observe',
  actionEngineUrl: process.env.ACTION_ENGINE_URL || 'http://action-engine:4000/diagnosis'
};

const EVIDENCE_DIR = '/app/evidence';
const PORT = 6000;

// State
let samples = [];
let baseline = null;
let ccTimeSeries = [];
let lastDiagnosisTime = 0;
let breachStartTime = null;

// Ensure evidence directory exists
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

// =============================================================================
// CC CALCULATION (LOCK)
// CC = latency_p99 * (error_rate + retry_rate)
// =============================================================================
function computeCC(metrics) {
  const { latency_p99, error_rate, retry_rate } = metrics;
  return latency_p99 * (error_rate + retry_rate);
}

// =============================================================================
// BASELINE COMPUTATION
// =============================================================================
function computeBaseline(samples) {
  if (samples.length === 0) return null;

  const latencies = samples.map(s => s.metrics.latency_p99);
  const errorRates = samples.map(s => s.metrics.error_rate);
  const retryRates = samples.map(s => s.metrics.retry_rate);

  const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const L0 = median(latencies);
  const E0 = median(errorRates);
  const R0 = median(retryRates);
  const CC0 = L0 * (E0 + R0);

  return {
    tenant_id: 'demo',
    computed_at: new Date().toISOString(),
    per_service: {
      servicex: { L0, R0, E0 }
    },
    cc0_per_service: {
      servicex: CC0
    },
    cc0_global: CC0
  };
}

// =============================================================================
// DETECTION: CC_TREND_HIGH
// Trigger when mean(CC_global) > k * CC0_global for hold_sec
// =============================================================================
function checkTrigger(ccTimeSeries, baseline) {
  if (!baseline || baseline.cc0_global === 0) return false;

  const holdWindowMs = CONFIG.holdSec * 1000;
  const now = Date.now();
  const recentSamples = ccTimeSeries.filter(s => (now - s.timestamp) <= holdWindowMs);

  if (recentSamples.length < 3) return false; // Need minimum samples

  const meanCC = recentSamples.reduce((sum, s) => sum + s.cc, 0) / recentSamples.length;
  const threshold = CONFIG.thresholdK * baseline.cc0_global;

  console.log(`[CFO] CC check: mean=${meanCC.toFixed(2)}, threshold=${threshold.toFixed(2)}, baseline=${baseline.cc0_global.toFixed(2)}`);

  return meanCC > threshold;
}

// =============================================================================
// BUILD DIAGNOSIS
// =============================================================================
function buildDiagnosis(latestObs, baseline, ccTimeSeries) {
  const recentCC = ccTimeSeries.slice(-12); // Last minute of samples
  const meanCC = recentCC.reduce((sum, s) => sum + s.cc, 0) / recentCC.length;

  return {
    diagnosis_id: `diag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tenant_id: 'demo',
    timestamp: new Date().toISOString(),
    type: 'CC_TREND_HIGH',
    targets: ['servicex'],
    recommended_action: {
      type: 'SWAP_VARIANT',
      params: {
        service_logical_id: 'servicex',
        from_variant: latestObs.current_variant,
        to_variant: 'light'
      }
    },
    evidence: {
      baseline_cc: baseline.cc0_global,
      current_cc: meanCC,
      cc_formula: 'latency_p99 * (error_rate + retry_rate)',
      threshold_cc: CONFIG.thresholdK * baseline.cc0_global,
      breach_duration_seconds: CONFIG.holdSec,
      cc_series: recentCC.map(s => ({ t: s.timestamp, cc: s.cc })),
      mcp_observe_snapshot: latestObs
    }
  };
}

// =============================================================================
// MAIN POLLING LOOP
// =============================================================================
async function pollLoop() {
  try {
    // Fetch MCP observe
    const response = await fetch(CONFIG.servicexMcpUrl);
    if (!response.ok) {
      console.error(`[CFO] MCP poll failed: ${response.status}`);
      return;
    }

    const obs = await response.json();
    const now = Date.now();

    // Store sample
    samples.push({
      timestamp: now,
      ...obs
    });

    // Compute current CC
    const currentCC = computeCC(obs.metrics);
    ccTimeSeries.push({
      timestamp: now,
      cc: currentCC,
      variant: obs.current_variant
    });

    // Save CC time series to file
    const ccFile = path.join(EVIDENCE_DIR, 'cc_timeseries.json');
    fs.writeFileSync(ccFile, JSON.stringify(ccTimeSeries, null, 2));

    console.log(`[CFO] Poll: variant=${obs.current_variant}, CC=${currentCC.toFixed(2)}, p99=${obs.metrics.latency_p99}ms, err=${(obs.metrics.error_rate * 100).toFixed(1)}%`);

    // Phase A: Baseline computation
    const baselineWindowMs = CONFIG.baselineWindowSec * 1000;
    const oldestSample = samples[0]?.timestamp || now;
    
    if (!baseline && (now - oldestSample) >= baselineWindowMs) {
      baseline = computeBaseline(samples);
      
      // Save baseline to evidence
      const baselineFile = path.join(EVIDENCE_DIR, 'baseline.json');
      fs.writeFileSync(baselineFile, JSON.stringify(baseline, null, 2));
      
      console.log(`[CFO] Baseline computed: CC0_global=${baseline.cc0_global.toFixed(2)}`);
      return;
    }

    if (!baseline) {
      const remaining = Math.ceil((baselineWindowMs - (now - oldestSample)) / 1000);
      console.log(`[CFO] Baseline phase: ${remaining}s remaining`);
      return;
    }

    // Phase B: Detection
    const cooldownMs = CONFIG.cooldownSec * 1000;
    if ((now - lastDiagnosisTime) < cooldownMs) {
      console.log(`[CFO] In cooldown: ${Math.ceil((cooldownMs - (now - lastDiagnosisTime)) / 1000)}s remaining`);
      return;
    }

    if (checkTrigger(ccTimeSeries, baseline)) {
      if (!breachStartTime) {
        breachStartTime = now;
        console.log(`[CFO] CC breach detected, starting hold timer`);
      }

      const breachDuration = (now - breachStartTime) / 1000;
      if (breachDuration >= CONFIG.holdSec) {
        console.log(`[CFO] === EMITTING DIAGNOSIS ===`);
        
        const diagnosis = buildDiagnosis(obs, baseline, ccTimeSeries);
        
        // Save diagnosis to evidence
        const diagFile = path.join(EVIDENCE_DIR, `diagnosis_${Date.now()}.json`);
        fs.writeFileSync(diagFile, JSON.stringify(diagnosis, null, 2));
        
        // Send to Action Engine
        try {
          const aeResponse = await fetch(CONFIG.actionEngineUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(diagnosis)
          });
          console.log(`[CFO] Diagnosis sent to Action Engine: ${aeResponse.status}`);
        } catch (error) {
          console.error(`[CFO] Failed to send diagnosis: ${error.message}`);
        }

        lastDiagnosisTime = now;
        breachStartTime = null;
      }
    } else {
      breachStartTime = null;
    }

  } catch (error) {
    console.error(`[CFO] Error in poll loop: ${error.message}`);
  }
}

// API endpoints for inspection
app.get('/status', (req, res) => {
  res.json({
    baseline: baseline,
    samples_count: samples.length,
    cc_series_count: ccTimeSeries.length,
    last_cc: ccTimeSeries[ccTimeSeries.length - 1] || null,
    last_diagnosis_time: lastDiagnosisTime ? new Date(lastDiagnosisTime).toISOString() : null
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', component: 'cfo' });
});

// Start
app.listen(PORT, () => {
  console.log(`[CFO] Starting ActProof CFO Lite`);
  console.log(`[CFO] Config: poll=${CONFIG.pollIntervalSec}s, baseline=${CONFIG.baselineWindowSec}s, k=${CONFIG.thresholdK}, hold=${CONFIG.holdSec}s`);
  console.log(`[CFO] Polling ${CONFIG.servicexMcpUrl}`);
  
  // Start polling loop
  setInterval(pollLoop, CONFIG.pollIntervalSec * 1000);
  pollLoop(); // Initial poll
});
