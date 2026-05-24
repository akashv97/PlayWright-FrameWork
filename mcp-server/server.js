const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3030;

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve(null);
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve(data.toString());
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const method = req.method || 'GET';

  // Simple health
  if (parsed.pathname === '/health' && method === 'GET') {
    return sendJson(res, 200, { status: 'ok' });
  }

  // MCP manifest endpoint
  if (parsed.pathname === '/mcp/manifest' && method === 'GET') {
    const manifest = {
      name: 'playwright-framework-mcp',
      version: '0.1.0',
      description: 'Minimal MCP-compatible server for the Playwright framework',
      endpoints: {
        execute: '/mcp/execute',
        health: '/health',
      },
    };
    return sendJson(res, 200, manifest);
  }

  // Execute endpoint (example)
  if (parsed.pathname === '/mcp/execute' && method === 'POST') {
    const payload = await parseBody(req);
    // Echo back with a simple result; extend this to integrate with the repo
    return sendJson(res, 200, { received: payload, result: 'ok' });
  }

  // Unknown route
  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`MCP server listening on http://localhost:${PORT}`);
});

module.exports = server;
