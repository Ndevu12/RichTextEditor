# Contributing - Technical Deep Dive

> **Start here first:** [CONTRIBUTING.md](../CONTRIBUTING.md) covers the essential guidelines for all contributors.
>
> This document provides additional technical depth for contributors working on the codebase internals.

---

## Detailed Coding Standards

### TypeScript Conventions

- **Strict mode** is enabled with all strict checks
- Target: `ES2020`, JSX: `react-jsx`
- Path alias: `@/*` maps to `src/*`
- Use `type` imports everywhere: `import type { Foo } from './bar'`
- No `any` unless absolutely necessary (ESLint enforces this)
- Prefer `interface` for object shapes that may be extended, `type` for unions and intersections

### ESLint Configuration

ESLint v9 flat config at `eslint.config.js`. Key rules enforced:

| Rule | Level | Notes |
|------|-------|-------|
| `@typescript-eslint/no-explicit-any` | error | No `any` types |
| `react-hooks/rules-of-hooks` | error | Hooks called correctly |
| `react-hooks/exhaustive-deps` | warn | Dependency arrays complete |
| `no-console` | warn | Use sparingly |

### Prettier Settings

Configured in `package.json`:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true
}
```

### CSS Architecture

- All class names use `.rte-*` BEM-like prefix to avoid conflicts with consumer styles
- Colors and dimensions always use `var(--rte-*)` tokens (never hard-coded)
- Theme styles live in `theme-light.css` / `theme-dark.css` scoped under `[data-theme='...']`
- No CSS-in-JS, no CSS Modules, no Tailwind - plain CSS files only
- See [theming.md](./theming.md) for the full token reference

---

## Architecture Rules

These rules are enforced to maintain the codebase's separation of concerns:

### `core/` Must Stay Framework-Agnostic

Files in `src/core/` must **never** import React. They contain:
- `engine.ts` - Tiptap Editor factory
- `commands.ts` - imperative editor commands
- `schema.ts` - extension assembly
- `model.ts` - HTML/JSON conversion
- `store.ts` - Zustand store (Zustand is framework-agnostic)

### Hooks Bridge Core and React

Each hook in `src/hooks/` has one clear responsibility:
- `useEditor` - editor lifecycle and prop synchronization
- `useToolbar` - resolves toolbar item strings to button configs
- `useHistory` - undo/redo state and actions

If you need new editor behavior, consider whether it belongs in `core/` (framework-agnostic) or `hooks/` (React-specific).

### Component Organization

Components in `src/components/` are grouped by feature:
- `Editor/` - the main `RichTextEditor` shell
- `Toolbar/` - toolbar system (button, separator, group)
- `Content/` - editable area, parser, serializer
- `Dialogs/` - modal dialogs (link, image)
- `Plugins/` - plugin utility modules

Each folder has an `index.ts` barrel export.

---

## Testing in Depth

### Maintainer vs consumer validation

`playground/` is the maintainer-facing local sandbox.
`examples/react-demo` and `examples/nextjs-demo` are npm-consumer demos.

Keep this boundary in place:

- Playground supports local-first development workflow.
- Examples must keep `rich-text-editor-ndevu` as a semver npm dependency (no `link:` or `file:`).

Before opening a PR, run:

```bash
# Consumer policy gate (examples only)
yarn verify:demos

# Maintainer/local playground validation
yarn --cwd playground install
yarn --cwd playground build

# npm-consumer example validation
yarn --cwd examples/react-demo install
yarn --cwd examples/react-demo build
yarn --cwd examples/nextjs-demo install
yarn --cwd examples/nextjs-demo build
```

### Test File Organization

```
tests/
├── setup.ts                        # jest-dom matchers for Vitest
├── unit/
│   ├── components/
│   │   ├── Editor.test.tsx         # RichTextEditor component tests
│   │   └── Toolbar.test.tsx        # Toolbar keyboard nav, ARIA tests
│   ├── core/
│   │   ├── commands.test.ts        # All 17 editor commands
│   │   └── engine.test.ts          # createEditor factory, options
│   ├── hooks/
│   │   └── useEditor.test.ts       # Hook lifecycle, prop sync
│   └── utils/
│       └── dom.test.ts             # sanitizeHTML, DOM helpers
└── e2e/
    ├── playwright.config.ts
    ├── editor.spec.ts
    ├── toolbar.spec.ts
    └── themes.spec.ts
```

### Testing Patterns

**Component tests** use React Testing Library:
```ts
render(<RichTextEditor value="<p>Hello</p>" />);
expect(screen.getByRole('textbox')).toBeInTheDocument();
```

**Command tests** use a real Tiptap editor instance:
```ts
const editor = createEditor({ content: '<p>Hello</p>' });
toggleBold(editor);
expect(editor.isActive('bold')).toBe(true);
editor.destroy();
```

**Hook tests** use `renderHook` from React Testing Library.

### Toolbar refactor checklist

When touching toolbar internals (`src/types/toolbar.types.ts`, `src/utils/toolbar/*`, `src/hooks/useToolbar.ts`, toolbar UI/CSS), verify both compatibility and dynamic behavior:

1. Legacy input still works: `ToolbarItem[]` with `'|'` separators
2. Rich input works: object items with resolver functions
3. Separator compaction holds: no leading/trailing/consecutive separators after resolution
4. Adaptive rendering remains usable for icon-only and label-driven buttons
5. Undo/redo disabled state remains accurate with current editor history

Run focused suites first:

```bash
yarn test tests/unit/hooks/useToolbar.test.ts tests/unit/components/Toolbar.test.tsx
```

Then run the full quality gates:

```bash
yarn typecheck
yarn test
yarn build
```

### Coverage Thresholds

Config in `config/vitest.config.ts`:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

---

## Extension Development

If you're adding a new Tiptap extension to the editor:

1. **Create the extension** in `src/components/Plugins/`
2. **Register it** in `src/core/schema.ts` (`createExtensions()`)
3. **Add toolbar support** through the new toolbar pipeline:
   - update `ToolbarItemType` in `src/types/toolbar.types.ts`
   - register defaults in `src/constants/builtins.ts`
   - wire command action in `src/helpers/actions.ts`
   - wire active-state detection in `src/helpers/activeState.ts`
4. **Export utilities** from `src/index.ts`
5. **Write tests** in `tests/unit/` (include toolbar + hook coverage when relevant)
6. **Update docs** in `docs/plugins.md` and `docs/api.md` if public toolbar types change

See [plugins.md](./plugins.md) for a complete walkthrough with examples.
