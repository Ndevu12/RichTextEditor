# Scripts

Build, clean, and release automation scripts. All scripts are written in TypeScript and run via `tsx`.

## Available Scripts

### `clean.ts`

Removes build artifacts.

```bash
yarn clean            # removes dist/
yarn clean:all        # also removes coverage/, storybook-static/, .turbo/
```

### `build.ts`

Full build pipeline: clean → type-check → tsup bundle → verify output.

```bash
yarn tsx scripts/build.ts                  # full build
yarn tsx scripts/build.ts --skip-typecheck # skip type-check (CI use)
```

The `prepublishOnly` hook runs this automatically before `npm publish`.

### `release.ts`

Semi-automated release: tests → build → version bump → changelog update → git tag → push (triggers CI publish).

```bash
yarn release patch        # 0.1.0 → 0.1.1
yarn release minor        # 0.1.0 → 0.2.0
yarn release major        # 0.1.0 → 1.0.0
yarn release --dry-run patch   # preview without committing
```

The push of the `v*` tag triggers the GitHub Actions release workflow (`.github/workflows/release.yml`), which publishes to npm with provenance.

### `verify-demos-dependency-policy.mjs`

Checks that demo/playground manifests use npm semver for `rich-text-editor-ndevu` and do not use local-link dependency specifiers.

```bash
yarn verify:demos
```
