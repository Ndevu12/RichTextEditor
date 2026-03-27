# API Reference

Complete API documentation for `rich-text-editor-ndevu`.

---

## Table of Contents

- [RichTextEditor Component](#richtexteditor-component)
- [Hooks](#hooks)
  - [useEditor](#useeditor)
  - [useHistory](#usehistory)
  - [useToolbar](#usetoolbar)
- [Core Utilities](#core-utilities)
  - [createEditor](#createeditor)
  - [Commands](#commands)
  - [Model Utilities](#model-utilities)
- [Types](#types)
- [Constants](#constants)
- [Toolbar Item Reference](#toolbar-item-reference)
- [Toolbar Migration](#toolbar-migration)

---

## RichTextEditor Component

The main component. Drop it in and go.

```tsx
import { RichTextEditor } from 'rich-text-editor-ndevu';
import 'rich-text-editor-ndevu/styles';

function App() {
  const [html, setHtml] = useState('');

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      theme="light"
    />
  );
}
```

### Props — `RichTextEditorProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Controlled HTML content |
| `onChange` | `(value: string) => void` | — | Called when content changes |
| `placeholder` | `string` | `'Write something...'` | Placeholder text when editor is empty |
| `readOnly` | `boolean` | `false` | Disable editing (hides toolbar) |
| `toolbar` | `ToolbarInput` | `DEFAULT_TOOLBAR` | Toolbar items to display (legacy string array or rich object input) |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme |
| `minHeight` | `string \| number` | `'200px'` | Minimum editor height |
| `maxHeight` | `string \| number` | — | Maximum editor height (enables scrolling) |
| `className` | `string` | — | Additional CSS class for the outer wrapper |
| `style` | `React.CSSProperties` | — | Inline styles for the outer wrapper |
| `ariaLabel` | `string` | `'Rich text editor'` | Accessible label for the editor content area |
| `onFocus` | `() => void` | — | Called when editor gains focus |
| `onBlur` | `() => void` | — | Called when editor loses focus |

---

## Hooks

### `useEditor`

Primary hook — manages the Tiptap editor lifecycle and bridges it with the Zustand store. Used internally by `EditorProvider`, but available for advanced usage.

```ts
import { useEditor } from 'rich-text-editor-ndevu';
import type { UseEditorOptions } from 'rich-text-editor-ndevu';
```

#### Options — `UseEditorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Initial / controlled HTML content |
| `onChange` | `(html: string) => void` | — | Called when content changes |
| `placeholder` | `string` | — | Placeholder text |
| `readOnly` | `boolean` | `false` | Disable editing |
| `ariaLabel` | `string` | — | Accessible label |
| `onFocus` | `() => void` | — | Focus callback |
| `onBlur` | `() => void` | — | Blur callback |

#### Returns

`Editor | null` — The Tiptap editor instance, or `null` before initialization.

#### Example

```ts
const editor = useEditor({
  value: '<p>Hello</p>',
  onChange: (html) => console.log(html),
});
```

---

### `useHistory`

Lightweight hook for undo/redo state and actions.

```ts
import { useHistory } from 'rich-text-editor-ndevu';
import type { UseHistoryResult } from 'rich-text-editor-ndevu';
```

#### Returns — `UseHistoryResult`

| Property | Type | Description |
|----------|------|-------------|
| `undo` | `() => void` | Execute undo |
| `redo` | `() => void` | Execute redo |
| `canUndo` | `boolean` | Whether undo is available |
| `canRedo` | `boolean` | Whether redo is available |

#### Example

```tsx
function UndoRedoButtons() {
  const { undo, redo, canUndo, canRedo } = useHistory();

  return (
    <>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </>
  );
}
```

---

### `useToolbar`

Resolves `ToolbarInput` (legacy or rich) into fully configured `ToolbarButtonConfig` objects with actions, active states, icons, and shortcuts.

```ts
import { useToolbar } from 'rich-text-editor-ndevu';
import type { UseToolbarResult } from 'rich-text-editor-ndevu';
```

#### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `items` | `ToolbarInput` | Legacy `ToolbarItem[]` or rich toolbar object input |

#### Returns — `UseToolbarResult`

| Property | Type | Description |
|----------|------|-------------|
| `items` | `(ToolbarButtonConfig \| '\|')[]` | Resolved toolbar button configs and separators |

#### Example

```tsx
const { items } = useToolbar(['bold', 'italic', '|', 'link']);
// items[0] = { id: 'bold', label: 'Bold', icon: <B/>, action: fn, isActive: true, ... }
```

---

## Core Utilities

### `createEditor`

Factory function that creates a headless Tiptap Editor instance. For advanced use cases where you need direct editor control without `RichTextEditor` component.

```ts
import { createEditor } from 'rich-text-editor-ndevu';
import type { CreateEditorOptions } from 'rich-text-editor-ndevu';
```

#### Options — `CreateEditorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | `''` | Initial HTML content |
| `editable` | `boolean` | `true` | Whether the editor is editable |
| `placeholder` | `string` | — | Placeholder text |
| `ariaLabel` | `string` | `'Rich text editor'` | Accessible label |
| `onUpdate` | `(html: string) => void` | — | Content change callback |
| `onSelectionUpdate` | `() => void` | — | Selection change callback |
| `onFocus` | `() => void` | — | Focus callback |
| `onBlur` | `() => void` | — | Blur callback |

#### Returns

`Editor` — A Tiptap Editor instance.

---

### Commands

All commands take an `Editor` instance and return `boolean` (success/failure). They call `editor.chain().focus().*().run()` internally.

```ts
import {
  toggleBold, toggleItalic, toggleUnderline, toggleStrike,
  setHeading, toggleBulletList, toggleOrderedList,
  sinkListItem, liftListItem,
  toggleBlockquote, toggleCode, toggleCodeBlock,
  insertLink, removeLink, insertImage,
  undo, redo,
} from 'rich-text-editor-ndevu';
```

| Command | Signature | Description |
|---------|-----------|-------------|
| `toggleBold` | `(editor: Editor) => boolean` | Toggle bold formatting |
| `toggleItalic` | `(editor: Editor) => boolean` | Toggle italic formatting |
| `toggleUnderline` | `(editor: Editor) => boolean` | Toggle underline formatting |
| `toggleStrike` | `(editor: Editor) => boolean` | Toggle strikethrough formatting |
| `setHeading` | `(editor: Editor, level: 1-6) => boolean` | Toggle heading level |
| `toggleBulletList` | `(editor: Editor) => boolean` | Toggle bullet list |
| `toggleOrderedList` | `(editor: Editor) => boolean` | Toggle ordered list |
| `sinkListItem` | `(editor: Editor) => boolean` | Increase list indent |
| `liftListItem` | `(editor: Editor) => boolean` | Decrease list indent |
| `toggleBlockquote` | `(editor: Editor) => boolean` | Toggle blockquote |
| `toggleCode` | `(editor: Editor) => boolean` | Toggle inline code |
| `toggleCodeBlock` | `(editor: Editor) => boolean` | Toggle code block |
| `insertLink` | `(editor: Editor, href: string, text?: string) => boolean` | Insert or set link |
| `removeLink` | `(editor: Editor) => boolean` | Remove link from selection |
| `insertImage` | `(editor: Editor, src: string, alt?: string) => boolean` | Insert image |
| `undo` | `(editor: Editor) => boolean` | Undo last action |
| `redo` | `(editor: Editor) => boolean` | Redo last undone action |

---

### Model Utilities

```ts
import { toHTML, fromHTML, createEmptyDoc, isContentEmpty } from 'rich-text-editor-ndevu';
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `toHTML` | `(doc: JSONContent) => string` | Convert Tiptap JSON document to HTML string |
| `fromHTML` | `(html: string) => Record<string, unknown>` | Convert HTML string to Tiptap JSON document |
| `createEmptyDoc` | `() => string` | Returns `'<p></p>'` |
| `isContentEmpty` | `(html: string) => boolean` | Check if HTML content is effectively empty |

---

## Types

All types are importable:

```ts
import type {
  RichTextEditorProps,
  Theme,
  DialogType,
  EditorState,
  EditorActions,
  EditorConfig,
  ToolbarItemType,
  ToolbarSeparator,
  ToolbarItem,
  ToolbarInput,
  ToolbarButtonConfig,
  ToolbarGroupConfig,
  LegacyToolbarInput,
  RichToolbarInput,
  RichToolbarItemInput,
  RichToolbarButtonInput,
  RichToolbarSeparatorInput,
  ToolbarResolverContext,
  ToolbarValueResolver,
  ToolbarRenderItem,
  ToolbarRenderButtonItem,
  ToolbarRenderSeparatorItem,
  PluginConfig,
  PluginRegistry,
  UseEditorOptions,
  UseHistoryResult,
  UseToolbarResult,
  CreateEditorOptions,
  EditorStore,
} from 'rich-text-editor-ndevu';
```

### Key Types

| Type | Description |
|------|-------------|
| `Theme` | `'light' \| 'dark'` |
| `ToolbarItemType` | Union of all toolbar button identifiers (`'bold' \| 'italic' \| ... \| 'redo'`) |
| `ToolbarSeparator` | `'\|'` — visual separator between toolbar groups |
| `ToolbarItem` | `ToolbarItemType \| ToolbarSeparator` |
| `LegacyToolbarInput` | Alias for `ToolbarItem[]` (kept for backward compatibility) |
| `ToolbarInput` | `LegacyToolbarInput \| RichToolbarInput` |
| `RichToolbarButtonInput` | Object-based toolbar button with optional resolver hooks for `label`, `icon`, `isVisible`, `isDisabled`, `isActive`, and `onClick` |
| `RichToolbarSeparatorInput` | Object separator entry (`{ type: 'separator', id?: string }`) |
| `ToolbarButtonConfig` | Full button configuration: `{ id, label, icon, action, isActive, isDisabled, shortcut? }` |
| `DialogType` | `'link' \| 'image'` |
| `EditorState` | Internal store state (content, theme, readOnly, activeMarks, etc.) |
| `PluginConfig` | Plugin definition: `{ name, extensions, toolbarItems?, keyboardShortcuts? }` |

---

## Constants

```ts
import { DEFAULT_TOOLBAR } from 'rich-text-editor-ndevu';
```

**`DEFAULT_TOOLBAR`** — The default toolbar item order:

```ts
['bold', 'italic', 'underline', 'strike', '|',
 'heading1', 'heading2', 'heading3', '|',
 'bulletList', 'orderedList', 'blockquote', '|',
 'code', 'codeBlock', '|',
 'link', 'image', '|',
 'undo', 'redo']
```

---

## Toolbar Item Reference

| ID | Label | Shortcut | Icon | Description |
|----|-------|----------|------|-------------|
| `bold` | Bold | Ctrl+B / ⌘B | **B** | Toggle bold |
| `italic` | Italic | Ctrl+I / ⌘I | *I* | Toggle italic |
| `underline` | Underline | Ctrl+U / ⌘U | U̲ | Toggle underline |
| `strike` | Strikethrough | Ctrl+Shift+S / ⌘Shift+S | ~~S~~ | Toggle strikethrough |
| `heading1` | Heading 1 | — | H1 | Toggle H1 |
| `heading2` | Heading 2 | — | H2 | Toggle H2 |
| `heading3` | Heading 3 | — | H3 | Toggle H3 |
| `heading4` | Heading 4 | — | H4 | Toggle H4 |
| `heading5` | Heading 5 | — | H5 | Toggle H5 |
| `heading6` | Heading 6 | — | H6 | Toggle H6 |
| `bulletList` | Bullet List | — | • | Toggle unordered list |
| `orderedList` | Ordered List | — | 1. | Toggle ordered list |
| `blockquote` | Blockquote | — | ❝ | Toggle blockquote |
| `code` | Inline Code | — | `<>` | Toggle inline code |
| `codeBlock` | Code Block | — | `[<>]` | Toggle code block |
| `link` | Link | — | 🔗 | Open link dialog |
| `image` | Image | — | 🖼 | Open image dialog |
| `undo` | Undo | Ctrl+Z / ⌘Z | ↩ | Undo last action |
| `redo` | Redo | Ctrl+Y / ⌘Shift+Z | ↪ | Redo last undone action |

---

## Toolbar Migration

The toolbar API is **non-breaking**. Existing `ToolbarItem[]` arrays still work:

```tsx
<RichTextEditor toolbar={['bold', 'italic', '|', 'link']} />
```

You can now opt into richer object configuration without changing existing behavior:

```tsx
<RichTextEditor
  toolbar={[
    { id: 'bold' },
    { id: 'italic', label: 'Emphasis' },
    { type: 'separator' },
    {
      id: 'undo',
      isDisabled: ({ readOnly }) => readOnly,
      label: ({ readOnly }) => (readOnly ? 'Undo (disabled)' : 'Undo'),
    },
  ]}
/>
```

### Compatibility Notes

- Legacy separator strings (`'|'`) and object separators (`{ type: 'separator' }`) are both supported.
- Built-in item IDs (`ToolbarItemType`) preserve their default actions and active-state behavior.
- Resolver fields (`label`, `icon`, `shortcut`, `isVisible`, `isDisabled`, `isActive`) can be static values or functions receiving `ToolbarResolverContext`.
- `onClick` lets you override a built-in button action while keeping the same ID and render behavior.
