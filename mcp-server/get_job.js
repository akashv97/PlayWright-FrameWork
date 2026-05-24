const http = require('http');

const id = process.argv[2];
if (!id) {
  console.error('Usage: node get_job.js <jobId>');
  process.exit(2);
}

const options = {
  hostname: 'localhost',
  port: 3030,
  path: `/mcp/job/${id}`,
  method: 'GET',
  headers: { 'x-api-key': process.env.MCP_API_KEY || 'changeme' },
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
req.end();
