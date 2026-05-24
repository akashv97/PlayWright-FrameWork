import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

interface Job {
  id: string;
  status: JobStatus;
  command: string;
  args: string[];
  startedAt?: string;
  finishedAt?: string;
  exitCode?: number | null;
  log: string[];
}

const PORT = Number(process.env.PORT || 3030);
const API_KEY = process.env.MCP_API_KEY || 'changeme';

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.resolve(__dirname, '..', 'uploads');
const jobsDir = path.resolve(__dirname, '..', 'jobs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(jobsDir)) fs.mkdirSync(jobsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req: express.Request, file: Express.Multer.File, cb: (err: any, dest: string) => void) => cb(null, uploadDir),
  filename: (req: express.Request, file: Express.Multer.File, cb: (err: any, name: string) => void) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const jobs = new Map<string, Job>();

function saveJobLog(job: Job) {
  try {
    fs.writeFileSync(path.join(jobsDir, `${job.id}.json`), JSON.stringify(job, null, 2));
  } catch (e) {
    // ignore
  }
}

function runJob(job: Job) {
  job.status = 'running';
  job.startedAt = new Date().toISOString();
  saveJobLog(job);

  const proc = spawn(job.command, job.args, { shell: true });

  proc.stdout.on('data', (chunk) => {
    const line = chunk.toString();
    job.log.push(line);
    saveJobLog(job);
  });
  proc.stderr.on('data', (chunk) => {
    const line = chunk.toString();
    job.log.push(line);
    saveJobLog(job);
  });
  proc.on('close', (code) => {
    job.exitCode = code === null ? null : Number(code);
    job.finishedAt = new Date().toISOString();
    job.status = code === 0 ? 'completed' : 'failed';
    saveJobLog(job);
  });
}

// Simple API key auth middleware (optional)
function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.header('x-api-key') || '';
  if (API_KEY && key !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.get('/health', (req: express.Request, res: express.Response) => res.json({ status: 'ok' }));

app.get('/mcp/manifest', (req: express.Request, res: express.Response) => {
  res.json({
    name: 'playwright-framework-mcp',
    version: '0.2.0',
    description: 'TypeScript MCP server for Playwright framework',
    endpoints: {
      execute: '/mcp/execute',
      job: '/mcp/job/:id',
      upload: '/mcp/upload',
      health: '/health',
    },
  });
});

// Upload file endpoint
app.post('/mcp/upload', auth, upload.single('file'), (req: express.Request, res: express.Response) => {
  const r = req as unknown as { file?: Express.Multer.File };
  if (!r.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ path: r.file.path, filename: r.file.filename });
});

// Create and start a job to run Playwright or other commands
app.post('/mcp/execute', auth, (req: express.Request, res: express.Response) => {
  const body = (req.body as any) || {};
  // example body: { command: 'playwright:test', args: ['tests/my.spec.ts'] }
  const commandKey = body.command || 'playwright:test';
  let command = 'npx';
  let args: string[] = [];

  if (commandKey === 'playwright:test') {
    command = 'npx';
    args = ['playwright', 'test'];
    if (Array.isArray(body.args)) args = args.concat(body.args);
  } else if (commandKey === 'cucumber') {
    command = 'npx';
    args = ['cucumber-js', '--require-module', 'ts-node/register', '--require', './step-definitions/**/*.ts', './features/**/*.feature'];
    if (Array.isArray(body.args)) args = args.concat(body.args);
  } else if (body.rawCommand) {
    // allow arbitrary shell command, but be cautious
    command = body.rawCommand;
    args = Array.isArray(body.args) ? body.args : [];
  } else {
    return res.status(400).json({ error: 'Unknown command' });
  }

  const id = uuidv4();
  const job: Job = { id, status: 'queued', command: command, args, log: [] };
  jobs.set(id, job);
  saveJobLog(job);

  // Start async
  setTimeout(() => runJob(job), 100);

  res.json({ jobId: id });
});

app.get('/mcp/job/:id', auth, (req: express.Request, res: express.Response) => {
  const id = req.params.id as string;
  const job = jobs.get(id);
  if (!job) {
    // try to load from disk
    const p = path.join(jobsDir, `${id}.json`);
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      return res.json(data);
    }
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(job);
});

app.listen(PORT, () => {
  console.log(`MCP TypeScript server listening on http://localhost:${PORT}`);
});

export {};
