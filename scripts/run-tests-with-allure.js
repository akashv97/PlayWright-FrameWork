const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
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
  'progress',
  '--format',
  'allure-cucumberjs/reporter',
  ...process.argv.slice(2)
];

const testResult = spawnSync(process.execPath, [cucumberCommand, ...cucumberArgs], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit'
});

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
