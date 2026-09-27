const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const summaryFile = `.cucumber-summary-${process.pid}.txt`;
const summaryPath = path.join(projectRoot, summaryFile);
const cucumberCommand = path.join(
  projectRoot,
  'node_modules',
  '@cucumber',
  'cucumber',
  'bin',
  'cucumber-js'
);
const allureCommand = path.join(
  projectRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'allure.cmd' : 'allure'
);
const cucumberArgs = [
  '--require-module',
  'ts-node/register',
  '--require',
  './step-definitions/**/*.ts',
  './features/**/*.feature',
  '--format',
  `summary:${summaryFile}`,
  '--format',
  'allure-cucumberjs/reporter',
  ...process.argv.slice(2)
];

const testResult = spawnSync(process.execPath, [cucumberCommand, ...cucumberArgs], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit'
});

if (fs.existsSync(summaryPath)) {
  process.stdout.write(fs.readFileSync(summaryPath, 'utf8'));
  fs.unlinkSync(summaryPath);
}

const reportResult = spawnSync(
  allureCommand,
  ['generate', './allure-results', '--clean', '-o', './allure-report'],
  {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  }
);

if (reportResult.status === 0) {
  const reportServer = spawn(
    allureCommand,
    ['open', './allure-report'],
    {
      cwd: projectRoot,
      env: process.env,
      detached: true,
      stdio: 'ignore',
      shell: process.platform === 'win32'
    }
  );

  reportServer.unref();
}

process.exitCode = testResult.status ?? 1;
