const TARGET_URL = process.env.TARGET_URL || 'http://gateway:8080';
const RPS = parseInt(process.env.RPS || '10');
const DURATION_SEC = parseInt(process.env.DURATION_SEC || '600');

console.log(`[Load Generator] Starting`);
console.log(`[Load Generator] Target: ${TARGET_URL}`);
console.log(`[Load Generator] RPS: ${RPS}`);
console.log(`[Load Generator] Duration: ${DURATION_SEC}s`);

const intervalMs = 1000 / RPS;
let requestCount = 0;
let successCount = 0;
let errorCount = 0;

async function sendRequest() {
  requestCount++;
  try {
    const response = await fetch(TARGET_URL);
    if (response.ok) {
      successCount++;
    } else {
      errorCount++;
    }
  } catch (error) {
    errorCount++;
  }
}

// Start load generation
const interval = setInterval(sendRequest, intervalMs);

// Log stats every 10 seconds
setInterval(() => {
  console.log(`[Load Generator] Requests: ${requestCount}, Success: ${successCount}, Errors: ${errorCount}`);
}, 10000);

// Stop after duration
setTimeout(() => {
  clearInterval(interval);
  console.log(`[Load Generator] Completed. Total: ${requestCount}, Success: ${successCount}, Errors: ${errorCount}`);
  process.exit(0);
}, DURATION_SEC * 1000);
