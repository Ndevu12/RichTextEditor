/**
 * Clean script — removes build artifacts.
 * Usage: npx tsx scripts/clean.ts
 */
import { rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dirs = ['dist', 'storybook-static'];

for (const dir of dirs) {
  const target = resolve(root, dir);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`✓ Removed ${dir}/`);
  } else {
    console.log(`○ ${dir}/ does not exist, skipping`);
  }
}

console.log('Clean complete.');
