const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Configuration
const CONFIG = {
  cooldownSec: parseInt(process.env.COOLDOWN_SEC || '120'),
  orchestratorUrl: process.env.ORCHESTRATOR_URL || 'http://orchestrator:5000/execute'
};

const EVIDENCE_DIR = '/app/evidence';
const PORT = 4000;

// State
let lastInterventionTime = 0;
let processedDiagnoses = new Set();

// Ensure evidence directory exists
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

// =============================================================================
// POLICY GATES (MVP)
// =============================================================================
const policies = {
  // Time Policy: no changes Friday 16:00-20:00
  timePolicy: (diagnosis) => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 5=Fri
    const hour = now.getHours();
    
    if (day === 5 && hour >= 16 && hour < 20) {
      return { pass: false, reason: 'TIME_POLICY: No topology changes Friday 16:00-20:00' };
    }
    return { pass: true };
  },

  // Cooldown Policy: no action if last intervention < cooldown_sec
  cooldownPolicy: (diagnosis) => {
    const now = Date.now();
    const cooldownMs = CONFIG.cooldownSec * 1000;
    
    if ((now - lastInterventionTime) < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - (now - lastInterventionTime)) / 1000);
      return { pass: false, reason: `COOLDOWN_POLICY: ${remaining}s remaining` };
    }
    return { pass: true };
  },

  // Idempotency Policy: same diagnosis_id = no re-execution
  idempotencyPolicy: (diagnosis) => {
    if (processedDiagnoses.has(diagnosis.diagnosis_id)) {
      return { pass: false, reason: 'IDEMPOTENCY_POLICY: Diagnosis already processed' };
    }
    return { pass: true };
  },

  // Blast Radius Policy: max 1 service per action
  blastRadiusPolicy: (diagnosis) => {
    if (diagnosis.targets && diagnosis.targets.length > 1) {
      return { pass: false, reason: 'BLAST_RADIUS_POLICY: Max 1 service per action' };
    }
    return { pass: true };
  }
};

function validatePolicies(diagnosis) {
  for (const [name, policy] of Object.entries(policies)) {
    const result = policy(diagnosis);
    if (!result.pass) {
      return { pass: false, reason: result.reason, policy: name };
    }
  }
  return { pass: true };
}

// =============================================================================
// TRANSLATE DIAGNOSIS TO COMMAND
// =============================================================================
function translateToCommand(diagnosis) {
  const { recommended_action } = diagnosis;
  
  switch (recommended_action.type) {
    case 'SWAP_VARIANT':
      return {
        type: 'SWAP_VARIANT',
        service_logical_id: recommended_action.params.service_logical_id,
        from_variant: recommended_action.params.from_variant,
        to_variant: recommended_action.params.to_variant
      };
    
    case 'CONFIG_TUNE':
      return {
        type: 'CONFIG_TUNE',
        service_logical_id: recommended_action.params.service_logical_id,
        params: recommended_action.params.config
      };
    
    case 'BUFFER_ENABLE':
      return {
        type: 'BUFFER_ENABLE',
        edge: recommended_action.params.edge,
        buffer_type: recommended_action.params.buffer_type,
        capacity: recommended_action.params.capacity
      };
    
    case 'DEGRADE_MODE':
      return {
        type: 'DEGRADE_MODE',
        service_logical_id: recommended_action.params.service_logical_id,
        mode: recommended_action.params.mode
      };
    
    default:
      throw new Error(`Unknown action type: ${recommended_action.type}`);
  }
}

// =============================================================================
// BUILD ACTION RESULT
// =============================================================================
function buildActionResult(diagnosis, status, executionReport = {}) {
  const result = {
    command_id: `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    diagnosis_id: diagnosis.diagnosis_id,
    tenant_id: diagnosis.tenant_id,
    action_type: diagnosis.recommended_action.type,
    status: status,
    executed_at: new Date().toISOString(),
    execution_report: {
      before_state: executionReport.before_state || {},
      after_state: executionReport.after_state || {},
      rollback_available: status === 'SUCCESS'
    }
  };

  // Add hash for audit
  const content = JSON.stringify({ ...result, hash: undefined });
  result.hash = crypto.createHash('sha256').update(content).digest('hex');

  return result;
}

// =============================================================================
// MAIN ENDPOINT: Receive Diagnosis
// =============================================================================
app.post('/diagnosis', async (req, res) => {
  const diagnosis = req.body;
  console.log(`[AE] Received diagnosis: ${diagnosis.diagnosis_id}, type: ${diagnosis.type}`);

  // Check idempotency first (special case: return DUPLICATE)
  if (processedDiagnoses.has(diagnosis.diagnosis_id)) {
    const result = buildActionResult(diagnosis, 'DUPLICATE');
    saveEvidence(result);
    console.log(`[AE] Duplicate diagnosis, ignoring`);
    return res.json(result);
  }

  // Validate all policies
  const policyResult = validatePolicies(diagnosis);
  if (!policyResult.pass) {
    const result = buildActionResult(diagnosis, 'BLOCKED', {
      reason: policyResult.reason
    });
    saveEvidence(result);
    console.log(`[AE] Blocked by policy: ${policyResult.reason}`);
    return res.json(result);
  }

  // Translate to command
  let command;
  try {
    command = translateToCommand(diagnosis);
    console.log(`[AE] Translated command: ${JSON.stringify(command)}`);
  } catch (error) {
    const result = buildActionResult(diagnosis, 'FAILED', {
      error: error.message
    });
    saveEvidence(result);
    return res.json(result);
  }

  // Execute via Service Orchestrator
  try {
    const soResponse = await fetch(CONFIG.orchestratorUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command)
    });

    const soResult = await soResponse.json();
    console.log(`[AE] SO response: ${JSON.stringify(soResult)}`);

    const status = soResult.success ? 'SUCCESS' : 'FAILED';
    const result = buildActionResult(diagnosis, status, {
      before_state: { variant: command.from_variant },
      after_state: { variant: command.to_variant },
      so_response: soResult
    });

    // Mark as processed
    processedDiagnoses.add(diagnosis.diagnosis_id);
    lastInterventionTime = Date.now();

    saveEvidence(result);
    console.log(`[AE] === ACTION ${status} ===`);
    
    res.json(result);

  } catch (error) {
    console.error(`[AE] SO execution failed: ${error.message}`);
    const result = buildActionResult(diagnosis, 'FAILED', {
      error: error.message
    });
    saveEvidence(result);
    res.json(result);
  }
});

function saveEvidence(result) {
  const filename = `action_result_${Date.now()}.json`;
  const filepath = path.join(EVIDENCE_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
  console.log(`[AE] Evidence saved: ${filename}`);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', component: 'action-engine' });
});

app.get('/status', (req, res) => {
  res.json({
    processed_count: processedDiagnoses.size,
    last_intervention: lastInterventionTime ? new Date(lastInterventionTime).toISOString() : null,
    cooldown_sec: CONFIG.cooldownSec
  });
});

// Start
app.listen(PORT, () => {
  console.log(`[AE] ActProof Action Engine started on port ${PORT}`);
  console.log(`[AE] Cooldown: ${CONFIG.cooldownSec}s`);
  console.log(`[AE] Orchestrator URL: ${CONFIG.orchestratorUrl}`);
});
