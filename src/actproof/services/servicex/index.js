const express = require('express');
const app = express();

const VARIANT = process.env.VARIANT || 'heavy';
const PORT = 3000;

// Metrics storage
let metrics = {
  requestCount: 0,
  errorCount: 0,
  retryCount: 0,
  latencies: []
};

// Reset metrics window every 60 seconds
setInterval(() => {
  metrics = {
    requestCount: 0,
    errorCount: 0,
    retryCount: 0,
    latencies: []
  };
}, 60000);

// Simulate latency based on variant
function getLatency() {
  if (VARIANT === 'heavy') {
    // Heavy: 200-800ms with occasional spikes to 1500ms
    const base = 200 + Math.random() * 600;
    const spike = Math.random() < 0.15 ? 700 : 0;
    return Math.round(base + spike);
  } else {
    // Light: 20-80ms, stable
    return Math.round(20 + Math.random() * 60);
  }
}

// Simulate error rate based on variant
function shouldError() {
  if (VARIANT === 'heavy') {
    return Math.random() < 0.08; // 8% error rate
  } else {
    return Math.random() < 0.01; // 1% error rate
  }
}

// Simulate retry behavior
function shouldRetry() {
  if (VARIANT === 'heavy') {
    return Math.random() < 0.12; // 12% retry rate
  } else {
    return Math.random() < 0.02; // 2% retry rate
  }
}

// Main endpoint
app.get('/process', async (req, res) => {
  const startTime = Date.now();
  metrics.requestCount++;

  const latency = getLatency();
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, latency));
  
  metrics.latencies.push(latency);

  if (shouldRetry()) {
    metrics.retryCount++;
  }

  if (shouldError()) {
    metrics.errorCount++;
    res.status(500).json({ 
      error: 'Internal error', 
      variant: VARIANT,
      latency_ms: latency
    });
    return;
  }

  res.json({ 
    status: 'ok', 
    variant: VARIANT,
    latency_ms: latency
  });
});

// MCP Observe endpoint - CRITICAL for CFO
app.get('/mcp/observe', (req, res) => {
  const latencies = metrics.latencies.length > 0 ? metrics.latencies : [0];
  const sorted = [...latencies].sort((a, b) => a - b);
  const p99Index = Math.floor(sorted.length * 0.99);
  const latency_p99 = sorted[p99Index] || sorted[sorted.length - 1] || 0;

  const total = metrics.requestCount || 1;
  const error_rate = metrics.errorCount / total;
  const retry_rate = metrics.retryCount / total;

  res.json({
    service_logical_id: 'servicex',
    current_variant: VARIANT,
    timestamp: new Date().toISOString(),
    status: error_rate > 0.1 ? 'degraded' : 'ready',
    metrics: {
      latency_p99: latency_p99,
      retry_rate: parseFloat(retry_rate.toFixed(4)),
      error_rate: parseFloat(error_rate.toFixed(4)),
      queue_depth: 0,
      request_count_window: metrics.requestCount
    },
    events: []
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', variant: VARIANT });
});

app.listen(PORT, () => {
  console.log(`[ServiceX] Running in ${VARIANT.toUpperCase()} mode on port ${PORT}`);
  console.log(`[ServiceX] MCP endpoint: http://localhost:${PORT}/mcp/observe`);
});
