# RichTextEditor — Implementation Plan

> **Package:** `rich-text-editor-ndevu`

> **Author:** Jean Paul Elisa NIYOKWIZERWA

> **Created:** 15 March 2026

> **Branch:** ``

> **Last updated:** —

---

## Progress Dashboard

**Overall:** 23 / 25 phases complete | **92% done**

> Update the table below as each phase progresses. Use the status markers:
> `Not Started`, `In Progress`, `Blocked`, `Complete`, `Skipped`

| # | Phase | Status | Started | Completed | Notes |
|---|-------|--------|---------|-----------|-------|
| 1 | Yarn 4, Package Manager & Git Hygiene | `Complete` | 2026-03-15 | 2026-03-15 | Yarn 4.13.0; ESLint pinned to v9 for plugin compat |
| 2 | TypeScript, Bundler & Linting Config | `Complete` | 2026-03-15 | 2026-03-15 | Migrated to ESLint v9 flat config; added @eslint/js + globals |
| 3 | Type System Foundation | `Complete` | 2026-03-15 | 2026-03-15 | All interfaces, types, and constants defined |
| 4 | Core Engine & Zustand Store | `Complete` | 2026-03-15 | 2026-03-15 | schema, engine, commands, store (Zustand), model, barrel |
| 5 | React Hooks Layer | `Complete` | 2026-03-15 | 2026-03-15 | useEditor, useToolbar, useHistory; Tiptap v3 setContent API |
| 6 | Core Components: Editor Shell | `Complete` | 2026-03-15 | 2026-03-15 | ContentEditable, Parser, Serializer, EditorProvider, EditorWrapper, RichTextEditor, full public API |
| 7 | Toolbar System | `Complete` | 2026-03-15 | 2026-03-15 | ToolbarButton, ToolbarSeparator, ToolbarGroup, Toolbar with roving tabindex, wired into EditorWrapper |
| 8 | Styles & Theming | `Complete` | 2026-03-15 | 2026-03-15 | 32 CSS tokens per theme, .rte-* BEM classes, prose typography, 7.40 KB CSS bundle |
| 9 | Plugins: Text Formatting & Headings | `Complete` | 2026-03-15 | 2026-03-15 | Underline extension installed, added to schema; StarterKit handles bold/italic/strike/headings |
| 10 | Plugins: Lists & Blockquotes | `Complete` | 2026-03-15 | 2026-03-15 | ListsPlugin with sinkListItem/liftListItem; lists + blockquote already in StarterKit |
| 11 | Plugins: Links & Link Dialog | `Complete` | 2026-03-15 | 2026-03-15 | Link extension, LinkPlugin helpers, accessible LinkDialog, dialog.css, wired into EditorWrapper |
| 12 | Plugins: Images & Image Dialog | `Complete` | 2026-03-15 | 2026-03-15 | Image extension, ImagePlugin (URL + base64), accessible ImageDialog (drag-drop, preview), dialog.css extensions |
| 13 | Plugins: Code Blocks & Syntax HL | `Complete` | 2026-03-15 | 2026-03-15 | CodeBlockLowlight + lowlight (common bundle), highlight.css (light GitHub + dark Catppuccin) |
| 14 | Plugins: History (Undo / Redo) | `Complete` | 2026-03-15 | 2026-03-15 | StarterKit undoRedo configured (depth:100, newGroupDelay:500), undo/redo buttons disabled via canUndo/canRedo |
| 15 | Clipboard, Paste Handling & Utilities | `Complete` | 2026-03-15 | 2026-03-15 | dom.ts (sanitize, focus, selection), string.ts (URL, escape, shortcut), paste wired via transformPastedHTML |
| 16 | Accessibility & Keyboard Navigation | `Complete` | 2026-03-15 | 2026-03-15 | Roving tabindex, ARIA attrs on editor/toolbar/dialogs, focus restoration, ariaLabel prop |
| 17 | Playground App | `Complete` | 2026-03-15 | 2026-03-15 | Vite 6.4.1, React 19, link:../ for local pkg, 4 toolbar presets, theme/readOnly toggle, HTML output panel |
| 18 | Storybook Setup & Stories | `Complete` | 2026-03-15 | 2026-03-15 | Storybook 8.6.18 (all packages aligned); 3 story files (18 stories total) |
| 19 | Example Apps (React & Next.js) | `Complete` | 2026-03-15 | 2026-03-15 | React demo (Vite blog editor), Next.js 14 demo (SSR-safe dynamic import); code-split components |
| 20 | Unit & Integration Tests | `Complete` | 2026-03-15 | 2026-03-15 | 12 test files, 182 tests, coverage: stmts 84.8%, branches 75.4%, funcs 88%, lines 87.6% |
| 21 | End-to-End Tests | `Not Started` | — | — | Deferred to after remaining phases |
| 22 | Documentation | `Complete` | 2026-03-15 | 2026-03-15 | 5 docs files, CONTRIBUTING.md, CHANGELOG.md |
| 23 | CI / CD Pipelines | `Complete` | 2026-03-15 | 2026-03-15 | ci.yml (3 jobs), release.yml (npm provenance), YAML issue templates, PR template |
| 24 | Build Scripts & Release Pipeline | `Complete` | 2026-03-15 | 2026-03-15 | clean.ts (--all flag), build.ts (clean→typecheck→tsup→verify), release.ts (bump→tag→push) |
| 25 | Final Polish & v0.1.0 Release | `Not Started` | — | — | |

### Milestone Markers

| Milestone | Phases | Target | Reached |
|-----------|--------|--------|---------|
| **M1 — Buildable project** | 1–2 | — | 2026-03-15 |
| **M2 — Type-safe foundation** | 3 | — | 2026-03-15 |
| **M3 — Headless engine works** | 4–5 | — | — |
| **M4 — Editor renders & types** | 6–8 | — | — |
| **M5 — All features functional** | 9–16 | — | 2026-03-15 |
| **M6 — Demo-ready** | 17–19 | — | 2026-03-15 |
| **M7 — Fully tested** | 20–21 | — | — |
| **M8 — Ship it** | 22–25 | — | — |

---

## Table of Contents

- [Progress Dashboard](#progress-dashboard)
- [Overview](#overview)
- [Key Decisions](#key-decisions)
- [Dependency Map](#dependency-map)
- [Phase 1 — Yarn 4, Package Manager & Git Hygiene](#phase-1--yarn-4-package-manager--git-hygiene)
- [Phase 2 — TypeScript, Bundler & Linting Configuration](#phase-2--typescript-bundler--linting-configuration)
- [Phase 3 — Type System Foundation](#phase-3--type-system-foundation)
- [Phase 4 — Core Engine & Zustand Store](#phase-4--core-engine--zustand-store)
- [Phase 5 — React Hooks Layer](#phase-5--react-hooks-layer)
- [Phase 6 — Core Components: Editor Shell](#phase-6--core-components-editor-shell)
- [Phase 7 — Toolbar System](#phase-7--toolbar-system)
- [Phase 8 — Styles & Theming](#phase-8--styles--theming)
- [Phase 9 — Plugins: Text Formatting & Headings](#phase-9--plugins-text-formatting--headings)
- [Phase 10 — Plugins: Lists & Blockquotes](#phase-10--plugins-lists--blockquotes)
- [Phase 11 — Plugins: Links & Link Dialog](#phase-11--plugins-links--link-dialog)
- [Phase 12 — Plugins: Images & Image Dialog](#phase-12--plugins-images--image-dialog)
- [Phase 13 — Plugins: Code Blocks & Syntax Highlighting](#phase-13--plugins-code-blocks--syntax-highlighting)
- [Phase 14 — Plugins: History (Undo / Redo)](#phase-14--plugins-history-undo--redo)
- [Phase 15 — Clipboard, Paste Handling & Utilities](#phase-15--clipboard-paste-handling--utilities)
- [Phase 16 — Accessibility & Keyboard Navigation](#phase-16--accessibility--keyboard-navigation)
- [Phase 17 — Playground App](#phase-17--playground-app)
- [Phase 18 — Storybook Setup & Stories](#phase-18--storybook-setup--stories)
- [Phase 19 — Example Apps (React Demo & Next.js Demo)](#phase-19--example-apps-react-demo--nextjs-demo)
- [Phase 20 — Unit & Integration Tests](#phase-20--unit--integration-tests)
- [Phase 21 — End-to-End Tests](#phase-21--end-to-end-tests)
- [Phase 22 — Documentation](#phase-22--documentation)
- [Phase 23 — CI / CD Pipelines](#phase-23--ci--cd-pipelines)
- [Phase 24 — Build Scripts & Release Pipeline](#phase-24--build-scripts--release-pipeline)
- [Phase 25 — Final Polish, Public API & v0.1.0 Release](#phase-25--final-polish-public-api--v010-release)
- [Appendix A — Full Dependency List](#appendix-a--full-dependency-list)
- [Appendix B — File Ownership Matrix](#appendix-b--file-ownership-matrix)
- [Appendix C — CSS Custom Property Tokens](#appendix-c--css-custom-property-tokens)
- [Appendix D — Progress Log](#appendix-d--progress-log)

---

## Overview

This document is the **single source of truth** for building `rich-text-editor-ndevu` from the current scaffolded state to a fully functional, published npm package.

The plan is structured as **25 incremental phases**. Each phase produces a verifiable checkpoint — something you can build, run, or visually inspect before moving to the next. Phases are ordered by dependency: later phases rely on earlier ones being complete.

### What we're building

A React rich text editor component that supports:

- Text formatting (bold, italic, underline, strikethrough)
- Headings (H1–H6)
- Ordered and unordered lists
- Links (insert, edit, remove)
- Images (URL and file upload)
- Blockquotes
- Code blocks with syntax highlighting
- Undo / Redo
- Clipboard paste with format preservation
- Light and dark themes
- Read-only mode
- Full accessibility (ARIA, keyboard navigation)
- TypeScript type definitions
- Customizable toolbar

### What already exists

A comprehensive directory scaffold with placeholder files. See the README for the full feature specification and props API. **No functional code exists yet.**

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Package manager | **Yarn 4 (Berry)** with `nodeLinker: node-modules` | Modern, fast, Corepack-enforced versioning. `node-modules` linker avoids PnP compatibility issues with Tiptap, Storybook, and Playwright. |
| Editing engine | **Tiptap v2** (ProseMirror-based) | Battle-tested, extensible node/mark system, cross-browser edge-case handling, commands, keyboard shortcuts, clipboard handling — all out of the box. |
| State management | **Zustand** | Minimal API, no provider nesting needed, supports selectors for render optimization, works outside React (useful in command functions). |
| Styling | **CSS Modules** | Zero consumer dependency overhead, scoped by default. Consumers don't need Tailwind, styled-components, or any CSS framework. |
| Syntax highlighting | **lowlight** (highlight.js AST) via `@tiptap/extension-code-block-lowlight` | Official Tiptap integration path. Language support is broad. Prism.js themes can be adapted. |
| Bundler | **tsup** (esbuild-based) | Fast, supports ESM + CJS dual output, TypeScript declarations, CSS handling. Rollup config kept as optional fallback. |
| Unit tests | **Vitest** + **@testing-library/react** | Fast, Vite-native, Jest-compatible API, first-class TypeScript support. |
| E2E tests | **Playwright** | Cross-browser, reliable, good DX for testing contentEditable interactions. |
| Component dev | **Storybook 8** with `@storybook/react-vite` | Industry standard for component-driven development, visual testing, documentation. |

---

## Dependency Map

```
Phase 1 ─── Yarn 4 + Git hygiene
    │
Phase 2 ─── TS + tsup + ESLint + Prettier
    │
Phase 3 ─── Type definitions (all interfaces)
    │
Phase 4 ─── Core engine + Zustand store
    │
Phase 5 ─── React hooks (useEditor, useToolbar, useHistory)
    │
Phase 6 ─── Editor shell (Provider, Wrapper, ContentEditable)
    │
Phase 7 ─── Toolbar system (Toolbar, Button, Group, Separator)
    │
Phase 8 ─── CSS Modules + light/dark themes
    │
    ├── Phase 9 ── Text formatting + headings plugin
    ├── Phase 10 ── Lists + blockquotes plugin
    ├── Phase 11 ── Link plugin + dialog
    ├── Phase 12 ── Image plugin + dialog
    ├── Phase 13 ── Code block plugin + syntax highlighting
    ├── Phase 14 ── History plugin (undo/redo)
    │
Phase 15 ── Clipboard + utilities
    │
Phase 16 ── Accessibility + keyboard navigation
    │
    ├── Phase 17 ── Playground app
    ├── Phase 18 ── Storybook
    ├── Phase 19 ── Example apps
    │
Phase 20 ── Unit + integration tests
    │
Phase 21 ── E2E tests
    │
Phase 22 ── Documentation
    │
Phase 23 ── CI/CD pipelines
    │
Phase 24 ── Build scripts + release pipeline
    │
Phase 25 ── Final polish + v0.1.0 release
```

---

## Phase 1 — Yarn 4, Package Manager & Git Hygiene

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/setup1` |
| **Blocked by** | None |
| **Deliverables** | `package.json`, `.yarnrc.yml`, `yarn.lock`, updated `.gitignore`, updated `README.md` |

**Goal:** Initialize Yarn 4 so that `yarn install` works and the project has a proper `package.json`.

### 1.1 — Enable Corepack and initialize Yarn 4

```bash
corepack enable
yarn init -2
yarn set version stable
```

This creates:
- `.yarnrc.yml`
- `.yarn/releases/yarn-<version>.cjs`
- `yarn.lock`

### 1.2 — Configure `.yarnrc.yml`

```yaml
nodeLinker: node-modules
enableGlobalCache: false
```

**Why `node-modules`:** Avoids PnP compatibility issues with Tiptap's ProseMirror dependencies, Storybook, and Playwright. We get Yarn 4's speed and features without the PnP trade-offs.

### 1.3 — Populate `package.json`

Create the full package manifest with all metadata, entry points, peer dependencies, scripts, and the `packageManager` field.

**Key fields:**
- `name`: `"rich-text-editor-ndevu"`
- `version`: `"0.1.0"`
- `description`: from README overview
- `main`: `"dist/index.cjs"`
- `module`: `"dist/index.js"`
- `types`: `"dist/index.d.ts"`
- `exports`: proper conditional exports map for ESM/CJS/types
- `files`: `["dist", "README.md", "LICENSE"]`
- `sideEffects`: `["**/*.css"]` (so bundlers don't tree-shake CSS)
- `peerDependencies`: `react >=18.0.0`, `react-dom >=18.0.0`
- `packageManager`: `"yarn@<version>"` (Corepack enforces this)
- `license`: `"BSD-3-Clause"`
- `repository`, `homepage`, `bugs`: GitHub URLs
- `keywords`: `["react", "rich-text-editor", "wysiwyg", "tiptap", "contenteditable", "typescript"]`

**Scripts (all using yarn):**

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start playground dev server (Phase 17) |
| `build` | `tsup` | Build the library |
| `build:watch` | `tsup --watch` | Build in watch mode |
| `lint` | `eslint src/ --ext .ts,.tsx` | Lint source files |
| `lint:fix` | `eslint src/ --ext .ts,.tsx --fix` | Auto-fix lint issues |
| `format` | `prettier --write \"src/**/*.{ts,tsx,css}\"` | Format source files |
| `format:check` | `prettier --check \"src/**/*.{ts,tsx,css}\"` | Check formatting |
| `test` | `vitest run` | Run unit tests once |
| `test:watch` | `vitest` | Run unit tests in watch mode |
| `test:coverage` | `vitest run --coverage` | Run tests with coverage |
| `test:e2e` | `playwright test` | Run E2E tests |
| `clean` | `tsx scripts/clean.ts` | Clean build artifacts |
| `storybook` | `storybook dev -p 6006` | Start Storybook |
| `build-storybook` | `storybook build` | Build static Storybook |
| `prepublishOnly` | `yarn clean && yarn build` | Auto-build before publish |
| `typecheck` | `tsc --noEmit` | Type-check without emitting |

### 1.4 — Install production dependencies

```bash
yarn add @tiptap/core @tiptap/pm @tiptap/react @tiptap/starter-kit zustand
```

### 1.5 — Install dev dependencies

```bash
yarn add -D typescript @types/react @types/react-dom react react-dom
yarn add -D tsup vite
yarn add -D eslint prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks
yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

> **Note:** `react` and `react-dom` are dev dependencies (for building/testing) but peer dependencies (for consumers). They are NOT bundled into the output.

### 1.6 — Update `.gitignore`

Add Yarn Berry entries and build output:

```gitignore
# Yarn Berry
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Build output
/dist

# Coverage
/coverage

# Storybook
/storybook-static
```

Keep existing entries (`node_modules`, `npm-debug.log*`, `yarn-debug.log*`, etc.).

### 1.7 — Update README.md

Change contributor-facing commands from `npm` to `yarn`:
- `npm install` → `yarn install`
- `npm run dev` → `yarn dev`
- `npm run lint` → `yarn lint`
- `npm test` → `yarn test`

Keep end-user install instructions showing all three package managers (npm, yarn, pnpm).

### 1.8 — Run `yarn install`

Verify the lock file is created and `node_modules/` is populated without errors.

### Checkpoint

- [x] `yarn --version` shows 4.x
- [x] `yarn install` completes without errors
- [x] `yarn.lock` exists and is populated
- [x] `.yarnrc.yml` has `nodeLinker: node-modules`
- [x] `package.json` has all fields, scripts, and dependency declarations

---

## Phase 2 — TypeScript, Bundler & Linting Configuration

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/setup1` |
| **Blocked by** | Phase 1 |
| **Deliverables** | `tsconfig.json`, `tsup.config.ts`, `config/vitest.config.ts`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `tests/setup.ts` |

**Goal:** Configure TypeScript strict mode, tsup for dual ESM/CJS output, and ESLint + Prettier for code quality.

### 2.1 — Populate `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests", "playground", "examples", "storybook"]
}
```

**Key choices:**
- `strict: true` — catches bugs early, no `any` leaking
- `jsx: react-jsx` — React 17+ automatic JSX transform (no `import React` needed)
- `moduleResolution: bundler` — aligns with tsup/Vite resolution
- `paths` with `@/*` alias — cleaner imports within `src/`

### 2.2 — Configure `tsup.config.ts`

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  treeshake: true,
  splitting: false,
  minify: false, // consumers can minify; we ship readable code
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
```

**Design considerations:**
- `external: ['react', 'react-dom']` — peer deps are never bundled
- `dts: true` — generates `.d.ts` type declarations alongside JS
- `splitting: false` — single entry point, no code splitting needed for a library
- CSS Module imports will be handled via tsup's built-in CSS support

### 2.3 — Configure `config/vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/index.ts', 'src/types/**'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
});
```

**Create `tests/setup.ts`:**

```ts
import '@testing-library/jest-dom/vitest';
```

### 2.4 — Configure ESLint

Create `.eslintrc.cjs`:

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off', // TypeScript handles this
  },
  ignorePatterns: ['dist', 'node_modules', 'coverage', 'storybook-static'],
};
```

### 2.5 — Configure Prettier

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:

```
dist
node_modules
coverage
yarn.lock
storybook-static
.yarn
```

### 2.6 — Optional: Configure `config/rollup.config.ts` (fallback)

Populate with a working Rollup config that mirrors the tsup behavior. This is a backup option if tsup ever has issues with CSS Modules or edge cases. Mark it clearly as optional in comments.

### 2.7 — Verify toolchain

```bash
yarn typecheck     # should pass (empty src/index.ts)
yarn lint          # should pass
yarn format:check  # should pass
yarn build         # should produce dist/ with empty exports
```

### Checkpoint

- [x] `yarn typecheck` passes
- [x] `yarn lint` runs without errors
- [x] `yarn build` produces `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`
- [x] ESLint + Prettier configs exist and are functional

---

## Phase 3 — Type System Foundation

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/phase-3-type-system` |
| **Blocked by** | Phase 2 |
| **Deliverables** | `src/types/editor.types.ts`, `src/types/toolbar.types.ts`, `src/types/plugin.types.ts`, `src/types/index.ts` |

**Goal:** Define every TypeScript interface and type that the rest of the codebase depends on. This is the **contract** for all subsequent phases.

### 3.1 — `src/types/editor.types.ts`

Define the following types:

```ts
// --- Theme ---
export type Theme = 'light' | 'dark';

// --- Editor Props (public API, matches README spec) ---
export interface RichTextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  toolbar?: ToolbarItem[];
  theme?: Theme;
  minHeight?: string | number;
  maxHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
}

// --- Editor State (internal, for Zustand store) ---
export interface EditorState {
  content: string;
  theme: Theme;
  readOnly: boolean;
  isFocused: boolean;
  activeMarks: Set<string>;    // e.g. 'bold', 'italic', 'underline', ...
  activeNodes: Set<string>;    // e.g. 'heading', 'bulletList', ...
  headingLevel: number | null; // currently active heading level (1-6) or null
  openDialog: DialogType | null;
}

// --- Editor Actions (Zustand store actions) ---
export interface EditorActions {
  setContent: (content: string) => void;
  setTheme: (theme: Theme) => void;
  setReadOnly: (readOnly: boolean) => void;
  setFocused: (focused: boolean) => void;
  updateActiveState: (marks: Set<string>, nodes: Set<string>, headingLevel: number | null) => void;
  setOpenDialog: (dialog: DialogType | null) => void;
}

// --- Dialog Types ---
export type DialogType = 'link' | 'image';

// --- Editor Config ---
export interface EditorConfig {
  placeholder: string;
  readOnly: boolean;
  theme: Theme;
  toolbar: ToolbarItem[];
  minHeight: string | number;
  maxHeight?: string | number;
}
```

### 3.2 — `src/types/toolbar.types.ts`

```ts
// --- Toolbar Item Identifiers ---
export type ToolbarItemType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'code'
  | 'codeBlock'
  | 'link'
  | 'image'
  | 'undo'
  | 'redo';

export type ToolbarSeparator = '|';

export type ToolbarItem = ToolbarItemType | ToolbarSeparator;

// --- Toolbar Button Configuration ---
export interface ToolbarButtonConfig {
  id: ToolbarItemType;
  label: string;          // Human-readable label (for tooltip / aria-label)
  icon: React.ReactNode;  // Icon element (SVG component or Unicode)
  action: () => void;     // Command to execute when clicked
  isActive: boolean;      // Whether this formatting is currently active at cursor
  isDisabled: boolean;    // Whether the button should be disabled
  shortcut?: string;      // Keyboard shortcut hint (e.g. "Ctrl+B")
}

// --- Toolbar Group Configuration ---
export interface ToolbarGroupConfig {
  id: string;
  label: string;       // Group label for accessibility
  items: (ToolbarButtonConfig | ToolbarSeparator)[];
}

// --- Default toolbar item order ---
export const DEFAULT_TOOLBAR: ToolbarItem[] = [
  'bold', 'italic', 'underline', 'strike',
  '|',
  'heading1', 'heading2', 'heading3',
  '|',
  'bulletList', 'orderedList', 'blockquote',
  '|',
  'code', 'codeBlock',
  '|',
  'link', 'image',
  '|',
  'undo', 'redo',
];
```

### 3.3 — `src/types/plugin.types.ts`

```ts
import type { Extension, Mark, Node } from '@tiptap/core';

// --- Plugin Definition ---
export interface PluginConfig {
  name: string;
  extensions: (Extension | Mark | Node)[];
  toolbarItems?: ToolbarItemType[];    // toolbar items this plugin contributes
  keyboardShortcuts?: Record<string, () => boolean>; // additional keyboard shortcuts
}

// --- Plugin Registry ---
export interface PluginRegistry {
  plugins: Map<string, PluginConfig>;
  register: (plugin: PluginConfig) => void;
  unregister: (name: string) => void;
  getExtensions: () => (Extension | Mark | Node)[];
}
```

### 3.4 — `src/types/index.ts`

```ts
export * from './editor.types';
export * from './toolbar.types';
export * from './plugin.types';
```

### Checkpoint

- [x] `yarn typecheck` passes
- [x] All types are importable from `@/types`
- [x] No circular dependencies

---

## Phase 4 — Core Engine & Zustand Store

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/phase-4-core-engine` |
| **Blocked by** | Phase 3 |
| **Deliverables** | `src/core/schema.ts`, `src/core/engine.ts`, `src/core/commands.ts`, `src/core/store.ts`, `src/core/model.ts`, `src/core/index.ts` |

**Goal:** Build the headless editing engine and centralized state management. After this phase, you can programmatically create an editor, execute commands, and observe state changes — all without any React UI.

### 4.1 — `src/core/schema.ts`

Assemble the Tiptap extension stack:

```ts
import StarterKit from '@tiptap/starter-kit';
// Additional extensions will be imported as plugins are built (Phases 9–14)

export function createExtensions(): Extension[] {
  return [
    StarterKit.configure({
      // We'll override specific extensions in later phases:
      // history: false,      // Phase 14 — custom history config
      // codeBlock: false,    // Phase 13 — replaced by code-block-lowlight
    }),
    // Phase 9:  Underline extension
    // Phase 11: Link extension
    // Phase 12: Image extension
    // Phase 13: CodeBlockLowlight extension
  ];
}
```

**Strategy:** Start with `StarterKit` which gives us bold, italic, strike, headings, lists, blockquote, code, history, and hard break out of the box. Each plugin phase adds targeted extensions.

### 4.2 — `src/core/engine.ts`

The editor factory function:

```ts
import { Editor } from '@tiptap/react';
import { createExtensions } from './schema';
import type { EditorConfig } from '@/types';

export interface CreateEditorOptions {
  content?: string;
  editable?: boolean;
  placeholder?: string;
  onUpdate?: (html: string) => void;
  onSelectionUpdate?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function createEditor(options: CreateEditorOptions): Editor {
  return new Editor({
    extensions: createExtensions(),
    content: options.content || '',
    editable: options.editable ?? true,
    onUpdate: ({ editor }) => {
      options.onUpdate?.(editor.getHTML());
    },
    onSelectionUpdate: () => {
      options.onSelectionUpdate?.();
    },
    onFocus: () => {
      options.onFocus?.();
    },
    onBlur: () => {
      options.onBlur?.();
    },
  });
}
```

### 4.3 — `src/core/commands.ts`

Thin wrappers around Tiptap's chain commands. Each function takes an `Editor` instance and executes a command:

```ts
import type { Editor } from '@tiptap/core';

// --- Text Formatting ---
export const toggleBold = (editor: Editor) =>
  editor.chain().focus().toggleBold().run();

export const toggleItalic = (editor: Editor) =>
  editor.chain().focus().toggleItalic().run();

export const toggleUnderline = (editor: Editor) =>
  editor.chain().focus().toggleUnderline().run();

export const toggleStrike = (editor: Editor) =>
  editor.chain().focus().toggleStrike().run();

// --- Headings ---
export const setHeading = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6) =>
  editor.chain().focus().toggleHeading({ level }).run();

// --- Lists ---
export const toggleBulletList = (editor: Editor) =>
  editor.chain().focus().toggleBulletList().run();

export const toggleOrderedList = (editor: Editor) =>
  editor.chain().focus().toggleOrderedList().run();

// --- Block Formatting ---
export const toggleBlockquote = (editor: Editor) =>
  editor.chain().focus().toggleBlockquote().run();

export const toggleCode = (editor: Editor) =>
  editor.chain().focus().toggleCode().run();

export const toggleCodeBlock = (editor: Editor) =>
  editor.chain().focus().toggleCodeBlock().run();

// --- Links ---
export const insertLink = (editor: Editor, href: string, text?: string) => {
  if (text) {
    editor.chain().focus().insertContent(`<a href="${href}">${text}</a>`).run();
  } else {
    editor.chain().focus().setLink({ href }).run();
  }
};

export const removeLink = (editor: Editor) =>
  editor.chain().focus().unsetLink().run();

// --- Images ---
export const insertImage = (editor: Editor, src: string, alt?: string) =>
  editor.chain().focus().setImage({ src, alt: alt || '' }).run();

// --- History ---
export const undo = (editor: Editor) =>
  editor.chain().focus().undo().run();

export const redo = (editor: Editor) =>
  editor.chain().focus().redo().run();
```

### 4.4 — `src/core/store.ts` (NEW FILE)

The Zustand store — the single source of truth for editor state:

```ts
import { create } from 'zustand';
import type { Editor } from '@tiptap/core';
import type { EditorState, EditorActions, Theme, DialogType } from '@/types';

interface EditorStore extends EditorState, EditorActions {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  // --- State ---
  editor: null,
  content: '',
  theme: 'light',
  readOnly: false,
  isFocused: false,
  activeMarks: new Set<string>(),
  activeNodes: new Set<string>(),
  headingLevel: null,
  openDialog: null,

  // --- Actions ---
  setEditor: (editor) => set({ editor }),
  setContent: (content) => set({ content }),
  setTheme: (theme) => set({ theme }),
  setReadOnly: (readOnly) => set({ readOnly }),
  setFocused: (focused) => set({ isFocused: focused }),
  updateActiveState: (marks, nodes, headingLevel) =>
    set({ activeMarks: marks, activeNodes: nodes, headingLevel }),
  setOpenDialog: (dialog) => set({ openDialog: dialog }),
}));
```

**Design notes:**
- The store holds a reference to the Tiptap `Editor` instance so commands can access it from anywhere
- `activeMarks` and `activeNodes` are `Set<string>` for O(1) lookup when rendering toolbar button states
- `openDialog` tracks which dialog (link/image) is currently open — `null` means none
- Zustand selectors will prevent unnecessary re-renders (e.g., toolbar only re-renders when `activeMarks` changes)

### 4.5 — `src/core/model.ts`

Document model utilities for converting between formats:

```ts
import { generateHTML, generateJSON } from '@tiptap/html';
import { createExtensions } from './schema';

// Convert Tiptap JSON document to HTML string
export function toHTML(doc: Record<string, unknown>): string {
  return generateHTML(doc, createExtensions());
}

// Convert HTML string to Tiptap JSON document
export function fromHTML(html: string): Record<string, unknown> {
  return generateJSON(html, createExtensions());
}

// Create an empty document
export function createEmptyDoc(): string {
  return '<p></p>';
}

// Check if content is effectively empty
export function isContentEmpty(html: string): boolean {
  const stripped = html.replace(/<[^>]*>/g, '').trim();
  return stripped.length === 0;
}
```

### 4.6 — `src/core/index.ts`

```ts
export { createEditor } from './engine';
export type { CreateEditorOptions } from './engine';
export { createExtensions } from './schema';
export { useEditorStore } from './store';
export * from './commands';
export * from './model';
```

### Checkpoint

- [x] `yarn typecheck` passes
- [x] `yarn build` succeeds (store, engine, commands compile)
- [x] Can write a simple script that creates an editor instance and executes `toggleBold()`

---

## Phase 5 — React Hooks Layer

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/phase-5-react-hooks` |
| **Blocked by** | Phase 4 |
| **Deliverables** | `src/hooks/useEditor.ts`, `src/hooks/useToolbar.ts`, `src/hooks/useHistory.ts`, `src/hooks/index.ts` |

**Goal:** Build the three custom hooks that bridge the Zustand store and Tiptap editor with React components.

### 5.1 — `src/hooks/useEditor.ts`

The primary hook — manages the Tiptap editor lifecycle:

**Responsibilities:**
- Create the Tiptap `Editor` instance on mount using `createEditor()`
- Store the instance in Zustand (`setEditor`)
- Sync the `value` prop → Tiptap content (controlled component pattern)
- Listen to Tiptap `onUpdate` → call `onChange` prop and `setContent` in store
- Listen to Tiptap `onSelectionUpdate` → refresh `activeMarks` and `activeNodes` in store
- Listen to Tiptap `onFocus` / `onBlur` → update `isFocused` and call prop callbacks
- Destroy the editor on unmount (`editor.destroy()`)
- Handle `readOnly` changes → `editor.setEditable(!readOnly)`

**Implementation details:**
- Use `useEffect` for editor creation/destruction
- Use `useRef` for the editor instance to avoid re-creation on every render
- Debounce `updateActiveState` to avoid excessive store updates during rapid typing
- Compare incoming `value` with current editor HTML to prevent infinite loops

### 5.2 — `src/hooks/useToolbar.ts`

Maps the `toolbar` prop (array of `ToolbarItem` strings) to an array of `ToolbarButtonConfig` objects:

**Responsibilities:**
- Read `activeMarks`, `activeNodes`, `headingLevel` from Zustand store (via selectors)
- Read the `editor` instance from Zustand store
- For each toolbar item, produce: `{ id, label, icon, action, isActive, isDisabled, shortcut }`
- `isActive` is derived from store state (e.g., `activeMarks.has('bold')`)
- `action` delegates to the appropriate command from `src/core/commands.ts`
- `isDisabled` is `true` when `readOnly` is true, or when the editor is not initialized
- `shortcut` is the platform-appropriate hint (e.g., `⌘B` on Mac, `Ctrl+B` on Windows)

**Icon strategy:**
- Use simple inline SVG components for toolbar icons
- Create an `src/assets/icons/` directory (or inline them in a `toolbarIconMap`)
- Each icon is a small functional component accepting `size` and `className` props

### 5.3 — `src/hooks/useHistory.ts`

Lightweight hook for undo/redo state:

```ts
export function useHistory() {
  const editor = useEditorStore((s) => s.editor);

  return {
    undo: () => editor && undoCommand(editor),
    redo: () => editor && redoCommand(editor),
    canUndo: editor?.can().undo() ?? false,
    canRedo: editor?.can().redo() ?? false,
  };
}
```

**Note:** `canUndo` / `canRedo` need to re-evaluate on every transaction. Either subscribe to Tiptap's `onTransaction` event or derive from the store's `activeMarks` update cycle.

### 5.4 — `src/hooks/index.ts`

```ts
export { useEditor } from './useEditor';
export { useToolbar } from './useToolbar';
export { useHistory } from './useHistory';
```

### Checkpoint

- [x] `yarn typecheck` passes
- [x] Hooks are syntactically correct and import correctly
- [x] No circular dependencies between hooks → store → engine

---

## Phase 6 — Core Components: Editor Shell

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/phase-6-editor-shell` |
| **Blocked by** | Phase 5 |
| **Deliverables** | `ContentEditable.tsx`, `Parser.ts`, `Serializer.ts`, `EditorProvider.tsx`, `EditorWrapper.tsx`, `RichTextEditor.tsx`, index files |

**Goal:** Build the main React components that compose the editor UI. After this phase, `<RichTextEditor />` renders a functional (unstyled) editor with a content area.

### 6.1 — `src/components/Content/ContentEditable.tsx`

**Responsibilities:**
- Render Tiptap's `<EditorContent editor={editor} />` component
- Apply CSS Module classes for the editable area
- Apply `minHeight` / `maxHeight` as inline styles
- Render a placeholder overlay when content is empty (CSS-based via `:empty::before` pseudo-element, or Tiptap's placeholder extension)
- Forward `ref` if needed

**Props:**
```ts
interface ContentEditableProps {
  editor: Editor | null;
  minHeight?: string | number;
  maxHeight?: string | number;
  placeholder?: string;
  className?: string;
}
```

### 6.2 — `src/components/Content/Parser.ts`

```ts
import { generateJSON } from '@tiptap/html';
import { createExtensions } from '@/core/schema';

export function parseHTML(html: string): Record<string, unknown> {
  return generateJSON(html, createExtensions());
}
```

### 6.3 — `src/components/Content/Serializer.ts`

```ts
import { generateHTML } from '@tiptap/html';
import { createExtensions } from '@/core/schema';

export function serializeHTML(doc: Record<string, unknown>): string {
  return generateHTML(doc, createExtensions());
}
```

### 6.4 — `src/components/Content/index.ts` — Re-exports

### 6.5 — `src/components/Editor/EditorProvider.tsx`

**Responsibilities:**
- Accept all `RichTextEditorProps` as props
- Call `useEditor` hook to initialize and manage the editor lifecycle
- Initialize Zustand store with `theme`, `readOnly`, etc. from props
- Sync prop changes to store (e.g., if `theme` prop changes, update store)
- Render children

**Design note:** We do NOT use React Context alongside Zustand. The Zustand store IS the context. `EditorProvider` is purely a lifecycle component that bridges props to the store.

### 6.6 — `src/components/Editor/EditorWrapper.tsx`

**Responsibilities:**
- Compose `<Toolbar />` + `<ContentEditable />` vertically
- Apply the outer wrapper CSS Module class
- Apply `data-theme="light|dark"` attribute for CSS theming
- Apply `className` and `style` from props
- Conditionally hide toolbar when `readOnly` is true

```tsx
<div
  className={clsx(styles.editorWrapper, className)}
  style={style}
  data-theme={theme}
>
  {!readOnly && <Toolbar items={toolbarItems} />}
  <ContentEditable
    editor={editor}
    minHeight={minHeight}
    maxHeight={maxHeight}
    placeholder={placeholder}
  />
  {/* Dialogs rendered here via portal or conditional rendering */}
</div>
```

### 6.7 — `src/components/Editor/RichTextEditor.tsx`

The **public API component** — the one consumers import:

```tsx
import type { RichTextEditorProps } from '@/types';

export function RichTextEditor(props: RichTextEditorProps) {
  const {
    value = '',
    onChange,
    placeholder = 'Write something...',
    readOnly = false,
    toolbar = DEFAULT_TOOLBAR,
    theme = 'light',
    minHeight = '200px',
    maxHeight,
    className,
    style,
    onFocus,
    onBlur,
  } = props;

  return (
    <EditorProvider
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      theme={theme}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <EditorWrapper
        toolbar={toolbar}
        placeholder={placeholder}
        minHeight={minHeight}
        maxHeight={maxHeight}
        className={className}
        style={style}
      />
    </EditorProvider>
  );
}
```

### 6.8 — `src/components/Editor/index.ts` — Re-exports

### Checkpoint

- [x] `<RichTextEditor value="" onChange={console.log} />` renders without errors
- [x] Typing in the content area triggers `onChange` with HTML
- [x] `yarn build` succeeds

---

## Phase 7 — Toolbar System

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/phase-7-toolbar-system` |
| **Blocked by** | Phase 6 |
| **Deliverables** | `ToolbarButton.tsx`, `ToolbarSeparator.tsx`, `ToolbarGroup.tsx`, `Toolbar.tsx`, index file |

**Goal:** Build the toolbar components. After this phase, toolbar buttons render and clicking them executes formatting commands.

### 7.1 — `src/components/Toolbar/ToolbarButton.tsx`

**Props:** `ToolbarButtonConfig`

**Renders:**
- `<button>` with the icon
- `aria-label` set to the label
- `aria-pressed` set to `isActive`
- `disabled` when `isDisabled`
- `title` showing the shortcut hint (e.g., "Bold (⌘B)")
- CSS Module classes for default, hover, active, pressed states
- `onClick` executes the `action`

**Accessibility requirements:**
- Focusable via Tab
- Operable via Enter and Space
- Screen reader announces the label and pressed state

### 7.2 — `src/components/Toolbar/ToolbarSeparator.tsx`

```tsx
export function ToolbarSeparator() {
  return <div className={styles.separator} role="separator" aria-orientation="vertical" />;
}
```

Renders as a thin vertical line.

### 7.3 — `src/components/Toolbar/ToolbarGroup.tsx`

Groups related buttons:

```tsx
interface ToolbarGroupProps {
  label: string;
  children: React.ReactNode;
}

export function ToolbarGroup({ label, children }: ToolbarGroupProps) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {children}
    </div>
  );
}
```

### 7.4 — `src/components/Toolbar/Toolbar.tsx`

Main toolbar component:

**Responsibilities:**
- Accept `toolbar` items array (from `useToolbar` hook output)
- Group items by separators into `ToolbarGroup` components
- Render each item as `ToolbarButton` or `ToolbarSeparator`
- Wrap everything in `<div role="toolbar" aria-label="Text formatting" aria-orientation="horizontal">`
- Implement roving tabindex for keyboard navigation within the toolbar (arrow left/right)

### 7.5 — `src/components/Toolbar/index.ts` — Re-exports

### Checkpoint

- [x] Toolbar renders with all default buttons
- [x] Custom `toolbar` prop renders only specified items
- [x] Clicking "Bold" toggles bold on selected text
- [x] Active button shows visually pressed state
- [x] Keyboard: Tab into toolbar, arrow keys between buttons

---

## Phase 8 — Styles & Theming

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `chore/phase-8-styles-theming` |
| **Blocked by** | Phase 7 |
| **Deliverables** | `theme-light.css`, `theme-dark.css`, `editor.css`, `toolbar.css`, `index.css` |

**Goal:** Implement CSS Modules for all components and the light/dark theme system.

### 8.1 — Design Token Architecture

All theming is based on CSS custom properties (variables) scoped to `[data-theme]` attributes:

```css
/* Theme tokens follow the pattern: --rte-{category}-{property} */
[data-theme='light'] {
  --rte-bg: #ffffff;
  --rte-text: #1a1a2e;
  --rte-border: #e0e0e0;
  --rte-toolbar-bg: #f8f9fa;
  --rte-toolbar-border: #e0e0e0;
  --rte-button-hover: #e9ecef;
  --rte-button-active: #dee2e6;
  --rte-button-pressed: #d0d7de;
  --rte-accent: #0969da;
  --rte-placeholder: #9ca3af;
  --rte-focus-ring: rgba(9, 105, 218, 0.3);
  --rte-code-bg: #f6f8fa;
  --rte-blockquote-border: #d0d7de;
  --rte-dialog-overlay: rgba(0, 0, 0, 0.4);
  --rte-dialog-bg: #ffffff;
  --rte-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
```

### 8.2 — `src/styles/theme-light.css`

Full light theme token definitions (see Appendix C for complete list).

### 8.3 — `src/styles/theme-dark.css`

Dark theme tokens — carefully chosen for readability and contrast:

```css
[data-theme='dark'] {
  --rte-bg: #1e1e2e;
  --rte-text: #cdd6f4;
  --rte-border: #45475a;
  /* ... full token list ... */
}
```

### 8.4 — `src/styles/editor.css` (CSS Module: `editor.module.css`)

- `.editorWrapper` — outer container: border, border-radius, overflow hidden, font family
- `.contentArea` — the editable div: padding, min-height, max-height, overflow-y, line-height
- `.contentArea:focus` — focus ring using `--rte-focus-ring`
- `.readOnly` — cursor: default, no focus ring
- `.placeholder` — absolute positioned, color: `--rte-placeholder`
- Prose typography inside `.contentArea`:
  - `p` — margin-bottom
  - `h1`–`h6` — font sizes, weights, margins
  - `ul`, `ol` — padding-left, list-style
  - `blockquote` — left border, padding, italic, color
  - `code` (inline) — background, padding, border-radius, font-family
  - `pre > code` — block display, padding, overflow-x
  - `a` — color: accent, underline
  - `img` — max-width: 100%, border-radius
  - `hr` — border color

### 8.5 — `src/styles/toolbar.css` (CSS Module: `toolbar.module.css`)

- `.toolbar` — flexbox, flex-wrap, padding, background, border-bottom
- `.group` — flexbox, gap
- `.button` — size (32×32), border: none, background: transparent, cursor: pointer, border-radius, transition
- `.button:hover` — background: `--rte-button-hover`
- `.button[aria-pressed='true']` — background: `--rte-button-pressed`, color: `--rte-accent`
- `.button:disabled` — opacity: 0.4, cursor: not-allowed
- `.button:focus-visible` — focus ring
- `.separator` — width: 1px, height: 24px, background: `--rte-border`, margin: 0 4px

### 8.6 — `src/styles/index.css`

Master stylesheet that imports all modules:

```css
@import './theme-light.css';
@import './theme-dark.css';
```

This file is the one included in the built package so consumers get themes automatically.

### Checkpoint

- [x] Editor renders with polished light theme
- [x] `theme="dark"` switches all colors correctly
- [x] Toolbar buttons have hover, active, pressed, disabled states
- [x] Content typography (headings, lists, quotes, code) looks professional
- [x] No style leakage outside the editor wrapper

---

## Phase 9 — Plugins: Text Formatting & Headings

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-9-text-formatting` |
| **Blocked by** | Phase 8 |
| **Deliverables** | Underline extension installed, `schema.ts` updated, all text formatting toolbar items functional |

**Goal:** Ensure bold, italic, underline, strikethrough, and H1–H6 are fully functional.

### 9.1 — Install Underline extension

```bash
yarn add @tiptap/extension-underline
```

StarterKit includes Bold, Italic, Strike, and Heading out of the box. **Underline** is not included — we add it separately.

### 9.2 — Update `src/core/schema.ts`

Add `Underline` to the extension array.

### 9.3 — `src/components/Plugins/CodeBlockPlugin.tsx` (placeholder for now)

In this phase, we only wire up the text formatting plugins. CodeBlock has its own phase.

### 9.4 — Verify all toolbar items work

- [x] Bold: toggles `<strong>` on selection
- [x] Italic: toggles `<em>` on selection
- [x] Underline: toggles `<u>` on selection
- [x] Strike: toggles `<s>` on selection
- [x] Heading 1–6: toggles `<h1>`–`<h6>` on current block
- [x] Keyboard shortcuts: Ctrl/⌘+B, Ctrl/⌘+I, Ctrl/⌘+U

### Checkpoint

- [x] All text formatting commands work
- [x] Toolbar buttons reflect active state correctly
- [x] Keyboard shortcuts work
- [x] Output HTML is semantically correct

---

## Phase 10 — Plugins: Lists & Blockquotes

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-10-lists-blockquotes` |
| **Blocked by** | Phase 8 (parallelizable with 9) |
| **Deliverables** | `ListsPlugin.tsx`, list/blockquote CSS, Tab/Shift+Tab nesting |

**Goal:** Implement ordered lists, unordered lists, and blockquotes with proper nesting.

### 10.1 — `src/components/Plugins/ListsPlugin.tsx`

StarterKit includes `BulletList`, `OrderedList`, and `ListItem`. This plugin component:

- Ensures list extensions are properly configured
- Adds custom keyboard shortcuts if needed:
  - `Tab` → increase list indent (sink list item)
  - `Shift+Tab` → decrease list indent (lift list item)
- Handles edge case: toggling a list off returns to paragraph

### 10.2 — Blockquote handling

StarterKit includes `Blockquote`. Verify:

- Toggle blockquote wraps/unwraps the current block
- Nested blockquotes work correctly
- Pressing Enter at the end of a blockquote exits it
- Pressing Backspace at the start of a blockquote unwraps it

### 10.3 — CSS for lists and blockquotes

Ensure the styles from Phase 8 render correctly:
- Bullet lists: disc markers, proper indentation
- Ordered lists: decimal numbers, proper indentation
- Nested lists: different marker styles at each level
- Blockquotes: left border, padding, slightly muted text

### Checkpoint

- [x] Bullet list toggle works
- [x] Ordered list toggle works
- [x] Tab/Shift+Tab nests/unnests list items
- [x] Blockquote toggle works
- [x] Nested structures render correctly

---

## Phase 11 — Plugins: Links & Link Dialog

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-11-links-dialog` |
| **Blocked by** | Phase 8 (parallelizable with 9, 10) |
| **Deliverables** | `LinkPlugin.tsx`, `LinkDialog.tsx`, `@tiptap/extension-link` installed, dialog CSS |

**Goal:** Implement link insertion, editing, and removal with an accessible dialog.

### 11.1 — Install Link extension

```bash
yarn add @tiptap/extension-link
```

### 11.2 — Update `src/core/schema.ts`

Add `Link` extension with configuration:

```ts
Link.configure({
  openOnClick: false,      // Don't navigate on click in editor
  autolink: true,          // Auto-detect URLs while typing
  linkOnPaste: true,       // Auto-link pasted URLs
  HTMLAttributes: {
    rel: 'noopener noreferrer nofollow',
    target: '_blank',
  },
})
```

### 11.3 — `src/components/Plugins/LinkPlugin.tsx`

**Responsibilities:**
- Register the Link extension
- Provide `insertLink`, `editLink`, `removeLink` command helpers
- When "link" toolbar button is clicked:
  - If text is selected and already a link → open dialog pre-filled with current URL
  - If text is selected but not a link → open dialog with selected text as display text
  - If no text selected → open dialog with empty fields
- Set `openDialog: 'link'` in Zustand store to trigger dialog rendering

### 11.4 — `src/components/Dialogs/LinkDialog.tsx`

**UI:**
```
┌──────────────────────────────────┐
│        Insert Link               │
│                                  │
│  URL:  [https://example.com   ]  │
│  Text: [Example Site          ]  │
│                                  │
│        [Cancel]  [Insert Link]   │
└──────────────────────────────────┘
```

**Responsibilities:**
- Modal overlay with `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Two input fields: URL (required, validated) and display text (optional)
- "Insert Link" button: calls `insertLink` command, closes dialog
- "Cancel" button: closes dialog without action
- Press Escape to close
- Focus trap: Tab cycles through URL → Text → Cancel → Insert → URL
- Auto-focus URL field on open
- If editing existing link: pre-fill fields, show "Update Link" + "Remove Link" buttons
- URL validation: basic check for protocol prefix, show inline error

**CSS Module:** `dialog.module.css` — overlay backdrop, centered card, input styles, button styles, error message styles.

### 11.5 — `src/components/Dialogs/index.ts` — Re-exports

### Checkpoint

- [x] Clicking "link" button opens the dialog
- [x] Inserting a link wraps selected text in `<a href="...">...</a>`
- [x] Clicking an existing link and pressing "link" button shows edit mode
- [x] Remove link strips the `<a>` tag
- [x] Auto-linking: typing `https://example.com` auto-creates a link
- [x] Dialog is keyboard-navigable and screen-reader accessible

---

## Phase 12 — Plugins: Images & Image Dialog

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-12-images-dialog` |
| **Blocked by** | Phase 8 (parallelizable with 9–11) |
| **Deliverables** | `ImagePlugin.tsx`, `ImageDialog.tsx`, `@tiptap/extension-image` installed |

**Goal:** Implement image insertion via URL and file upload.

### 12.1 — Install Image extension

```bash
yarn add @tiptap/extension-image
```

### 12.2 — Update `src/core/schema.ts`

Add `Image` extension:

```ts
Image.configure({
  inline: false,     // Block-level images
  allowBase64: true, // Allow base64 data URIs for file uploads
  HTMLAttributes: {
    loading: 'lazy',
  },
})
```

### 12.3 — `src/components/Plugins/ImagePlugin.tsx`

**Responsibilities:**
- Register the Image extension
- Provide `insertImage` command helper
- Custom node view (optional, for future resize handles)
- When "image" toolbar button is clicked → set `openDialog: 'image'`

### 12.4 — `src/components/Dialogs/ImageDialog.tsx`

**UI:**
```
┌──────────────────────────────────┐
│        Insert Image              │
│                                  │
│  ┌──────────────────────────┐    │
│  │   [Browse...] or         │    │
│  │   drag & drop an image   │    │
│  └──────────────────────────┘    │
│                                  │
│  — or enter URL —                │
│                                  │
│  URL: [https://example.com/i.jpg]│
│  Alt: [Description of image   ]  │
│                                  │
│  Preview: [thumbnail if valid]   │
│                                  │
│        [Cancel]  [Insert Image]  │
└──────────────────────────────────┘
```

**Responsibilities:**
- Modal with same a11y patterns as LinkDialog
- **Tab: URL input** — enter an image URL; show preview thumbnail on valid URL
- **Tab: File upload** — file input (`accept="image/*"`) + drag-and-drop zone
  - Convert uploaded file to base64 data URI using `FileReader`
  - Show preview after upload
- Alt text input (recommended, not required)
- "Insert Image" button: calls `insertImage` command, closes dialog
- Image size validation (optional: warn if > 5MB)

### Checkpoint

- [x] Inserting an image via URL renders `<img src="..." alt="..." />`
- [x] Uploading a file converts to base64 and inserts correctly
- [x] Image is block-level, centered, max-width 100%
- [x] Alt text is included in the output HTML
- [x] Dialog fully accessible

---

## Phase 13 — Plugins: Code Blocks & Syntax Highlighting

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-13-codeblock-lowlight` |
| **Blocked by** | Phase 8 (parallelizable with 9–12) |
| **Deliverables** | `CodeBlockPlugin.tsx`, `@tiptap/extension-code-block-lowlight` + `lowlight` installed, code theme CSS |

**Goal:** Implement code blocks with syntax highlighting using lowlight (highlight.js-based).

### 13.1 — Install dependencies

```bash
yarn add @tiptap/extension-code-block-lowlight lowlight
```

### 13.2 — Update `src/core/schema.ts`

Disable the default `codeBlock` from StarterKit and add `CodeBlockLowlight`:

```ts
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

StarterKit.configure({ codeBlock: false })

CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: 'plaintext',
})
```

**Included languages (via `common`):** JavaScript, TypeScript, Python, HTML, CSS, JSON, Bash, XML, Markdown, SQL, YAML, and more.

### 13.3 — `src/components/Plugins/CodeBlockPlugin.tsx`

**Responsibilities:**
- Register `CodeBlockLowlight` extension
- Optional: custom node view with a language selector dropdown
  - Dropdown at top-right corner of the code block
  - Lists available languages
  - Changes the `language` attribute on the node
- Keyboard shortcut: `` ``` `` (triple backtick) at the start of a line creates a code block (Tiptap input rule)

### 13.4 — Code block CSS

Add styles for `.hljs` (highlight.js) theme classes inside code blocks:
- Light theme: GitHub-like code highlighting
- Dark theme: One Dark-like code highlighting
- Code font: `'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace`
- Line padding, border-radius, overflow-x scroll for long lines

### Checkpoint

- [x] Typing `` ``` `` creates a code block
- [x] Code is syntax-highlighted based on detected language
- [x] Language selector dropdown works (if implemented)
- [x] Inline `code` and block `codeBlock` are visually distinct
- [x] Theme switch updates code block colors

---

## Phase 14 — Plugins: History (Undo / Redo)

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-14-history` |
| **Blocked by** | Phase 8 (parallelizable with 9–13) |
| **Deliverables** | `HistoryPlugin.tsx`, `src/components/Plugins/index.ts` |

**Goal:** Ensure undo/redo works correctly with keyboard shortcuts and toolbar buttons.

### 14.1 — `src/components/Plugins/HistoryPlugin.tsx`

StarterKit includes `History` by default. This plugin:

- Configures history depth (default: 100 steps)
- Ensures `Ctrl/⌘+Z` (undo) and `Ctrl/⌘+Shift+Z` / `Ctrl/⌘+Y` (redo) work
- Syncs `canUndo` / `canRedo` state to the toolbar buttons' `isDisabled` property
- The `useHistory` hook from Phase 5 reads this state

### 14.2 — `src/components/Plugins/index.ts`

Re-export all plugins:

```ts
export { LinkPlugin } from './LinkPlugin';
export { ImagePlugin } from './ImagePlugin';
export { ListsPlugin } from './ListsPlugin';
export { CodeBlockPlugin } from './CodeBlockPlugin';
export { HistoryPlugin } from './HistoryPlugin';
```

### Checkpoint

- [x] Undo button reverses last action
- [x] Redo button re-applies undone action
- [x] Undo button disabled when history is empty
- [x] Redo button disabled when nothing to redo
- [x] Keyboard shortcuts work
- [x] History survives plugin operations (e.g., inserting a link is undoable)

---

## Phase 15 — Clipboard, Paste Handling & Utilities

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-15-clipboard-utils` |
| **Blocked by** | Phases 9–14 |
| **Deliverables** | `src/utils/dom.ts`, `src/utils/string.ts`, `src/utils/index.ts`, paste sanitization in engine |

**Goal:** Implement paste format preservation and build utility helpers.

### 15.1 — `src/utils/dom.ts`

```ts
// --- HTML Sanitization ---
export function sanitizeHTML(html: string): string { ... }
// Strips: <script>, <style>, <iframe>, event handlers (onclick, onerror, etc.)
// Allows: all formatting tags, links, images, lists, headings, code
// Uses DOMParser + TreeWalker for robust sanitization

// --- Selection helpers ---
export function getSelectionRect(): DOMRect | null { ... }
// Returns the bounding rect of the current selection (for positioning dialogs)

// --- Focus management ---
export function focusFirstFocusable(container: HTMLElement): void { ... }
// Focuses the first focusable element inside a container (for dialog focus traps)

export function trapFocus(container: HTMLElement): () => void { ... }
// Sets up focus trapping within a container, returns cleanup function

// --- Visibility ---
export function isElementVisible(el: HTMLElement): boolean { ... }
```

### 15.2 — `src/utils/string.ts`

```ts
// --- URL Validation ---
export function isValidURL(str: string): boolean { ... }
// Validates URL format (http, https, mailto, tel)

// --- HTML Escaping ---
export function escapeHTML(str: string): string { ... }
// Escapes &, <, >, ", ' for safe interpolation

// --- Truncation ---
export function truncate(str: string, length: number): string { ... }

// --- Platform Detection ---
export function isMac(): boolean { ... }
// Returns true on macOS (for keyboard shortcut display: ⌘ vs Ctrl)

// --- Shortcut Formatting ---
export function formatShortcut(key: string): string { ... }
// e.g., 'Mod+B' → '⌘B' on Mac, 'Ctrl+B' on Windows
```

### 15.3 — `src/utils/index.ts` — Re-exports

### 15.4 — Clipboard paste handling

Tiptap handles paste natively via ProseMirror, but we need to ensure:

- Pasting from Google Docs / Word preserves bold, italic, links, lists, headings
- Pasting from VS Code / code editors creates code blocks
- Pasting plain text inserts as plain paragraphs
- Pasting images creates image nodes (if file paste is supported)
- Dangerous HTML (scripts, iframes) is stripped via `sanitizeHTML`

Configure via Tiptap's `editorProps.transformPastedHTML`:

```ts
editorProps: {
  transformPastedHTML(html: string) {
    return sanitizeHTML(html);
  },
}
```

### Checkpoint

- [x] Pasting formatted text from external apps preserves formatting
- [x] Pasting a URL auto-creates a link
- [x] Script tags / event handlers in pasted content are stripped
- [x] All utility functions work correctly in isolation

---

## Phase 16 — Accessibility & Keyboard Navigation

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-16-accessibility` |
| **Blocked by** | Phase 15 |
| **Deliverables** | Roving tabindex in toolbar, ARIA attributes on all components, focus traps in dialogs, keyboard navigation map verified |

**Goal:** Ensure the editor meets WCAG 2.1 AA standards.

### 16.1 — Toolbar accessibility

- **Roving tabindex** — only one toolbar button is in the tab order at a time; arrow keys move focus between buttons
- **`role="toolbar"`** on the toolbar container
- **`aria-label`** on toolbar and each group
- **`aria-pressed`** on toggle buttons (bold, italic, etc.)
- **`aria-disabled`** on disabled buttons
- **Keyboard shortcuts** displayed in `title` attributes

### 16.2 — Editor content area accessibility

- **`role="textbox"`** on the content area
- **`aria-multiline="true"`**
- **`aria-label="Rich text editor"`** or configurable
- **`aria-readonly`** when in read-only mode
- **`aria-placeholder`** when empty

### 16.3 — Dialog accessibility

- **`role="dialog"`** and **`aria-modal="true"`**
- **`aria-labelledby`** pointing to the dialog title
- **Focus trap** — Tab cycles only within the dialog
- **Escape** closes the dialog and returns focus to the triggering button
- **Auto-focus** first input on open

### 16.4 — Keyboard navigation map

| Context | Key | Action |
|---------|-----|--------|
| Editor | **Ctrl/⌘ + B** | Toggle bold |
| Editor | **Ctrl/⌘ + I** | Toggle italic |
| Editor | **Ctrl/⌘ + U** | Toggle underline |
| Editor | **Ctrl/⌘ + Shift + S** | Toggle strikethrough |
| Editor | **Ctrl/⌘ + Z** | Undo |
| Editor | **Ctrl/⌘ + Shift + Z** | Redo |
| Editor | **Ctrl/⌘ + Y** | Redo (alternative) |
| Editor | **Tab** (in list) | Indent list item |
| Editor | **Shift + Tab** (in list) | Outdent list item |
| Editor | **Enter** (end of blockquote) | Exit blockquote |
| Editor | **` ``` `** | Create code block |
| Toolbar | **Tab** | Enter/exit toolbar |
| Toolbar | **Arrow Left/Right** | Navigate between buttons |
| Toolbar | **Enter / Space** | Activate button |
| Dialog | **Tab** | Cycle through form fields |
| Dialog | **Escape** | Close dialog |
| Dialog | **Enter** (on submit button) | Submit form |

### 16.5 — Screen reader testing notes

Document expected screen reader behavior for key flows:
- Navigating to the toolbar
- Activating a formatting button
- Opening and using a dialog
- Entering and editing content

### Checkpoint

- [x] Tab into toolbar → first button focused
- [x] Arrow keys navigate toolbar buttons
- [x] Screen reader announces button labels and states
- [x] Dialog focus trap works correctly
- [x] All keyboard shortcuts functional
- [x] No focus gets lost during any interaction

---

## Phase 17 — Playground App

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-17-playground` |
| **Blocked by** | Phase 16 |
| **Deliverables** | `playground/package.json`, `playground/vite.config.ts`, `playground/src/App.tsx`, `playground/src/main.tsx`, `playground/index.html`, `playground/tsconfig.json` |

**Goal:** Create a local Vite-based playground for manual testing and experimentation.

### 17.1 — `playground/package.json`

```json
{
  "name": "rich-text-editor-playground",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "rich-text-editor-ndevu": "link:../"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

Uses `link:../` to reference the local package — any changes to `src/` are reflected after rebuild.

### 17.2 — `playground/vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
});
```

### 17.3 — `playground/src/main.tsx`

Standard React 18 entry point with `createRoot`.

### 17.4 — `playground/src/App.tsx`

Interactive demo app:

- **Full-featured editor** with all toolbar items
- **Theme toggle** button (light ↔ dark)
- **Read-only toggle** 
- **Custom toolbar demo** — dropdown to select preset toolbar configurations
- **HTML output panel** — shows the raw HTML below the editor
- **JSON output panel** — shows the Tiptap JSON document (for debugging)
- **Responsive layout** — works on mobile viewports too

### 17.5 — Create `playground/index.html`

Standard Vite HTML template with `<div id="root">` and script tag.

### 17.6 — Create `playground/tsconfig.json`

Extends the root tsconfig with playground-specific includes.

### Checkpoint

- [x] `cd playground && yarn install && yarn dev` starts the app
- [x] Editor renders with all features working
- [x] Theme toggle switches light ↔ dark
- [x] HTML output updates in real-time
- [x] No console errors

---

## Phase 18 — Storybook Setup & Stories

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-18-storybook` |
| **Blocked by** | Phase 16 (parallelizable with 17) |
| **Deliverables** | `.storybook/main.ts`, `.storybook/preview.ts`, 3 story files, Storybook deps installed |

**Goal:** Set up Storybook 8 for component-driven development and create stories for all major components.

### 18.1 — Install Storybook dependencies

```bash
yarn add -D @storybook/react-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/blocks storybook
```

### 18.2 — Create `.storybook/main.ts`

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../storybook/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

### 18.3 — Create `.storybook/preview.ts`

```ts
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'centered',
  },
};

export default preview;
```

### 18.4 — `storybook/stories/RichTextEditor.stories.tsx`

**Stories:**

| Story | Description |
|-------|-------------|
| **Default** | Editor with all default props |
| **With Initial Content** | Pre-populated with formatted HTML |
| **Custom Toolbar** | Only bold, italic, underline, link |
| **Read Only** | Editor with `readOnly={true}` |
| **With Placeholder** | Custom placeholder text |
| **Min/Max Height** | Constrained height with scrollable content |
| **Controlled** | Demonstrates two-way binding with external state |
| **Full Featured** | All features enabled, complex content |

Each story uses Storybook Controls for interactive prop manipulation.

### 18.5 — `storybook/stories/Toolbar.stories.tsx`

**Stories:**

| Story | Description |
|-------|-------------|
| **All Items** | Full toolbar with all buttons |
| **Minimal** | Just bold, italic, underline |
| **With Active States** | Pre-set active states for visual testing |
| **Disabled State** | All buttons disabled (read-only mode) |
| **Custom Groups** | Custom grouping with separators |

### 18.6 — `storybook/stories/Themes.stories.tsx`

**Stories:**

| Story | Description |
|-------|-------------|
| **Light Theme** | Editor with `theme="light"` |
| **Dark Theme** | Editor with `theme="dark"` |
| **Side by Side** | Both themes rendered side by side for comparison |
| **Theme Toggle** | Interactive toggle within the story |

### Checkpoint

- [x] `yarn storybook` starts on port 6006
- [x] All stories render correctly
- [x] Controls panel allows prop manipulation
- [x] Accessibility addon shows no violations
- [x] `yarn build-storybook` produces static output

---

## Phase 19 — Example Apps (React Demo & Next.js Demo)

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-19-example-apps` |
| **Blocked by** | Phase 16 (parallelizable with 17, 18) |
| **Deliverables** | `examples/react-demo/` fully functional, `examples/nextjs-demo/` fully functional |

**Goal:** Create realistic example applications demonstrating the editor in real-world contexts.

### 19.1 — React Demo (`examples/react-demo/`)

**Populate `examples/react-demo/package.json`:**
- Vite + React setup
- Dependency on the local package via `link:../../`

**Populate `examples/react-demo/vite.config.ts`:**
- Standard Vite + React plugin config

**Populate `examples/react-demo/src/App.tsx`:**
- Simple blog post editor:
  - Title input
  - `<RichTextEditor />` for body content
  - "Preview" button that renders the HTML output
  - "Save" button (logs to console)
  - Theme toggle

**Create:**
- `examples/react-demo/index.html`
- `examples/react-demo/src/main.tsx`
- `examples/react-demo/tsconfig.json`

### 19.2 — Next.js Demo (`examples/nextjs-demo/`)

**Populate `examples/nextjs-demo/package.json`:**
- Next.js 14+ with App Router or Pages Router
- Dependency on the local package

**Populate `examples/nextjs-demo/next.config.js`:**
- `transpilePackages: ['rich-text-editor-ndevu']` if needed

**Populate `examples/nextjs-demo/pages/index.tsx`:**
- Dynamic import with `ssr: false` (contentEditable doesn't work server-side):

```tsx
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('rich-text-editor-ndevu').then(mod => mod.RichTextEditor),
  { ssr: false, loading: () => <p>Loading editor...</p> }
);
```

- Simple page demonstrating the editor works in a Next.js context
- Validates that the package doesn't break SSR

### Checkpoint

- [x] `cd examples/react-demo && yarn install && yarn dev` works
- [x] `cd examples/nextjs-demo && yarn install && yarn dev` works
- [x] Editor is fully functional in both environments
- [x] Next.js demo handles SSR correctly (no hydration errors)

---

## Phase 20 — Unit & Integration Tests

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-20-unit-tests` |
| **Blocked by** | Phases 17–19 |
| **Deliverables** | `tests/setup.ts`, 12 unit test files, 182 tests, ≥80% code coverage |

**Goal:** Write comprehensive unit and integration tests for all modules.

### 20.1 — Create `tests/setup.ts`

```ts
import '@testing-library/jest-dom/vitest';
```

### 20.2 — `tests/unit/core/engine.test.ts`

**Test cases:**

| Test | Description |
|------|-------------|
| creates editor instance | `createEditor()` returns a Tiptap Editor |
| initializes with content | `createEditor({ content: '<p>Hello</p>' })` → editor contains "Hello" |
| calls onUpdate callback | Simulating content change triggers `onUpdate` with HTML |
| respects editable option | `editable: false` → `editor.isEditable` is false |
| destroys cleanly | `editor.destroy()` doesn't throw |

### 20.3 — `tests/unit/core/commands.test.ts`

**Test cases (for each command):**

| Test | Description |
|------|-------------|
| toggleBold applies bold mark | Select text → `toggleBold(editor)` → HTML contains `<strong>` |
| toggleBold removes bold mark | Select bold text → `toggleBold(editor)` → HTML no longer contains `<strong>` |
| setHeading applies heading | `setHeading(editor, 2)` → HTML contains `<h2>` |
| insertLink creates link | `insertLink(editor, 'https://example.com')` → HTML contains `<a>` |
| insertImage creates image | `insertImage(editor, 'img.png', 'alt')` → HTML contains `<img>` |
| undo reverses last action | Apply bold → undo → bold removed |
| redo re-applies action | Apply bold → undo → redo → bold restored |

### 20.4 — `tests/unit/components/Editor.test.tsx`

**Test cases:**

| Test | Description |
|------|-------------|
| renders without crashing | `render(<RichTextEditor value="" />)` doesn't throw |
| displays initial content | `value="<p>Hello</p>"` → "Hello" visible in DOM |
| calls onChange on edit | Type text → `onChange` called with updated HTML |
| applies readOnly mode | `readOnly={true}` → content area is not editable |
| applies theme class | `theme="dark"` → `data-theme="dark"` attribute present |
| applies custom className | `className="my-class"` → class is on the wrapper |
| renders placeholder | Empty editor shows placeholder text |
| fires onFocus and onBlur | Focus/blur the editor → callbacks called |

### 20.5 — `tests/unit/components/Toolbar.test.tsx`

**Test cases:**

| Test | Description |
|------|-------------|
| renders default toolbar | All default buttons are present |
| renders custom toolbar | `toolbar={['bold', 'italic']}` → only 2 buttons |
| renders separators | `toolbar={['bold', '|', 'italic']}` → separator element between buttons |
| button click triggers command | Click "Bold" button → bold command executed |
| active state reflected | With bold text selected → bold button has `aria-pressed="true"` |
| disabled in readOnly | ReadOnly mode → all buttons have `disabled` attribute |

### 20.6 — `tests/unit/hooks/useEditor.test.ts`

**Test cases:**

| Test | Description |
|------|-------------|
| initializes editor | Hook returns an editor instance |
| syncs value to editor | Changing `value` prop updates editor content |
| syncs editor to onChange | Editing in editor calls `onChange` |
| cleans up on unmount | Unmounting destroys the editor |

### 20.7 — `tests/unit/utils/dom.test.ts`

**Test cases:**

| Test | Description |
|------|-------------|
| sanitizeHTML strips scripts | `<script>alert(1)</script>` → empty string |
| sanitizeHTML strips event handlers | `<img onerror="alert(1)">` → `<img>` |
| sanitizeHTML preserves formatting | `<strong>bold</strong>` → preserved |
| isValidURL accepts http | `https://example.com` → true |
| isValidURL rejects invalid | `not-a-url` → false |

### Checkpoint

- [x] `yarn test` passes all tests
- [x] `yarn test:coverage` shows ≥80% coverage on statements, functions, lines
- [x] No flaky tests

---

## Phase 21 — End-to-End Tests

| | |
|---|---|
| **Status** | `Not Started` |
| **Started** | — |
| **Completed** | — |
| **Branch** | — |
| **Blocked by** | Phase 20 |
| **Deliverables** | `playwright.config.ts`, `editor.spec.ts`, `toolbar.spec.ts`, `themes.spec.ts`, Playwright deps installed |

**Goal:** Write Playwright tests that exercise the editor in a real browser.

### 21.1 — `tests/e2e/playwright.config.ts`

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'cd playground && yarn dev',
    port: 3000,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

### 21.2 — `tests/e2e/editor.spec.ts`

**Test scenarios:**

| Scenario | Steps |
|----------|-------|
| **Type and format text** | Type "Hello World" → select "World" → click Bold → verify `<strong>World</strong>` in output |
| **Apply heading** | Type text → click H1 → verify `<h1>` in output |
| **Insert link** | Type text → select word → click Link → fill dialog → verify `<a>` in output |
| **Insert image** | Click Image → enter URL → verify `<img>` in output |
| **Create list** | Click Bullet List → type items → verify `<ul><li>` structure |
| **Create code block** | Type triple backtick → verify code block renders |
| **Undo/Redo** | Type text → apply bold → undo → verify bold removed → redo → verify bold restored |
| **Placeholder** | Empty editor shows placeholder text → type → placeholder disappears |
| **Read-only mode** | Toggle read-only → verify content is not editable |

### 21.3 — `tests/e2e/toolbar.spec.ts`

**Test scenarios:**

| Scenario | Steps |
|----------|-------|
| **Button states** | Select bold text → bold button appears pressed |
| **Custom toolbar** | Render with minimal toolbar → verify only those buttons present |
| **Keyboard shortcuts** | Focus editor → Ctrl+B → verify bold toggled |

### 21.4 — `tests/e2e/themes.spec.ts`

**Test scenarios:**

| Scenario | Steps |
|----------|-------|
| **Light theme** | Default render → verify light background colors |
| **Dark theme** | Set `theme="dark"` → verify dark background colors |
| **Theme switch** | Toggle theme → verify colors change dynamically |

### Checkpoint

- [ ] `yarn test:e2e` passes on Chromium, Firefox, and WebKit
- [ ] Tests are stable (no flaky failures)
- [ ] Screenshots captured on failure for debugging

---

## Phase 22 — Documentation

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-22-documentation` |
| **Blocked by** | Phase 21 (skipped — E2E deferred) |
| **Deliverables** | `docs/architecture.md`, `docs/api.md`, `docs/plugins.md`, `docs/theming.md`, `docs/contributing.md`, updated `CONTRIBUTING.md`, `CHANGELOG.md` |

**Goal:** Write comprehensive documentation for users, contributors, and plugin authors.

### 22.1 — `docs/architecture.md`

- Component hierarchy diagram (Mermaid or ASCII)
- Data flow: props → Zustand store → Tiptap editor → DOM → onChange
- Extension system overview
- Directory structure explanation with rationale
- CSS Module scoping strategy
- Decision log (why Tiptap, why Zustand, why CSS Modules)

### 22.2 — `docs/api.md`

- Full props reference table (matches README)
- `RichTextEditor` component API
- Exported hooks:
  - `useEditor()` — return type, usage example
  - `useHistory()` — return type, usage example
  - `useToolbar()` — return type, usage example
- Exported types (list every public type with description)
- `createEditor()` — headless usage for advanced cases
- Event callbacks (`onChange`, `onFocus`, `onBlur`)
- Toolbar item reference with icons/descriptions

### 22.3 — `docs/plugins.md`

- How the plugin system works (Tiptap extensions under the hood)
- Built-in plugins: description, configuration, what each adds
- How to create a custom plugin:
  - Step 1: Create a Tiptap extension
  - Step 2: Register via `createExtensions()`
  - Step 3: Add toolbar items
  - Step 4: Add keyboard shortcuts
- Example: creating a "highlight" plugin
- Extension configuration options

### 22.4 — `docs/theming.md`

- Theme prop usage (`'light' | 'dark'`)
- Full list of CSS custom properties (see Appendix C)
- How to create a custom theme:
  - Override CSS variables in your app
  - Create a third theme (e.g., "high-contrast")
- How CSS Modules scoping works
- Typography customization
- Dark mode code block theme

### 22.5 — `docs/contributing.md`

- Development setup (clone, install, dev server)
- Project structure walkthrough
- Coding standards (TypeScript, ESLint, Prettier)
- Testing guidelines (writing unit tests, E2E tests)
- PR workflow and review process
- Architecture decisions to be aware of

### 22.6 — Update `CONTRIBUTING.md`

Replace the placeholder with real contribution guidelines with `yarn` commands.

### 22.7 — Update `CHANGELOG.md`

```md
# Changelog

## [0.1.0] - 2026-XX-XX

### Added
- Initial release
- Rich text editing with bold, italic, underline, strikethrough
- Headings (H1–H6)
- Ordered and unordered lists
- Link insertion and editing
- Image insertion (URL and file upload)
- Blockquotes
- Code blocks with syntax highlighting
- Undo / Redo
- Clipboard paste with format preservation
- Light and dark themes
- Customizable toolbar
- Read-only mode
- Full keyboard navigation
- ARIA accessibility
- TypeScript type definitions
```

### Checkpoint

- [x] All docs/ files are populated with substantive content
- [x] CONTRIBUTING.md has real instructions
- [x] CHANGELOG.md tracks v0.1.0

---

## Phase 23 — CI / CD Pipelines

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-23-ci-cd` |
| **Blocked by** | Phase 22 |
| **Deliverables** | `.github/workflows/ci.yml`, `.github/workflows/release.yml`, updated issue/PR templates |

**Goal:** Set up GitHub Actions for automated testing, linting, and release.

### 23.1 — `.github/workflows/ci.yml`

**Triggers:** PR to `main`, push to `main`

**Jobs:**

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node 20 + Corepack
      - yarn install --immutable
      - yarn lint
      - yarn format:check
      - yarn typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node 20 + Corepack
      - yarn install --immutable
      - yarn test:coverage
      - Upload coverage to Codecov (optional)

  build:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node 20 + Corepack
      - yarn install --immutable
      - yarn build
      - Verify dist/ contains expected files

  e2e:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node 20 + Corepack
      - yarn install --immutable
      - Install Playwright browsers
      - yarn test:e2e
      - Upload test results on failure
```

### 23.2 — `.github/workflows/release.yml`

**Triggers:** push tag matching `v*`

**Jobs:**

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write  # for npm provenance
    steps:
      - Checkout
      - Setup Node 20 + Corepack
      - yarn install --immutable
      - yarn test
      - yarn build
      - Publish to npm with provenance
```

### 23.3 — Update `.github/ISSUE_TEMPLATE.md`

Expand with proper issue template sections:
- Bug report (steps to reproduce, expected vs actual, environment)
- Feature request (description, use case, proposed solution)

### 23.4 — Update `.github/PULL_REQUEST_TEMPLATE.md`

Expand with:
- Description of changes
- Related issue(s)
- Checklist (tests added, docs updated, lint passing)

### Checkpoint

- [x] CI runs on every PR and blocks merge on failure
- [x] Release workflow publishes to npm on tag push
- [x] Issue and PR templates are helpful and complete

---

## Phase 24 — Build Scripts & Release Pipeline

| | |
|---|---|
| **Status** | `Complete` |
| **Started** | 2026-03-15 |
| **Completed** | 2026-03-15 |
| **Branch** | `feat/phase-24-build-scripts` |
| **Blocked by** | Phase 23 |
| **Deliverables** | `scripts/clean.ts`, `scripts/build.ts`, `scripts/release.ts` |

**Goal:** Implement the build, clean, and release automation scripts.

### 24.1 — `scripts/clean.ts`

```ts
import { rmSync } from 'fs';

const dirs = ['dist', 'coverage', 'storybook-static', '.turbo'];

for (const dir of dirs) {
  rmSync(dir, { recursive: true, force: true });
  console.log(`Cleaned: ${dir}`);
}
```

### 24.2 — `scripts/build.ts`

```ts
import { execSync } from 'child_process';

// 1. Clean previous build
execSync('tsx scripts/clean.ts', { stdio: 'inherit' });

// 2. Type-check
execSync('yarn typecheck', { stdio: 'inherit' });

// 3. Build with tsup
execSync('yarn tsup', { stdio: 'inherit' });

// 4. Verify output
// Check that dist/index.js, dist/index.cjs, dist/index.d.ts exist
console.log('Build completed successfully!');
```

### 24.3 — `scripts/release.ts`

```ts
// Semi-automated release script:
// 1. Ensure working directory is clean
// 2. Run full test suite
// 3. Build
// 4. Bump version (prompt: patch/minor/major)
// 5. Update CHANGELOG.md
// 6. Commit and tag
// 7. Push tag (triggers GitHub Actions release workflow)
```

### Checkpoint

- [x] `yarn clean` removes all build artifacts
- [x] `tsx scripts/build.ts` produces a valid `dist/` directory
- [x] Release script works end-to-end (dry run)

---

## Phase 25 — Final Polish, Public API & v0.1.0 Release

| | |
|---|---|
| **Status** | `Not Started` |
| **Started** | — |
| **Completed** | — |
| **Branch** | — |
| **Blocked by** | Phase 24 |
| **Deliverables** | `src/index.ts` (public API), verified `package.json` exports, git tag `v0.1.0`, npm publish |

**Goal:** Finalize the public API surface, verify everything works end-to-end, and prepare for the first release.

### 25.1 — `src/index.ts` (Public API barrel export)

This is the single entry point consumers see when they `import from 'rich-text-editor-ndevu'`:

```ts
// --- Main Component ---
export { RichTextEditor } from './components/Editor';
export type { RichTextEditorProps } from './types';

// --- Hooks ---
export { useEditor } from './hooks/useEditor';
export { useHistory } from './hooks/useHistory';
export { useToolbar } from './hooks/useToolbar';

// --- Types ---
export type {
  Theme,
  ToolbarItem,
  ToolbarItemType,
  ToolbarSeparator,
  ToolbarButtonConfig,
  EditorState,
  EditorConfig,
  PluginConfig,
} from './types';

// --- Constants ---
export { DEFAULT_TOOLBAR } from './types/toolbar.types';

// --- Headless (advanced usage) ---
export { createEditor } from './core/engine';
export type { CreateEditorOptions } from './core/engine';

// --- Styles (auto-imported by bundlers via sideEffects) ---
import './styles/index.css';
```

### 25.2 — Verify `package.json` exports map

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/index.css"
  }
}
```

### 25.3 — End-to-end verification checklist

Run every check:

| Command | Expected |
|---------|----------|
| `yarn install` | No errors |
| `yarn typecheck` | No type errors |
| `yarn lint` | No lint errors |
| `yarn format:check` | All files formatted |
| `yarn test` | All unit tests pass |
| `yarn test:coverage` | ≥80% coverage |
| `yarn build` | `dist/` contains `index.js`, `index.cjs`, `index.d.ts`, `index.css` |
| `yarn test:e2e` | All E2E tests pass |
| `yarn storybook` | Opens and renders all stories |
| `cd playground && yarn dev` | Playground works |
| `cd examples/react-demo && yarn dev` | React demo works |
| `cd examples/nextjs-demo && yarn dev` | Next.js demo works (no SSR errors) |
| `npm pack --dry-run` | Package contains only `dist/`, `README.md`, `LICENSE`, `package.json` |

### 25.4 — Final README review

- Ensure all code examples work with the actual API
- Update badges if needed
- Verify install commands are correct
- Confirm peer dependency versions match

### 25.5 — Tag and release

```bash
git add .
git commit -m "feat: v0.1.0 — initial release"
git tag v0.1.0
git push origin main --tags
```

GitHub Actions release workflow publishes to npm.

### Checkpoint

- [ ] Package is published to npm as `rich-text-editor-ndevu@0.1.0`
- [ ] `yarn add rich-text-editor-ndevu` works in a fresh project
- [ ] `npm install rich-text-editor-ndevu` works in a fresh project
- [ ] All features work as documented in the README

---

## Appendix A — Full Dependency List

### Production Dependencies

| Package | Purpose |
|---------|---------|
| `@tiptap/core` | Core editing engine |
| `@tiptap/pm` | ProseMirror peer dependency for Tiptap |
| `@tiptap/react` | React bindings for Tiptap |
| `@tiptap/starter-kit` | Bundle of common extensions (bold, italic, strike, heading, list, blockquote, code, history, etc.) |
| `@tiptap/extension-underline` | Underline mark (not in StarterKit) |
| `@tiptap/extension-link` | Link mark with autolink |
| `@tiptap/extension-image` | Image node |
| `@tiptap/extension-code-block-lowlight` | Code block with syntax highlighting |
| `@tiptap/extension-placeholder` | Placeholder text when editor is empty |
| `lowlight` | Syntax highlighting engine (highlight.js-based AST) |
| `zustand` | Global state management |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `typescript` | TypeScript compiler |
| `tsup` | Bundler (ESM + CJS + DTS) |
| `vite` | Dev server for playground |
| `@vitejs/plugin-react` | Vite React plugin |
| `react` | React (dev + peer) |
| `react-dom` | React DOM (dev + peer) |
| `@types/react` | React type definitions |
| `@types/react-dom` | React DOM type definitions |
| `eslint` | Linter |
| `prettier` | Code formatter |
| `eslint-config-prettier` | Disables ESLint rules that conflict with Prettier |
| `@typescript-eslint/eslint-plugin` | TypeScript ESLint rules |
| `@typescript-eslint/parser` | TypeScript ESLint parser |
| `eslint-plugin-react` | React-specific ESLint rules |
| `eslint-plugin-react-hooks` | Hooks rules (exhaustive-deps, etc.) |
| `vitest` | Unit test runner |
| `@vitest/coverage-v8` | Coverage via V8 |
| `@testing-library/react` | React component testing utilities |
| `@testing-library/jest-dom` | DOM assertion matchers |
| `@testing-library/user-event` | Simulated user interactions |
| `jsdom` | DOM environment for tests |
| `@playwright/test` | E2E testing framework |
| `@storybook/react-vite` | Storybook framework |
| `@storybook/addon-essentials` | Standard Storybook addons |
| `@storybook/addon-a11y` | Accessibility checks in Storybook |
| `@storybook/blocks` | Storybook doc blocks |
| `storybook` | Storybook CLI |
| `tsx` | TypeScript execution for scripts |

---

## Appendix B — File Ownership Matrix

Every file in the project and which phase creates/populates it:

| File | Phase |
|------|-------|
| `.yarnrc.yml` | 1 |
| `.yarn/releases/*` | 1 |
| `yarn.lock` | 1 |
| `package.json` | 1 |
| `.gitignore` | 1 |
| `tsconfig.json` | 2 |
| `tsup.config.ts` | 2 |
| `config/vitest.config.ts` | 2 |
| `.eslintrc.cjs` | 2 |
| `.prettierrc` | 2 |
| `.prettierignore` | 2 |
| `config/rollup.config.ts` | 2 (optional) |
| `tests/setup.ts` | 2 |
| `src/types/editor.types.ts` | 3 |
| `src/types/toolbar.types.ts` | 3 |
| `src/types/plugin.types.ts` | 3 |
| `src/types/index.ts` | 3 |
| `src/core/schema.ts` | 4 (updated in 9, 11, 12, 13) |
| `src/core/engine.ts` | 4 |
| `src/core/commands.ts` | 4 |
| `src/core/store.ts` | 4 (NEW) |
| `src/core/model.ts` | 4 |
| `src/core/index.ts` | 4 |
| `src/hooks/useEditor.ts` | 5 |
| `src/hooks/useToolbar.ts` | 5 |
| `src/hooks/useHistory.ts` | 5 |
| `src/hooks/index.ts` | 5 |
| `src/components/Content/ContentEditable.tsx` | 6 |
| `src/components/Content/Parser.ts` | 6 |
| `src/components/Content/Serializer.ts` | 6 |
| `src/components/Content/index.ts` | 6 |
| `src/components/Editor/EditorProvider.tsx` | 6 |
| `src/components/Editor/EditorWrapper.tsx` | 6 |
| `src/components/Editor/RichTextEditor.tsx` | 6 |
| `src/components/Editor/index.ts` | 6 |
| `src/components/Toolbar/ToolbarButton.tsx` | 7 |
| `src/components/Toolbar/ToolbarSeparator.tsx` | 7 |
| `src/components/Toolbar/ToolbarGroup.tsx` | 7 |
| `src/components/Toolbar/Toolbar.tsx` | 7 |
| `src/components/Toolbar/index.ts` | 7 |
| `src/styles/theme-light.css` | 8 |
| `src/styles/theme-dark.css` | 8 |
| `src/styles/editor.css` | 8 |
| `src/styles/toolbar.css` | 8 |
| `src/styles/index.css` | 8 |
| `src/components/Plugins/LinkPlugin.tsx` | 11 |
| `src/components/Plugins/ImagePlugin.tsx` | 12 |
| `src/components/Plugins/ListsPlugin.tsx` | 10 |
| `src/components/Plugins/CodeBlockPlugin.tsx` | 13 |
| `src/components/Plugins/HistoryPlugin.tsx` | 14 |
| `src/components/Plugins/index.ts` | 14 |
| `src/components/Dialogs/LinkDialog.tsx` | 11 |
| `src/components/Dialogs/ImageDialog.tsx` | 12 |
| `src/components/Dialogs/index.ts` | 12 |
| `src/utils/dom.ts` | 15 |
| `src/utils/string.ts` | 15 |
| `src/utils/index.ts` | 15 |
| `playground/package.json` | 17 |
| `playground/vite.config.ts` | 17 |
| `playground/src/main.tsx` | 17 |
| `playground/src/App.tsx` | 17 |
| `playground/index.html` | 17 |
| `playground/tsconfig.json` | 17 |
| `.storybook/main.ts` | 18 |
| `.storybook/preview.ts` | 18 |
| `storybook/stories/RichTextEditor.stories.tsx` | 18 |
| `storybook/stories/Toolbar.stories.tsx` | 18 |
| `storybook/stories/Themes.stories.tsx` | 18 |
| `examples/react-demo/package.json` | 19 |
| `examples/react-demo/vite.config.ts` | 19 |
| `examples/react-demo/src/App.tsx` | 19 |
| `examples/nextjs-demo/package.json` | 19 |
| `examples/nextjs-demo/next.config.js` | 19 |
| `examples/nextjs-demo/pages/index.tsx` | 19 |
| `tests/unit/core/engine.test.ts` | 20 |
| `tests/unit/core/commands.test.ts` | 20 |
| `tests/unit/components/Editor.test.tsx` | 20 |
| `tests/unit/components/Toolbar.test.tsx` | 20 |
| `tests/unit/hooks/useEditor.test.ts` | 20 |
| `tests/unit/utils/dom.test.ts` | 20 |
| `tests/e2e/playwright.config.ts` | 21 |
| `tests/e2e/editor.spec.ts` | 21 |
| `tests/e2e/toolbar.spec.ts` | 21 |
| `tests/e2e/themes.spec.ts` | 21 |
| `docs/architecture.md` | 22 |
| `docs/api.md` | 22 |
| `docs/plugins.md` | 22 |
| `docs/theming.md` | 22 |
| `docs/contributing.md` | 22 |
| `CONTRIBUTING.md` | 22 |
| `CHANGELOG.md` | 22 |
| `.github/workflows/ci.yml` | 23 |
| `.github/workflows/release.yml` | 23 |
| `.github/ISSUE_TEMPLATE.md` | 23 |
| `.github/PULL_REQUEST_TEMPLATE.md` | 23 |
| `scripts/clean.ts` | 24 |
| `scripts/build.ts` | 24 |
| `scripts/release.ts` | 24 |
| `src/index.ts` | 25 |
| `README.md` | 1 (commands update), 25 (final review) |

---

## Appendix C — CSS Custom Property Tokens

Complete list of design tokens used across both themes:

| Token | Description | Light | Dark |
|-------|-------------|-------|------|
| `--rte-bg` | Editor background | `#ffffff` | `#1e1e2e` |
| `--rte-text` | Main text color | `#1a1a2e` | `#cdd6f4` |
| `--rte-text-muted` | Secondary text | `#6b7280` | `#a6adc8` |
| `--rte-border` | Border color | `#e0e0e0` | `#45475a` |
| `--rte-toolbar-bg` | Toolbar background | `#f8f9fa` | `#181825` |
| `--rte-toolbar-border` | Toolbar bottom border | `#e0e0e0` | `#313244` |
| `--rte-button-hover` | Button hover background | `#e9ecef` | `#313244` |
| `--rte-button-active` | Button active (mousedown) | `#dee2e6` | `#45475a` |
| `--rte-button-pressed` | Button toggled/pressed state | `#d0d7de` | `#585b70` |
| `--rte-button-text` | Button icon/text color | `#374151` | `#cdd6f4` |
| `--rte-accent` | Accent color (active indicators, links) | `#0969da` | `#89b4fa` |
| `--rte-placeholder` | Placeholder text color | `#9ca3af` | `#585b70` |
| `--rte-focus-ring` | Focus ring color | `rgba(9,105,218,0.3)` | `rgba(137,180,250,0.3)` |
| `--rte-code-bg` | Inline code background | `#f6f8fa` | `#313244` |
| `--rte-code-text` | Inline code text color | `#1a1a2e` | `#cdd6f4` |
| `--rte-codeblock-bg` | Code block background | `#f6f8fa` | `#1e1e2e` |
| `--rte-blockquote-border` | Blockquote left border | `#d0d7de` | `#585b70` |
| `--rte-blockquote-text` | Blockquote text color | `#57606a` | `#a6adc8` |
| `--rte-link-color` | Link text color | `#0969da` | `#89b4fa` |
| `--rte-dialog-overlay` | Dialog backdrop | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.6)` |
| `--rte-dialog-bg` | Dialog card background | `#ffffff` | `#1e1e2e` |
| `--rte-dialog-border` | Dialog border | `#e0e0e0` | `#45475a` |
| `--rte-input-bg` | Form input background | `#ffffff` | `#313244` |
| `--rte-input-border` | Form input border | `#d1d5db` | `#45475a` |
| `--rte-input-focus` | Form input focus border | `#0969da` | `#89b4fa` |
| `--rte-shadow` | Box shadow | `0 1px 3px rgba(0,0,0,0.12)` | `0 1px 3px rgba(0,0,0,0.4)` |
| `--rte-radius` | Border radius | `8px` | `8px` |
| `--rte-radius-sm` | Small border radius | `4px` | `4px` |
| `--rte-font-family` | Editor font family | `system-ui, -apple-system, sans-serif` | (same) |
| `--rte-font-mono` | Monospace font family | `'Fira Code', 'JetBrains Mono', monospace` | (same) |
| `--rte-font-size` | Base font size | `16px` | `16px` |
| `--rte-line-height` | Base line height | `1.6` | `1.6` |

---

> **This plan is a living document.** Update phase statuses and checkpoints as work progresses. Each phase should be completed and verified before moving to the next, though Phases 9–14 (plugins) can be worked on in parallel once Phase 8 is done.

---

## Appendix D — Progress Log

Chronological record of implementation progress. Add entries as work is done.

> **Format:** `YYYY-MM-DD` | Phase # | What was done | Any blockers or decisions

| Date | Phase | Summary | Notes |
|------|-------|---------|-------|
| 2026-03-15 | 1 | Initialized Yarn 4.13.0, populated package.json with full metadata/scripts/exports, installed 5 prod + 21 dev deps, updated .gitignore & README | ESLint pinned to v9 for eslint-plugin-react-hooks compat; added @testing-library/dom as missing peer |
| 2026-03-15 | 2 | Configured tsconfig.json (strict), tsup (dual ESM/CJS), vitest, ESLint v9 flat config, Prettier | Migrated .eslintrc.cjs → eslint.config.js for ESLint v9; added @eslint/js@9 + globals; rollup config marked as optional fallback |
| 2026-03-15 | 3 | Defined all TypeScript interfaces: editor types, toolbar types, plugin types, barrel index | No deviations; import graph is acyclic (editor→toolbar, plugin→toolbar) |
| 2026-03-15 | 4 | Built core engine: schema.ts (StarterKit), engine.ts (editor factory), commands.ts (15 commands), store.ts (Zustand), model.ts (HTML↔JSON), barrel | Used insertContent for image cmd (Image ext not yet loaded); fixed no-undef ESLint rule for TS files; added React type imports to Phase 3 files |
| 2026-03-15 | 5 | Built 3 custom React hooks: useEditor (lifecycle, controlled value sync, active state), useToolbar (item→config mapping, actions, active states), useHistory (undo/redo with canUndo/canRedo) | Tiptap v3 changed setContent 2nd param from boolean to SetContentOptions object; icons deferred to Phase 7 Toolbar component |
| 2026-03-15 | 6 | Built editor shell: ContentEditable (EditorContent wrapper), Parser/Serializer (JSON↔HTML), EditorProvider (lifecycle bridge), EditorWrapper (composition), RichTextEditor (public API). Populated src/index.ts with full public API exports | Used @tiptap/core for generateHTML/generateJSON (not @tiptap/html); Toolbar stub until Phase 7; bundle now 13KB ESM |
| 2026-03-15 | 7 | Built toolbar system: ToolbarButton (aria-label/pressed, shortcut hints, fallback text), ToolbarSeparator (role=separator), ToolbarGroup (role=group), Toolbar (groupBySeparator, roving tabindex ArrowLeft/Right/Home/End). Wired Toolbar into EditorWrapper replacing stub. | No CSS Modules yet (Phase 8); icons still null (text labels used); bundle now 15.78KB ESM |
| 2026-03-15 | 8 | Built styles & theming: theme-light.css + theme-dark.css (32 tokens each), editor.css (wrapper, focus ring, prose typography for headings/lists/blockquote/code/links/images/hr), toolbar.css (button hover/active/pressed/disabled/focus-visible, separator, group), index.css master import. Wired .rte-* classes into all components. CSS bundled via import in src/index.ts. | Used .rte-* BEM-style prefix instead of CSS Modules (better for library consumers); CSS output 7.40 KB |
| 2026-03-15 | 9 | Installed @tiptap/extension-underline, added Underline to schema.ts extension array. Updated Plugins barrel index with roadmap comments. Bold/italic/strike/headings already functional via StarterKit. | No new component needed — formatting is extension-level; CodeBlockPlugin remains placeholder for Phase 13 |
| 2026-03-15 | 10 | Created ListsPlugin.tsx with sinkListItem/liftListItem helpers. Added both commands to core/commands.ts + core/index.ts + src/index.ts public API. Updated Plugins barrel. Lists + blockquotes already functional via StarterKit; CSS from Phase 8 handles nested markers. | Tab/Shift+Tab nesting exposed as exported functions; no Tiptap extension override needed |
| 2026-03-15 | 11 | Installed @tiptap/extension-link (autolink, linkOnPaste, openOnClick:false). Added Link.configure to schema.ts. Created LinkPlugin.tsx (getActiveLinkAttrs, getSelectedText, applyLink, removeLink). Created LinkDialog.tsx (accessible modal: focus trap, Escape close, Enter submit, URL validation, edit/remove modes). Created dialog.css (overlay, card, inputs, buttons, animations). Wired LinkDialog into EditorWrapper. Updated barrel exports. | Refactored useEffect → state initializers to satisfy react-hooks/set-state-in-effect lint rule; CSS 10.22 KB; ESM 23.46 KB |
| 2026-03-15 | 12 | Installed @tiptap/extension-image (inline:false, allowBase64:true, loading:lazy). Added Image.configure to schema.ts. Created ImagePlugin.tsx (insertImageByUrl, insertImageBase64, readFileAsBase64, MAX_IMAGE_SIZE). Created ImageDialog.tsx (accessible modal: drag-drop zone, file upload with FileReader base64, URL input, alt text, preview thumbnail, 5MB warning). Extended dialog.css (dropzone, file info, separator, warning, preview). Wired ImageDialog into EditorWrapper. Updated all barrel exports + public API. | CSS 13.15 KB (+2.93 KB); ESM 33.95 KB (+10.49 KB) |
| 2026-03-15 | 13 | Installed @tiptap/extension-code-block-lowlight + lowlight + @tiptap/extension-code-block + highlight.js (peers). Disabled StarterKit codeBlock, added CodeBlockLowlight.configure with lowlight (common bundle). Created CodeBlockPlugin.tsx (getCodeBlockLanguage, setCodeBlockLanguage, SUPPORTED_LANGUAGES). Created highlight.css (GitHub-like light + Catppuccin-inspired dark syntax colors for all hljs classes). Exported lowlight instance for consumer language registration. | CSS 17.85 KB (+4.70 KB); ESM 35.40 KB (+1.45 KB); language selector is exported helper, not a UI component yet |
| 2026-03-15 | 14 | Configured StarterKit undoRedo (depth:100, newGroupDelay:500) in schema.ts. Created HistoryPlugin.tsx (canUndo, canRedo, HISTORY_DEPTH, HISTORY_NEW_GROUP_DELAY constants). Enhanced useToolbar to disable undo/redo buttons based on editor.can().undo()/redo() state. Updated Plugins barrel + public API exports. | Tiptap v3 StarterKit uses `undoRedo` key (not `history`); defaults already match plan values (100 / 500ms); CSS unchanged; ESM 35.95 KB (+0.55 KB) |
| 2026-03-15 | 15 | Implemented dom.ts (sanitizeHTML with DOMParser recursive sanitizer — strips script/style/iframe/event handlers/javascript: URIs; getSelectionRect; focusFirstFocusable; trapFocus; isElementVisible). Implemented string.ts (isValidURL, escapeHTML, truncate, isMac, formatShortcut). Updated utils barrel. Wired transformPastedHTML in engine.ts. Added 10 util exports to public API. | CSS unchanged 17.85 KB; ESM 40.37 KB (+4.42 KB); DTS 19.09 KB (+3.63 KB from new exports) |
| 2026-03-15 | 16 | Enhanced Toolbar with proper roving tabindex (only one button has tabindex=0, rest -1; arrow keys move + update tracked roving id). Added aria-disabled to ToolbarButton. Added ARIA attributes to editor content area via editorProps.attributes (role=textbox, aria-multiline, aria-label, aria-placeholder, aria-readonly). Added ariaLabel prop flowing through RichTextEditor → EditorProvider → useEditor → createEditor. Added focus restoration to dialogs (triggerRef saves activeElement on mount, restores on close via requestAnimationFrame). Synced aria-readonly with readOnly prop changes. Milestone M5 reached. | CSS unchanged 17.85 KB; ESM 42.04 KB (+1.67 KB); DTS 19.37 KB (+0.28 KB from ariaLabel prop) |
| 2026-03-15 | 17 | Created Vite 6.4.1 playground with React 19. package.json with link:../ for local pkg. index.html, tsconfig.json, vite.config.ts. main.tsx (createRoot). App.tsx: 4 toolbar presets (full/minimal/writing/code), theme toggle (light↔dark), read-only toggle, HTML output panel with show/hide, sample content, responsive layout. Standalone yarn.lock for separate Yarn project. Updated .gitignore for playground/examples node_modules. | Deviated from plan: React 19 (not 18) to match root project; dropped JSON panel (Tiptap JSON requires editor instance, not in public scope); added separate yarn.lock for Yarn 4 Berry standalone project |
| 2026-03-15 | 18 | Installed Storybook 8.6.18 (aligned all 5 packages). Created .storybook/main.ts (react-vite framework, stories glob, react-docgen-typescript). Created .storybook/preview.ts (CSS import, layout padded, controls matchers). Wrote RichTextEditor.stories.tsx (8 stories: Default, WithInitialContent, CustomToolbar, ReadOnly, WithPlaceholder, MinMaxHeight, Controlled, FullFeatured). Wrote Toolbar.stories.tsx (5 stories: AllItems, Minimal, WithHeadings, DisabledState, CustomGroups). Wrote Themes.stories.tsx (4 stories: LightTheme, DarkTheme, SideBySide, ThemeToggle). build-storybook produces static output (371 modules, 8.59s). | Initially installed storybook v10 (latest) mixed with v8 addons — removed & reinstalled all at ^8.6.0 for alignment; Vite peer dep warning (project has v8, Storybook wants ^6) is cosmetic only |
| 2026-03-15 | 19 | React demo: Vite 6 + React 19 blog post editor with code-split components (Header, Preview, HtmlOutput), CSS stylesheet (data-theme selectors), constants file, title input, theme toggle, preview mode, save button, HTML output. Next.js 14 demo: Pages Router, dynamic import with ssr:false + loading placeholder, transpilePackages config, Header/HtmlOutput components, theme toggle. Both install & dev/build verified. Milestone M6 reached. | Used React 19 (not 18) for both; Next.js 14 peer dep warnings with React 19 are cosmetic; ESLint ignoreDuringBuilds needed (root ESLint 9 flat config incompatible with Next.js 14 built-in lint); code-split per user request instead of single-file approach |
| 2026-03-15 | 22 | Documentation: architecture.md (hierarchy, data flow, extension system, directory rationale, decision log), api.md (full props/hooks/commands/types/constants reference), plugins.md (built-in plugins, custom plugin guide), theming.md (all 32 CSS tokens, custom theme guide), contributing.md (detailed dev guide), CONTRIBUTING.md (concise quick-start), CHANGELOG.md (v0.1.0 features) | Phase 21 (E2E) deferred by user decision; proceeded to Phase 22 directly |
| 2026-03-15 | 20 | Unit & integration tests: 12 test files, 182 tests all passing. Coverage: stmts 84.8%, branches 75.4%, funcs 88%, lines 87.6%. Tested: engine, commands (18 cmds), Editor component, Toolbar (buttons, keyboard, a11y), useEditor/useToolbar/useHistory hooks, dom utils, string utils, content Parser/Serializer, model, all Plugins, both Dialogs (LinkDialog + ImageDialog with validation, submit, Escape, overlay click, drag-drop). | Added 6 additional test files beyond the 6 planned (model, Content, Plugins, Dialogs, useToolbar, useHistory) to meet 80% coverage thresholds; jsdom limitations prevented getBoundingClientRect tests |
| 2026-03-15 | 23 | CI/CD pipelines: ci.yml (lint+typecheck, test+coverage, build+verify — 3 parallel jobs, Node 20, Corepack, concurrency groups), release.yml (npm publish on v* tag with provenance), YAML form-based issue templates (bug_report.yml + feature_request.yml), expanded PR template (description, related issues, change type, checklist, screenshots) | E2E job omitted from CI (Phase 21 deferred); used YAML form templates instead of Markdown issue templates; added npm provenance via id-token permission |
| 2026-03-15 | 24 | Build scripts & release pipeline: clean.ts (dist + optional coverage/storybook-static/.turbo via --all), build.ts (clean→typecheck→tsup→verify with size checks), release.ts (dirty check→tests→build→version bump→changelog update→git tag→push, --dry-run support). Added tsx devDep. Updated package.json scripts (clean, clean:all, prepublishOnly, release). | Added tsx as devDep (was missing); prepublishOnly now runs full build.ts pipeline; release --dry-run verified end-to-end |

<!--
Example entries:
| 2026-03-16 | 1 | Initialized Yarn 4, populated package.json, installed deps | Used Yarn 4.6.0; chose node-modules linker |
| 2026-03-16 | 2 | Configured tsconfig, tsup, ESLint, Prettier | Added `@/*` path alias |
| 2026-03-17 | 3 | Defined all type interfaces | Added `DialogType` not in original spec |
-->

### How to update this plan

1. **Starting a phase:** Set its status to `In Progress` in both the Dashboard table and the Phase metadata table. Fill in the **Started** date.
2. **Completing a phase:** Set status to `Complete`. Fill in the **Completed** date. Check off all checkpoint items (`- [x]`). Update the **Overall** counter at the top (e.g., `3 / 25 phases complete | 12% done`).
3. **Blocked:** Set status to `Blocked` and add a note explaining what's blocking it.
4. **Skipping a phase:** Set status to `Skipped` with a note explaining why.
5. **Log entry:** Add a row to the Progress Log table with a one-line summary of what was done.
6. **Milestone reached:** Fill in the **Reached** date in the Milestone Markers table.
