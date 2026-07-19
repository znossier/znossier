#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const result = spawnSync('npx', ['tsx', join(dir, 'validate-grid.ts')], {
  stdio: 'inherit',
  cwd: join(dir, '..'),
});

process.exit(result.status ?? 1);
