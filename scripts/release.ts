/**
 * Semi-automated release script.
 *
 * Steps:
 *   1. Ensure working directory is clean
 *   2. Run full test suite
 *   3. Build and verify
 *   4. Bump version (patch/minor/major via CLI arg)
 *   5. Update CHANGELOG.md with release date
 *   6. Commit version bump + changelog
 *   7. Create git tag
 *   8. Push tag (triggers GitHub Actions release workflow)
 *
 * Usage:
 *   npx tsx scripts/release.ts patch        # 0.1.0 → 0.1.1
 *   npx tsx scripts/release.ts minor        # 0.1.0 → 0.2.0
 *   npx tsx scripts/release.ts major        # 0.1.0 → 1.0.0
 *   npx tsx scripts/release.ts --dry-run patch   # preview without committing
 *
 * Exit codes:
 *   0 — success
 *   1 — failure or validation error
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);

const dryRun = args.includes('--dry-run');
const bumpType = args.find((a) => ['patch', 'minor', 'major'].includes(a));

if (!bumpType) {
  console.error('Usage: npx tsx scripts/release.ts [--dry-run] <patch|minor|major>');
  console.error('  e.g. npx tsx scripts/release.ts patch');
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────

function run(label: string, command: string, opts?: { silent?: boolean }): string {
  console.log(`\n▸ ${label}`);
  if (dryRun && command.match(/git (commit|tag|push)/)) {
    console.log(`  [dry-run] Would run: ${command}`);
    return '';
  }
  try {
    const output = execSync(command, {
      cwd: root,
      stdio: opts?.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
    });
    return typeof output === 'string' ? output.trim() : '';
  } catch {
    console.error(`\n✗ Failed: ${label}`);
    process.exit(1);
  }
}

function bumpVersion(current: string, type: string): string {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Unknown bump type: ${type}`);
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Step 1: Check working directory ────────────────────────────────
console.log('🚀 Starting release process...');
if (dryRun) {
  console.log('   (dry-run mode — no commits or tags will be created)\n');
}

const status = run('Checking working directory', 'git status --porcelain', { silent: true });
if (status && !dryRun) {
  console.error('\n✗ Working directory is not clean. Commit or stash changes first.');
  console.error(status);
  process.exit(1);
}

// ── Step 2: Run tests ──────────────────────────────────────────────
run('Running test suite', 'yarn test');

// ── Step 3: Build and verify ───────────────────────────────────────
run('Building library', 'npx tsx scripts/build.ts --skip-typecheck');

// ── Step 4: Bump version ───────────────────────────────────────────
const pkgPath = resolve(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
const currentVersion = pkg.version as string;
const nextVersion = bumpVersion(currentVersion, bumpType);

console.log(`\n▸ Version bump: ${currentVersion} → ${nextVersion} (${bumpType})`);

if (!dryRun) {
  pkg.version = nextVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  console.log('  ✓ Updated package.json');
}

// ── Step 5: Update CHANGELOG.md ────────────────────────────────────
const changelogPath = resolve(root, 'CHANGELOG.md');
const changelog = readFileSync(changelogPath, 'utf-8');

// Replace [Unreleased] section marker or add a new dated section
const unreleasedHeader = '## [Unreleased]';
const datePattern = /## \[\d+\.\d+\.\d+\].*$/m;

let updatedChangelog: string;
if (changelog.includes(unreleasedHeader)) {
  // Replace [Unreleased] with the new version + date, add new [Unreleased] above
  updatedChangelog = changelog.replace(
    unreleasedHeader,
    `${unreleasedHeader}\n\n## [${nextVersion}] - ${today()}`,
  );
  console.log(`  ✓ Added [${nextVersion}] section to CHANGELOG.md`);
} else if (datePattern.test(changelog)) {
  // Insert the new version before the first existing version
  updatedChangelog = changelog.replace(
    datePattern,
    `## [${nextVersion}] - ${today()}\n\n$&`,
  );
  console.log(`  ✓ Inserted [${nextVersion}] section into CHANGELOG.md`);
} else {
  console.log('  ○ Could not find a suitable place in CHANGELOG.md, skipping update');
  updatedChangelog = changelog;
}

if (!dryRun && updatedChangelog !== changelog) {
  writeFileSync(changelogPath, updatedChangelog, 'utf-8');
}

// ── Step 6: Commit ─────────────────────────────────────────────────
run('Committing version bump', `git add -A && git commit -m 'chore(release): v${nextVersion}'`);

// ── Step 7: Create tag ─────────────────────────────────────────────
run('Creating git tag', `git tag -a v${nextVersion} -m 'Release v${nextVersion}'`);

// ── Step 8: Push tag ───────────────────────────────────────────────
run('Pushing tag to origin', `git push origin v${nextVersion}`);

// ── Done ───────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
if (dryRun) {
  console.log(`✓ Dry run complete. Would release v${nextVersion}.`);
  console.log('  Run without --dry-run to perform the actual release.');
} else {
  console.log(`✓ Released v${nextVersion} successfully!`);
  console.log('  The GitHub Actions release workflow will publish to npm.');
  console.log(`  Monitor: https://github.com/Ndevu12/RichTextEditor/actions`);
}
