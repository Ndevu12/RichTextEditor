# Contributing to RichTextEditor

Thank you for your interest in contributing to `rich-text-editor-ndevu`! Whether you're fixing a bug, adding a feature, improving docs, or reporting an issue, your help is welcome and appreciated.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Development Scripts](#development-scripts)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold a welcoming, inclusive, and harassment-free environment for everyone.

---

## How to Contribute

### Reporting Bugs

- Search [existing issues](https://github.com/Ndevu12/RichTextEditor/issues) first to avoid duplicates
- Open a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Browser/OS/Node version

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the use case and why it would benefit users
- If possible, propose an API or approach

### Submitting Code

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes (see guidelines below)
4. Submit a pull request

---

## Development Setup

### Prerequisites

- **Node.js** >= 20
- **Yarn 4** (Berry) via Corepack
- **Git**

### Getting Started

```bash
# Fork and clone
git clone https://github.com/<your-username>/RichTextEditor.git
cd RichTextEditor

# Enable Corepack (ships with Node 20+)
corepack enable

# Install dependencies
yarn install

# Start the dev server
yarn dev
```

---

## Development Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Build the library (ESM + CJS + DTS) via tsup |
| `yarn build:watch` | Build in watch mode |
| `yarn test` | Run unit tests (Vitest) |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:coverage` | Run tests with code coverage report |
| `yarn test:e2e` | Run end-to-end tests (Playwright) |
| `yarn lint` | Lint source files (ESLint) |
| `yarn lint:fix` | Auto-fix lint issues |
| `yarn format` | Format source files (Prettier) |
| `yarn format:check` | Check formatting without writing |
| `yarn typecheck` | Type-check with TypeScript compiler |
| `yarn storybook` | Start Storybook dev server (port 6006) |
| `yarn build-storybook` | Build static Storybook |
| `yarn clean` | Remove build artifacts |

---

## Project Structure

```
src/
├── index.ts              # Public API barrel export
├── components/           # React components (Editor, Toolbar, Dialogs, Plugins)
├── core/                 # Framework-agnostic engine (commands, schema, store)
├── hooks/                # React hooks (useEditor, useHistory, useToolbar)
├── styles/               # CSS (themes, editor, toolbar, dialogs)
├── types/                # TypeScript type definitions
└── utils/                # DOM and string utilities
tests/
├── unit/                 # Vitest unit tests
└── e2e/                  # Playwright end-to-end tests
docs/                     # Detailed documentation
playground/               # Local development playground app
examples/                 # React and Next.js demo apps
storybook/                # Storybook stories
```

See [docs/architecture.md](docs/architecture.md) for the full architectural overview.

---

## Coding Standards

### TypeScript

- **Strict mode** is enabled — avoid `any` unless absolutely necessary
- All public APIs must have explicit type annotations
- Use `type` imports: `import type { Foo } from './bar'`

### ESLint & Prettier

- ESLint v9 flat config at `eslint.config.js`
- Prettier config in `package.json` (single quotes, trailing commas, 100 char width)

```bash
yarn lint          # Check for lint errors
yarn lint:fix      # Auto-fix lint errors
yarn format        # Format all source files
yarn format:check  # Verify formatting
```

### CSS

- Class names use **BEM-like `.rte-*`** convention
- Colors and dimensions use **CSS custom properties** (`--rte-*` tokens)
- No CSS-in-JS — plain `.css` files only

### Architecture Rules

- **`core/` is framework-agnostic** — no React imports allowed
- **Hooks bridge core and React** — one clear responsibility per hook
- **Toolbar is declarative** — consumers pass string identifiers, not components
- **Themes are CSS-only** — `data-theme` attribute + CSS custom properties

---

## Testing

We aim for **>= 80% code coverage** across statements, branches, functions, and lines.

### Unit Tests

- Located in `tests/unit/` mirroring the `src/` structure
- Framework: **Vitest** + **React Testing Library** + **jest-dom**

```bash
yarn test              # Run once
yarn test:watch        # Watch mode
yarn test:coverage     # With coverage report
```

### End-to-End Tests

- Located in `tests/e2e/`
- Framework: **Playwright** (Chromium + Firefox)

```bash
yarn test:e2e
```

### Writing Tests

- Every new feature or bug fix should include tests
- Test behavior, not implementation details
- Use meaningful test descriptions

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): short description

[optional body]

[optional footer]
```

### Types

| Type | Use for |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `chore` | Tooling, config, maintenance |
| `refactor` | Code changes that neither fix bugs nor add features |
| `style` | Formatting, whitespace (no code logic changes) |
| `perf` | Performance improvements |

### Examples

```
feat(toolbar): add highlight button
fix(link-dialog): handle empty URL submission
docs(api): add useHistory usage examples
test(commands): add toggleBold edge cases
chore(deps): update tiptap to 3.20.2
```

---

## Pull Request Process

### Branch Naming

```
feat/<description>      # New features
fix/<description>       # Bug fixes
chore/<description>     # Maintenance, tooling
docs/<description>      # Documentation only
test/<description>      # Test additions/fixes
```

### Before Submitting

Run the full check suite and make sure everything passes:

```bash
yarn lint
yarn format:check
yarn typecheck
yarn test
yarn build
```

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated if the public API changed
- [ ] Commit messages follow conventional commits
- [ ] PR description clearly explains what and why

### Review Process

1. Open a PR against the `main` branch
2. Fill in the PR template
3. Wait for CI checks to pass (lint, type-check, test, build)
4. Address review feedback
5. A maintainer will merge once approved

---

## Reporting Issues

When reporting issues, please include:

- **Bug reports:** Steps to reproduce, expected vs actual behavior, browser/OS info, minimal reproduction if possible
- **Feature requests:** Use case description, proposed API or behavior, any alternatives considered
- **Questions:** Check [docs/](docs/) first, then open a discussion or issue

---

## Need Help?

- Browse the [documentation](docs/README.md) for API reference, architecture, theming, and plugin guides
- See [docs/contributing.md](docs/contributing.md) for deeper technical details on coding standards, testing patterns, and architecture decisions
- Open an issue if you're stuck — we're happy to help!

Thank you for contributing!
