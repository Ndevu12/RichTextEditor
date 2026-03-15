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
3. **Add toolbar support** in `src/hooks/useToolbar.ts` (meta, action, active state)
4. **Add the toolbar ID** to `ToolbarItemType` in `src/types/toolbar.types.ts`
5. **Export utilities** from `src/index.ts`
6. **Write tests** in `tests/unit/`
7. **Update docs** in `docs/plugins.md`

See [plugins.md](./plugins.md) for a complete walkthrough with examples.
