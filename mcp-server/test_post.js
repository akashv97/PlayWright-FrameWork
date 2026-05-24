const http = require('http');

const data = JSON.stringify({ command: 'playwright:test', args: ['--help'] });

const options = {
  hostname: 'localhost',
  port: 3030,
  path: '/mcp/execute',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'x-api-key': process.env.MCP_API_KEY || 'changeme',
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', body);
  });
});

req.on('error', (err) => console.error('ERR', err));
req.write(data);
req.end();
