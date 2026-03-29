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

---

## GitHub Pages adopters

The [documentation hub](https://ndevu12.github.io/RichTextEditor/) (`index.html` under [.github/pages/](../.github/pages/)) includes a **Trusted by** block for organizations or products that use this library in a shipped production surface or a substantial public demo. Extended prose lives here in `docs/`; the hub page is assembled into `_site` by [.github/workflows/deploy.yml](../.github/workflows/deploy.yml).

### Eligibility

- **In scope:** A company, product, or open-source project that **actually uses** `rich-text-editor-ndevu` (this package) in user-facing software you control, not merely an intent to adopt.
- **Representation:** By opening a pull request you confirm you have the right to use the logo and URL you submit. The listing is **informational** and does not imply the maintainers endorse your product.
- **Out of scope:** Generic “built with React” sites with no editor dependency, affiliate listings, or entries whose primary goal is SEO rather than accurate attribution. Maintainers may decline or remove listings that are misleading or stale.

### Assets

- **Source file:** Add the logo to [`src/assets/`](../src/assets/) (PNG or SVG with transparency is ideal). Use a descriptive filename; avoid spaces.
- **Published path:** The workflow copies assets into `_site/assets/` with a **lowercase, URL-stable** name (for example, `src/assets/GEOFINDA-bgless-logo.png` is copied to `_site/assets/geofinda-logo.png`). Add a `cp` line in the “Assemble deployment directory” step in `deploy.yml` alongside the existing copies.
- **Markup:** In `.github/pages/index.html`, append a new `<li>` inside the `#adopters` list: an `<a href="https://…">` with `rel="noopener noreferrer"`, a visible name (for example `<span class="adopter-name">…</span>`), and an `<img>` pointing at `./assets/your-file.png` with explicit `width` and `height`, `loading="lazy"`, and `decoding="async"`.

### Pull request checklist

When adding or updating an adopter entry, verify the following before requesting review:

1. Logo file is committed under `src/assets/` and the **license or trademark** situation is clear (your own mark or explicit permission).
2. `.github/workflows/deploy.yml` copies the new asset into `_site/assets/` with a stable filename that matches `index.html`.
3. `.github/pages/index.html` includes the new list item: HTTPS homepage, accessible link text (see below), and dimensions on the image to limit layout shift.
4. **Social previews:** If maintainers use a single `og:image` / `twitter:image` for the hub, coordinate any change to that image and its **alt** metadata in `<head>` so link previews stay accurate and accessible; do not swap global preview metadata casually when only adding a secondary logo in the body.

### Alternative text and link purpose

- **Inline logo beside visible name:** Treat the image as **decorative**: use `alt=""` on the `<img>` so assistive technology does not hear the link twice. The **same** `<a>` must include visible text (for example the organization name) so the link has a clear purpose in and out of context.
- **Standalone or iconic image:** If the logo is the only label inside the link, set **non-empty** `alt` text that names the organization and indicates it uses or ships the editor (for example, “Acme — Trusted by / adopter logo”).
- **Open Graph and Twitter:** For `og:image` and `twitter:image`, always set **paired** `og:image:alt` and `twitter:image:alt` (and Twitter `image:alt`) so preview cards are described when the image is shown or when platforms surface alt text.

These rules align with WCAG 2.2 expectations for meaningful link names, redundant-image avoidance, and non-text contrast where the logo is part of the visible UI.
