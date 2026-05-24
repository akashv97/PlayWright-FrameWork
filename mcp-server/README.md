Minimal MCP server for the PlayWright-FrameWork

There are two server implementations:

- JavaScript (simple): `mcp-server/server.js` (quick start)
- TypeScript (full features): `mcp-server/src/server.ts`

Install dependencies:

```powershell
npm install
```

Start the TypeScript server (uses `ts-node`):

```powershell
$env:PORT=3031; npm run mcp:start:ts
```

Endpoints (TypeScript server):
- `GET /mcp/manifest` - manifest
- `POST /mcp/execute` - create a job to run tests. Example body: `{ "command": "playwright:test", "args": ["--project=chromium"] }`
- `GET /mcp/job/:id` - get job status and logs
- `POST /mcp/upload` - multipart file upload (field name `file`)
- `GET /health` - health check

Auth: provide header `x-api-key` set to `MCP_API_KEY` env var (defaults to `changeme`).

Logs and job state are persisted to `mcp-server/jobs/*.json`.

Extend `mcp-server/src/server.ts` to adapt commands, add security, or persist jobs to a real DB.
