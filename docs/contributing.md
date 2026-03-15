# Contributing (Detailed Guide)

Detailed contribution guide for `rich-text-editor-ndevu`. For a quick overview, see the root [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## Development Setup

### Prerequisites

- **Node.js** ≥ 20
- **Yarn 4** (Berry) — installed via Corepack
- **Git**

### Clone & Install

```bash
git clone https://github.com/Ndevu12/RichTextEditor.git
cd RichTextEditor

# Enable Corepack (ships with Node 20+)
corepack enable

# Install dependencies
yarn install
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Build the library (ESM + CJS + DTS) via tsup |
| `yarn build:watch` | Build in watch mode |
| `yarn test` | Run unit tests (Vitest) |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:coverage` | Run tests with code coverage |
| `yarn test:e2e` | Run end-to-end tests (Playwright) |
| `yarn lint` | Lint source files (ESLint) |
| `yarn lint:fix` | Auto-fix lint issues |
| `yarn format` | Format source files (Prettier) |
| `yarn format:check` | Check formatting without writing |
| `yarn typecheck` | Type-check with TypeScript compiler |
| `yarn storybook` | Start Storybook dev server (port 6006) |
| `yarn build-storybook` | Build static Storybook |
| `yarn clean` | Remove build artifacts |

### Project Structure

See [docs/architecture.md](./architecture.md) for the full directory structure and architectural overview.

---

## Coding Standards

### TypeScript

- **Strict mode** enabled — no `any` unless absolutely necessary
- All public APIs must have explicit type annotations
- Use `type` imports: `import type { Foo } from './bar'`
- Target: ES2020, JSX: react-jsx

### ESLint

ESLint v9 flat config at `eslint.config.js`. Key rules:
- `@typescript-eslint/no-explicit-any` — error
- `react-hooks/rules-of-hooks` — error
- `react-hooks/exhaustive-deps` — warn

Run before committing:

```bash
yarn lint
```

### Prettier

Config in `package.json`. Settings:
- Single quotes
- Trailing commas
- 100 char print width

```bash
yarn format       # Fix
yarn format:check # Verify
```

### CSS

- Class names follow **BEM-like `.rte-*`** convention
- Use **CSS custom properties** (`--rte-*` tokens) for all colors and dimensions
- No CSS-in-JS — only plain `.css` files in `src/styles/`

---

## Testing Guidelines

### Unit Tests

- Test files go in `tests/unit/` mirroring the source structure
- Use **Vitest** + **React Testing Library** + **jest-dom** matchers
- Config: `config/vitest.config.ts`
- Aim for ≥80% coverage across statements, branches, functions, and lines

```bash
yarn test              # Run once
yarn test:watch        # Watch mode
yarn test:coverage     # With coverage report
```

#### Writing a Unit Test

```ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RichTextEditor } from '@/components/Editor';

describe('RichTextEditor', () => {
  it('renders without crashing', () => {
    render(<RichTextEditor value="" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

- Test files in `tests/e2e/`
- Use **Playwright** (Chromium + Firefox)
- Config: `tests/e2e/playwright.config.ts`
- Tests run against the playground app

```bash
yarn test:e2e
```

---

## Pull Request Workflow

### Branch Naming

```
feat/<description>     # New features
fix/<description>      # Bug fixes
chore/<description>    # Maintenance, tooling
docs/<description>     # Documentation only
```

### Commit Messages

Follow conventional commits:

```
feat(toolbar): add highlight button
fix(link-dialog): handle empty URL submission
chore(deps): update tiptap to 3.20.2
docs(api): add useHistory examples
test(commands): add toggleBold edge cases
```

### Before Submitting

1. Run the full check suite:
   ```bash
   yarn lint
   yarn format:check
   yarn typecheck
   yarn test
   yarn build
   ```
2. Ensure no regressions in existing tests
3. Add tests for new functionality
4. Update documentation if the public API changes

### Review Process

1. Open a PR against the `main` branch
2. Fill in the PR template (description, related issues, checklist)
3. Wait for CI to pass (lint, type-check, test, build)
4. Request review from a maintainer
5. Address feedback, then merge

---

## Architecture Decisions

When working on the codebase, keep these design decisions in mind:

- **`core/` must stay framework-agnostic** — no React imports in `core/` files
- **Hooks bridge core ↔ React** — each hook has one focused responsibility
- **Toolbar is declarative** — consumers pass string identifiers, not components
- **Themes are CSS-only** — no JS runtime for theming, just data attributes
- **Extensions are Tiptap-based** — don't re-invent ProseMirror functionality

See [docs/architecture.md](./architecture.md) for the full decision log.
