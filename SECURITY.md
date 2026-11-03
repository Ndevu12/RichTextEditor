# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.

## Dependency overrides

Some advisories cannot be closed by a version bump, because the vulnerable
package is pinned by an upstream dependency rather than declared here. Where
that happens we use a Yarn `resolutions` entry, but only after verifying the
forced version actually works.

Each override below is a liability, not a fix we own: it forces a version the
upstream package did not test against. **Remove the entry as soon as upstream
ships a release that satisfies the advisory on its own**, and re-run the
verification listed beside it.

### `package.json` (root)

| Override | Pinned by | Advisory | Remove when |
| --- | --- | --- | --- |
| `esbuild: ^0.28.1` | `tsup` declares `esbuild@^0.27.0`, which cannot reach the patched 0.28.1 | GHSA-g7r4-m6w7-qqqr | `tsup` ships a release depending on `esbuild@^0.28` |
| `glob: ^14.0.3` | `cacache` and Storybook's docgen plugin declare `glob@^13` | GHSA-3g3m-2fjr-6pw4 | those packages depend on `glob >= 14.0.2` |
| `minimatch` patched `11.0.4` | ESLint declares `minimatch@^3.1.5` and typescript-eslint declares `minimatch@^10.2.2`. The patch also restores the callable `require("minimatch")` export that `eslint-plugin-react` uses | GHSA-g3hv-75wg-m249 | those packages depend on `minimatch >= 11.0.1` and `eslint-plugin-react` no longer calls the package as a function |

Verified with: `yarn build` (tsup), `yarn test:coverage`, `yarn build-storybook`,
`yarn typecheck`, `yarn lint`, and a `tsx` script run (`yarn clean`).

`eslint-plugin-react@7.37.5` is patched in place, not overridden to another version. ESLint 10 removed `context.getFilename()`, and that release still calls it while loading `react/display-name`. The patch uses `context.filename` when the method is gone, which is what upstream master already does. Remove the patch when a published `eslint-plugin-react` does the same.

### `examples/nextjs-demo/package.json`

| Override | Pinned by | Advisory | Remove when |
| --- | --- | --- | --- |
| `postcss: ^8.5.25` | `next` depends on exactly `postcss@8.4.31` | GHSA-r28c-9q8g-f849, GHSA-6g55-p6wh-862q, GHSA-qx2v-qp2m-jg93 | `next` depends on `postcss >= 8.5.18` |
| `sharp: ^0.35.5` | `next` still allows `sharp@^0.34.3` alongside `^0.35.5` | GHSA-g89c-p67h-r497, GHSA-2jg2-4ch7-h545, CVE-2026-96889 | `next` drops the `sharp@^0.34` alternative |

Verified with: `yarn build` in `examples/nextjs-demo` (compiles and prerenders
all static pages).

### `playground/package.json` and `examples/react-demo/package.json`

| Override | Pinned by | Advisory | Remove when |
| --- | --- | --- | --- |
| `glob: ^14.0.3` | Vite's dependency tree still resolves `glob@13` | GHSA-3g3m-2fjr-6pw4 | the tree depends on `glob >= 14.0.2` |
| `minimatch: ^11.0.4` | the same tree resolves `minimatch` below 11 | GHSA-g3hv-75wg-m249 | the tree depends on `minimatch >= 11.0.1` |

Verified with: `yarn build` in `playground` and `examples/react-demo`.

To check whether an override is still needed:

```sh
npm view tsup dependencies.esbuild
npm view next dependencies.postcss optionalDependencies.sharp
```
