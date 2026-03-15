/**
 * Build script — runs tsup and reports output.
 * Usage: npx tsx scripts/build.ts
 */
import { execSync } from 'node:child_process';

console.log('Building with tsup...');
execSync('yarn build', { stdio: 'inherit', cwd: import.meta.dirname + '/..' });
console.log('Build complete.');
