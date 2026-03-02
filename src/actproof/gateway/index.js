const express = require('express');
const app = express();

const SERVICEX_URL = process.env.SERVICEX_URL || 'http://servicex:3000';
const PORT = 8080;

app.get('/', async (req, res) => {
  try {
    const response = await fetch(`${SERVICEX_URL}/process`);
    const data = await response.json();
    
    if (!response.ok) {
      res.status(response.status).json({
        gateway: 'error',
        upstream: data
      });
      return;
    }
    
    res.json({
      gateway: 'ok',
      upstream: data
    });
  } catch (error) {
    res.status(502).json({
      gateway: 'error',
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', component: 'gateway' });
});

app.listen(PORT, () => {
  console.log(`[Gateway] Running on port ${PORT}`);
  console.log(`[Gateway] Proxying to ${SERVICEX_URL}`);
});
