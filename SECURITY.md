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

Verified with: `yarn build` (tsup), `yarn test:coverage`, `yarn build-storybook`,
`yarn typecheck`, `yarn lint`, and a `tsx` script run (`yarn clean`).

### `examples/nextjs-demo/package.json`

| Override | Pinned by | Advisory | Remove when |
| --- | --- | --- | --- |
| `postcss: ^8.5.25` | `next` depends on exactly `postcss@8.4.31` | GHSA-r28c-9q8g-f849, GHSA-6g55-p6wh-862q, GHSA-qx2v-qp2m-jg93 | `next` depends on `postcss >= 8.5.18` |
| `sharp: ^0.35.3` | `next` declares `sharp@^0.34.5` | GHSA-f88m-g3jw-g9cj | `next` declares `sharp@^0.35` |

Verified with: `yarn build` in `examples/nextjs-demo` (compiles and prerenders
all static pages).

To check whether an override is still needed:

```sh
npm view tsup dependencies.esbuild
npm view next dependencies.postcss optionalDependencies.sharp
```
