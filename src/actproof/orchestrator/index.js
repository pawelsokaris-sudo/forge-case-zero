const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const EVIDENCE_DIR = '/app/evidence';
const PORT = 5000;

// Ensure evidence directory exists
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

// =============================================================================
// EXECUTE COMMAND
// Service Orchestrator executes commands without questioning their purpose
// =============================================================================
app.post('/execute', async (req, res) => {
  const command = req.body;
  console.log(`[SO] Received command: ${JSON.stringify(command)}`);

  const result = {
    command_received: command,
    executed_at: new Date().toISOString(),
    success: false,
    details: {}
  };

  try {
    switch (command.type) {
      case 'SWAP_VARIANT':
        result.details = await executeSwapVariant(command);
        result.success = true;
        break;
      
      case 'CONFIG_TUNE':
        result.details = { message: 'CONFIG_TUNE not implemented in demo' };
        result.success = true;
        break;
      
      case 'BUFFER_ENABLE':
        result.details = { message: 'BUFFER_ENABLE not implemented in demo' };
        result.success = true;
        break;
      
      case 'DEGRADE_MODE':
        result.details = { message: 'DEGRADE_MODE not implemented in demo' };
        result.success = true;
        break;
      
      default:
        result.details = { error: `Unknown command type: ${command.type}` };
        result.success = false;
    }
  } catch (error) {
    result.details = { error: error.message };
    result.success = false;
  }

  // Save execution log
  const logFile = path.join(EVIDENCE_DIR, `so_execution_${Date.now()}.json`);
  fs.writeFileSync(logFile, JSON.stringify(result, null, 2));

  console.log(`[SO] Execution ${result.success ? 'SUCCESS' : 'FAILED'}: ${JSON.stringify(result.details)}`);
  res.json(result);
});

// =============================================================================
// SWAP VARIANT IMPLEMENTATION
// Uses environment variable to trigger service restart with new variant
// =============================================================================
async function executeSwapVariant(command) {
  const { service_logical_id, from_variant, to_variant } = command;
  
  console.log(`[SO] Executing SWAP_VARIANT: ${service_logical_id} ${from_variant} -> ${to_variant}`);

  // In real implementation, this would:
  // 1. Update docker-compose environment
  // 2. Recreate the container
  // For demo, we use docker exec to update env and restart

  return new Promise((resolve, reject) => {
    // Method 1: Use docker-compose with environment override
    // This requires docker socket access
    const dockerCmd = `docker stop actproof-servicex && ` +
      `SERVICEX_VARIANT=${to_variant} docker-compose -f /app/docker-compose.yml up -d servicex`;
    
    // For demo simplicity, we'll use a different approach:
    // Signal the container to switch modes (if supported) or recreate
    
    // Simplified: just log the swap and return success
    // In production, this would actually restart the container
    
    console.log(`[SO] Would execute: docker-compose up -d --build servicex with VARIANT=${to_variant}`);
    
    // For demo, we'll use docker API if available
    exec(`docker inspect actproof-servicex`, (error, stdout, stderr) => {
      if (error) {
        console.log(`[SO] Docker not available, simulating swap`);
        resolve({
          method: 'simulated',
          from_variant,
          to_variant,
          message: 'Swap simulated (docker not available in this context)'
        });
        return;
      }

      // Try to restart with new variant
      const restartCmd = `docker rm -f actproof-servicex 2>/dev/null; ` +
        `cd /app && SERVICEX_VARIANT=${to_variant} docker-compose up -d --build servicex`;
      
      exec(restartCmd, (err, out, errOut) => {
        if (err) {
          console.log(`[SO] Restart failed, using simulation mode`);
          resolve({
            method: 'simulated',
            from_variant,
            to_variant,
            message: 'Swap simulated due to docker constraints'
          });
        } else {
          resolve({
            method: 'docker-compose',
            from_variant,
            to_variant,
            message: 'Container recreated with new variant'
          });
        }
      });
    });
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', component: 'orchestrator' });
});

// Start
app.listen(PORT, () => {
  console.log(`[SO] Service Orchestrator started on port ${PORT}`);
  console.log(`[SO] Ready to execute commands`);
});
