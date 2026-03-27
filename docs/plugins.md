# Plugins

Guide to the plugin system and how to extend the editor.

---

## How Plugins Work

Under the hood, `rich-text-editor-ndevu` uses [Tiptap](https://tiptap.dev/) extensions. Each "plugin" maps to one or more Tiptap extensions that add nodes, marks, or functionality to the editor.

All extensions are assembled in `createExtensions()` (`src/core/schema.ts`) and passed to the Tiptap `Editor` constructor.

---

## Built-in Plugins

### Text Formatting (via StarterKit)

**Extensions:** Bold, Italic, Strike (from `@tiptap/starter-kit`), Underline (`@tiptap/extension-underline`)

| Mark | Keyboard Shortcut | HTML Output |
|------|-------------------|-------------|
| Bold | Ctrl+B / ⌘B | `<strong>text</strong>` |
| Italic | Ctrl+I / ⌘I | `<em>text</em>` |
| Underline | Ctrl+U / ⌘U | `<u>text</u>` |
| Strikethrough | Ctrl+Shift+S / ⌘Shift+S | `<s>text</s>` |
| Inline Code | — | `<code>text</code>` |

### Headings (via StarterKit)

Supports heading levels 1–6. Toggle headings via the toolbar or programmatically:

```ts
import { setHeading } from 'rich-text-editor-ndevu';
setHeading(editor, 2); // Toggle H2
```

### Lists (via StarterKit)

- **Bullet List** → `<ul><li>...</li></ul>`
- **Ordered List** → `<ol><li>...</li></ol>`
- **Sink / Lift** — Nested list indentation via `sinkListItem` and `liftListItem` commands

### Blockquote (via StarterKit)

Wraps selected content in `<blockquote>`.

### Links

**Extension:** `@tiptap/extension-link`

Configuration:
- `openOnClick: false` — Links don't open when clicking in the editor
- `autolink: true` — Automatically converts typed URLs to links
- `linkOnPaste: true` — Pasted URLs become links
- Links open in new tab (`target="_blank"`) with `rel="noopener noreferrer nofollow"`

Programmatic usage:

```ts
import { insertLink, removeLink } from 'rich-text-editor-ndevu';
insertLink(editor, 'https://example.com', 'Example');
removeLink(editor);
```

The editor also provides a **LinkDialog** component that opens when the Link toolbar button is clicked.

### Images

**Extension:** `@tiptap/extension-image`

Configuration:
- Block-level images (`inline: false`)
- Base64 data URIs allowed (`allowBase64: true`)
- Lazy loading (`loading="lazy"`)

Utilities:

```ts
import { insertImageByUrl, insertImageBase64, readFileAsBase64 } from 'rich-text-editor-ndevu';

// Insert by URL
insertImageByUrl(editor, 'https://example.com/photo.jpg', 'alt text');

// Insert by file (base64)
const file = /* File from input */;
const base64 = await readFileAsBase64(file);
insertImageBase64(editor, base64);
```

The **ImageDialog** supports both URL entry and drag-and-drop file upload with preview.

### Code Blocks

**Extension:** `@tiptap/extension-code-block-lowlight` (replaces StarterKit's basic code block)

Features:
- Syntax highlighting via [lowlight](https://github.com/wooorm/lowlight) (highlight.js common bundle)
- Supported languages: JavaScript, TypeScript, Python, HTML, CSS, JSON, Bash, XML, Markdown, SQL, YAML, C, C++, Java, Go, Rust, Ruby, PHP, and more

Utilities:

```ts
import { getCodeBlockLanguage, setCodeBlockLanguage, SUPPORTED_LANGUAGES } from 'rich-text-editor-ndevu';

const lang = getCodeBlockLanguage(editor);
setCodeBlockLanguage(editor, 'typescript');
console.log(SUPPORTED_LANGUAGES); // ['javascript', 'typescript', ...]
```

### History (Undo / Redo)

**Extension:** StarterKit's built-in history (ProseMirror history plugin)

Configuration:
- **History depth:** 100 steps
- **New group delay:** 500ms (groups rapid changes into single undo steps)

```ts
import { undo, redo, canUndo, canRedo } from 'rich-text-editor-ndevu';

if (canUndo(editor)) undo(editor);
if (canRedo(editor)) redo(editor);
```

---

## Creating a Custom Plugin

To add a new capability to the editor, follow these steps:

### Step 1: Create a Tiptap Extension

```ts
import { Mark } from '@tiptap/core';

const Highlight = Mark.create({
  name: 'highlight',

  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: (el) => el.getAttribute('data-color') || 'yellow',
        renderHTML: (attrs) => ({ 'data-color': attrs.color, style: `background-color: ${attrs.color}` }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'mark' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.commands.toggleMark(this.name),
    };
  },
});
```

### Step 2: Register in `createExtensions()`

Add your extension to the array in `src/core/schema.ts`:

```ts
export function createExtensions(): Extensions {
  return [
    StarterKit.configure({ /* ... */ }),
    Underline,
    Link.configure({ /* ... */ }),
    Image.configure({ /* ... */ }),
    CodeBlockLowlight.configure({ /* ... */ }),
    Highlight,  // ← Add here
  ];
}
```

### Step 3: Add Toolbar Items

Toolbar resolution has moved to a registry + pipeline, and remains backward-compatible with legacy `ToolbarItem[]`.

If your extension needs a built-in toolbar ID:

1. Add an entry to the `ToolbarItemType` union in `src/types/toolbar.types.ts`.
2. Add label/shortcut/icon defaults in `BUILTIN_TOOLBAR_REGISTRY` at `src/constants/builtins.ts`.
3. Add command dispatch in `getBuiltinAction()` at `src/helpers/actions.ts`.
4. Add active-state detection in `isBuiltinItemActive()` at `src/helpers/activeState.ts`.
5. Ensure behavior resolves correctly through `normalizeToolbarInput()` and `resolveToolbarItems()`.

Consumer-facing toolbar inputs now support both:

- Legacy arrays (`['bold', 'italic', '|', 'link']`)
- Rich object input (`ToolbarInput`) with dynamic resolvers (`label`, `icon`, `isVisible`, `isDisabled`, `isActive`, `onClick`)

Use this to tune how built-in buttons render and behave without breaking existing integrations.

### Step 4: Add Keyboard Shortcuts

Keyboard shortcuts are best defined directly in the Tiptap extension via `addKeyboardShortcuts()`. They'll work automatically once the extension is registered.

---

## Plugin Architecture (PluginConfig)

The codebase defines a `PluginConfig` interface for future plugin registration:

```ts
interface PluginConfig {
  name: string;
  extensions: (Extension | Mark | Node)[];
  toolbarItems?: ToolbarItemType[];
  keyboardShortcuts?: Record<string, () => boolean>;
}
```

This is designed for a future plugin registry system. Currently, extensions are statically assembled in `createExtensions()`.
