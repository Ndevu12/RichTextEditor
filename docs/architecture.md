# Architecture

This document explains the internal architecture of `rich-text-editor-ndevu`.

---

## Component Hierarchy

```
RichTextEditor (public API)
├── EditorProvider (Zustand store + Tiptap lifecycle)
│   └── EditorWrapper (composition layer)
│       ├── Toolbar (roving tabindex, grouped buttons)
│       │   ├── ToolbarGroup (visual grouping)
│       │   │   ├── ToolbarButton (icon, action, active state)
│       │   │   └── ToolbarSeparator (visual divider)
│       │   └── ...
│       ├── ContentEditable (Tiptap EditorContent + size constraints)
│       ├── LinkDialog (modal for link insertion)
│       └── ImageDialog (modal for image insertion)
```

---

## Data Flow

```
Props (value, onChange, theme, readOnly, toolbar)
  │
  ▼
EditorProvider
  ├─ Creates Tiptap Editor via createEditor()
  ├─ Initializes Zustand store (useEditorStore)
  └─ Syncs props → store on change
        │
        ▼
  Zustand Store (EditorState + EditorActions)
  ├─ editor: Editor | null
  ├─ content, theme, readOnly, isFocused
  ├─ activeMarks, activeNodes, headingLevel
  └─ openDialog
        │
        ▼
  EditorWrapper reads store via hooks
  ├─ useToolbar(toolbar) → resolved ToolbarButtonConfig[]
  │     └─ Toolbar renders buttons with isActive/isDisabled states
  ├─ ContentEditable renders <EditorContent editor={editor} />
  └─ Dialogs appear when openDialog !== null
        │
        ▼
  User types / clicks toolbar
  ├─ Commands execute on Tiptap editor (commands.ts)
  ├─ Tiptap fires onUpdate → store.setContent → props.onChange
  └─ Tiptap fires onSelectionUpdate → refreshActiveState → store update → re-render
```

### Key Principles

1. **Controlled component pattern** — `value` flows down, `onChange` flows up.
2. **Single source of truth** — Zustand store holds all editor state; React components are pure consumers.
3. **Tiptap commands are imperative** — `commands.ts` wraps `editor.chain().focus().*().run()` patterns.
4. **Toolbar is declarative** — Pass `ToolbarItem[]` strings, `useToolbar` resolves them to full button configs.

---

## Extension System

The editor uses [Tiptap v3](https://tiptap.dev/) under the hood. All formatting capabilities come from Tiptap extensions assembled in `createExtensions()` (`src/core/schema.ts`):

| Extension | Source | Purpose |
|-----------|--------|---------|
| **StarterKit** | `@tiptap/starter-kit` | Bold, italic, strike, headings, lists, blockquote, code, history, hard break, horizontal rule |
| **Underline** | `@tiptap/extension-underline` | Underline formatting (not in StarterKit) |
| **Link** | `@tiptap/extension-link` | Hyperlinks with autolink and paste-link |
| **Image** | `@tiptap/extension-image` | Block-level images with base64 support |
| **CodeBlockLowlight** | `@tiptap/extension-code-block-lowlight` | Syntax-highlighted code blocks via highlight.js |

To add a new node or mark, create a Tiptap extension and register it in `createExtensions()`.

---

## Directory Structure

```
src/
├── index.ts              # Public API barrel export
├── assets/               # Static assets (icons, etc.)
├── components/
│   ├── Content/          # ContentEditable, Parser, Serializer
│   ├── Dialogs/          # LinkDialog, ImageDialog
│   ├── Editor/           # RichTextEditor, EditorProvider, EditorWrapper
│   ├── Plugins/          # CodeBlockPlugin, HistoryPlugin, ImagePlugin, LinkPlugin, ListsPlugin
│   └── Toolbar/          # Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator
├── core/
│   ├── commands.ts       # Imperative editor commands (toggleBold, insertLink, etc.)
│   ├── engine.ts         # createEditor() factory
│   ├── model.ts          # HTML ↔ JSON conversion utilities
│   ├── schema.ts         # Tiptap extension stack assembly
│   └── store.ts          # Zustand store (useEditorStore)
├── hooks/
│   ├── useEditor.ts      # Editor lifecycle & prop sync
│   ├── useHistory.ts     # Undo/redo state
│   └── useToolbar.ts     # Toolbar item resolution
├── styles/
│   ├── index.css         # Master stylesheet entry
│   ├── editor.css        # Editor wrapper & prose typography
│   ├── toolbar.css       # Toolbar layout & button styles
│   ├── dialog.css        # Dialog modal styles
│   ├── highlight.css     # Code block syntax highlighting
│   ├── theme-light.css   # Light theme CSS custom properties
│   └── theme-dark.css    # Dark theme CSS custom properties
├── types/
│   ├── editor.types.ts   # Editor props, state, config types
│   ├── toolbar.types.ts  # Toolbar item types, button config, DEFAULT_TOOLBAR
│   └── plugin.types.ts   # Plugin config & registry interfaces
└── utils/
    ├── dom.ts            # DOM utilities (sanitize, focus trap, selection)
    └── string.ts         # String utilities (URL validation, escape, shortcuts)
```

### Rationale

- **`core/`** is framework-agnostic — only pure TypeScript + Tiptap, no React imports.
- **`hooks/`** bridges core ↔ React. Each hook has a single, well-scoped purpose.
- **`components/`** are React components grouped by feature domain.
- **`styles/`** uses plain CSS with CSS custom properties (no CSS-in-JS dependency).
- **`types/`** provides centralized type definitions imported across the project.

---

## CSS Theming Strategy

Themes are implemented via **CSS custom properties** scoped under a `data-theme` attribute on the editor wrapper element:

```html
<div class="rte-editor" data-theme="light">
  <!-- toolbar + content -->
</div>
```

- `theme-light.css` defines `[data-theme='light'] { --rte-*: ...; }`
- `theme-dark.css` defines `[data-theme='dark'] { --rte-*: ...; }`
- All component styles reference `var(--rte-*)` tokens
- To create a custom theme, override the same `--rte-*` properties under your own selector

This approach keeps theming zero-JS (purely CSS) and allows runtime theme switching by changing the `theme` prop.

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| **Tiptap v3** | ProseMirror-based, headless, React-ready, extensible with a huge ecosystem. Avoids reinventing contenteditable handling. |
| **Zustand** | Minimal (< 1KB), no providers needed, works with Tiptap's imperative API. Simpler than Redux or Jotai for this use case. |
| **CSS custom properties** | No build-time CSS-in-JS dependency, works with SSR, supports runtime theme switching, zero overhead. |
| **tsup** | Fast ESM + CJS dual builds with DTS generation. Simpler config than Rollup for a library. |
| **Yarn 4 (Berry)** | Better monorepo support, PnP for faster installs, built-in workspace protocol. |
| **Vitest** | Same Vite-based transform pipeline, native ESM, faster than Jest for TS projects. |
| **BEM-like `.rte-*` classes** | Predictable, low-specificity selectors consumers can override. No hashing or scoping complexity. |
