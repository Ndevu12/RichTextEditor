/**
 * Clean script — removes build artifacts and caches.
 *
 * Usage:
 *   npx tsx scripts/clean.ts          # clean build artifacts only
 *   npx tsx scripts/clean.ts --all    # include caches (coverage, storybook, .turbo)
 */
import { rmSync, existsSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const cleanAll = args.includes('--all');

/** Directories always cleaned (build output). */
const buildDirs = ['dist'];

/** Directories only cleaned with --all flag (caches & generated). */
const cacheDirs = ['coverage', 'storybook-static', '.turbo'];

const dirs = cleanAll ? [...buildDirs, ...cacheDirs] : buildDirs;

let removed = 0;

for (const dir of dirs) {
  const target = resolve(root, dir);
  if (existsSync(target)) {
    const stat = statSync(target);
    rmSync(target, { recursive: true, force: true });
    console.log(`  ✓ Removed ${relative(root, target)}/`);
    removed++;
  } else {
    console.log(`  ○ ${dir}/ does not exist, skipping`);
  }
}

console.log(`\nClean complete. Removed ${removed} director${removed === 1 ? 'y' : 'ies'}.`);
if (!cleanAll) {
  console.log('Tip: use --all to also remove coverage, storybook-static, and .turbo.');
}
