#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_DEPENDENCY = 'rich-text-editor-ndevu';
const DISALLOWED_PREFIXES = ['link:', 'file:'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const manifestPaths = [
  'examples/react-demo/package.json',
  'examples/nextjs-demo/package.json',
];

function hasDisallowedPrefix(value) {
  return DISALLOWED_PREFIXES.some((prefix) => value.startsWith(prefix));
}

async function readManifest(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  const raw = await readFile(absolutePath, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const violations = [];

  for (const manifestPath of manifestPaths) {
    const manifest = await readManifest(manifestPath);
    const depValue = manifest?.dependencies?.[TARGET_DEPENDENCY];

    if (!depValue) {
      violations.push(
        `${manifestPath}: missing dependencies.${TARGET_DEPENDENCY} entry`
      );
      continue;
    }

    if (typeof depValue !== 'string') {
      violations.push(
        `${manifestPath}: dependencies.${TARGET_DEPENDENCY} must be a string`
      );
      continue;
    }

    if (hasDisallowedPrefix(depValue)) {
      violations.push(
        `${manifestPath}: dependencies.${TARGET_DEPENDENCY} uses disallowed specifier "${depValue}"`
      );
    }
  }

  if (violations.length > 0) {
    console.error('Dependency policy check failed:\n');
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    console.error(
      '\nUse an npm semver range for rich-text-editor-ndevu (for example: ^0.1.0).'
    );
    process.exit(1);
  }

  console.log(
    'Dependency policy check passed for example manifests.'
  );
}

main().catch((error) => {
  console.error('Unexpected error while checking dependency policy.');
  console.error(error);
  process.exit(1);
});
