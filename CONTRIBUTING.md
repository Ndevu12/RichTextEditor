# Contributing to RichTextEditor

Thank you for your interest in contributing! This guide will get you up and running.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Ndevu12/RichTextEditor.git
cd RichTextEditor

# Enable Corepack (for Yarn 4)
corepack enable

# Install dependencies
yarn install

# Start the dev server
yarn dev
```

## Development Scripts

| Script | What it does |
|--------|-------------|
| `yarn dev` | Vite dev server |
| `yarn build` | Build the library (ESM + CJS + DTS) |
| `yarn test` | Run unit tests |
| `yarn test:coverage` | Run tests with coverage |
| `yarn lint` | Lint with ESLint |
| `yarn format` | Format with Prettier |
| `yarn typecheck` | Type-check with TypeScript |
| `yarn storybook` | Start Storybook |

## Before Submitting a PR

```bash
yarn lint
yarn format:check
yarn typecheck
yarn test
yarn build
```

All checks must pass. Add tests for new features and update docs if the public API changes.

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): description
fix(scope): description
chore(scope): description
docs(scope): description
test(scope): description
```

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

---

For the detailed contribution guide (project structure, coding standards, testing guidelines, and architecture decisions), see [docs/contributing.md](docs/contributing.md).
