/**
 * Build script — clean, type-check, bundle with tsup, and verify output.
 *
 * Usage:
 *   npx tsx scripts/build.ts             # full build (clean → typecheck → tsup → verify)
 *   npx tsx scripts/build.ts --skip-typecheck   # skip type-check (for CI where it runs separately)
 *
 * Exit codes:
 *   0 — success
 *   1 — build or verification failed
 */
import { execSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const skipTypecheck = args.includes('--skip-typecheck');

/** Expected output files and their minimum sizes (bytes). */
const EXPECTED_FILES: Array<{ path: string; minSize: number }> = [
  { path: 'dist/index.js', minSize: 1000 },
  { path: 'dist/index.cjs', minSize: 1000 },
  { path: 'dist/index.d.ts', minSize: 500 },
  { path: 'dist/index.css', minSize: 500 },
];

function run(label: string, command: string): void {
  console.log(`\n▸ ${label}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: root });
  } catch {
    console.error(`\n✗ Failed: ${label}`);
    process.exit(1);
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} KB`;
}

// ── Step 1: Clean ──────────────────────────────────────────────────
run('Cleaning previous build', 'npx tsx scripts/clean.ts');

// ── Step 2: Type-check ─────────────────────────────────────────────
if (skipTypecheck) {
  console.log('\n▸ Type-check skipped (--skip-typecheck)');
} else {
  run('Type-checking', 'yarn typecheck');
}

// ── Step 3: Bundle with tsup ───────────────────────────────────────
run('Building with tsup', 'yarn tsup');

// ── Step 4: Verify output ──────────────────────────────────────────
console.log('\n▸ Verifying dist output');
let allGood = true;

for (const { path: filePath, minSize } of EXPECTED_FILES) {
  const abs = resolve(root, filePath);
  if (!existsSync(abs)) {
    console.error(`  ✗ Missing: ${filePath}`);
    allGood = false;
    continue;
  }
  const size = statSync(abs).size;
  if (size < minSize) {
    console.error(
      `  ✗ ${filePath} is suspiciously small (${formatSize(size)}, expected ≥${formatSize(minSize)})`,
    );
    allGood = false;
    continue;
  }
  console.log(`  ✓ ${filePath} (${formatSize(size)})`);
}

if (!allGood) {
  console.error('\n✗ Build verification failed.');
  process.exit(1);
}

console.log('\n✓ Build completed and verified successfully.');
