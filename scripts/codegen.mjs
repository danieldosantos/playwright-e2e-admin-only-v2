import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { config } from 'dotenv';

const cwd = process.cwd();
const envPath = path.resolve(cwd, 'env/.env');

if (!fs.existsSync(envPath)) {
  console.error('Arquivo env/.env não foi encontrado.');
  process.exit(1);
}

config({ path: envPath });

const baseUrl = process.env.BASE_URL;

if (!baseUrl) {
  console.error('BASE_URL não está definido em env/.env.');
  process.exit(1);
}

const [, , ...extraArgs] = process.argv;

const binDir = path.join(cwd, 'node_modules', '.bin');
const isWindows = process.platform === 'win32';
const localPlaywright = path.join(
  binDir,
  isWindows ? 'playwright.cmd' : 'playwright',
);
const hasLocalPlaywright = fs.existsSync(localPlaywright);
const command = hasLocalPlaywright
  ? localPlaywright
  : isWindows
    ? 'npx.cmd'
    : 'npx';
const args = hasLocalPlaywright
  ? ['codegen', baseUrl, ...extraArgs]
  : ['playwright', 'codegen', baseUrl, ...extraArgs];

const spawnOptions = {
  stdio: 'inherit',
  ...(isWindows ? { shell: true } : {}),
};

const child = spawn(command, args, spawnOptions);

child.on('close', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Falha ao executar o Playwright Codegen:', error);
  process.exit(1);
});
