// ── Public API ───────────────────────────────

// Main component
export { RichTextEditor } from './components/Editor';

// Types
export type {
  RichTextEditorProps,
  Theme,
  DialogType,
  EditorState,
  EditorActions,
  EditorConfig,
} from './types';
export type {
  ToolbarItemType,
  ToolbarSeparator,
  ToolbarItem,
  ToolbarButtonConfig,
  ToolbarGroupConfig,
} from './types';
export { DEFAULT_TOOLBAR } from './types';

// Hooks (advanced usage)
export { useEditor } from './hooks';
export type { UseEditorOptions } from './hooks';
export { useToolbar } from './hooks';
export type { UseToolbarResult } from './hooks';
export { useHistory } from './hooks';
export type { UseHistoryResult } from './hooks';

// Core utilities (advanced usage)
export { useEditorStore } from './core';
export type { EditorStore } from './core';
export { createEditor, createExtensions } from './core';
export type { CreateEditorOptions } from './core';
export {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  setHeading,
  toggleBulletList,
  toggleOrderedList,
  toggleBlockquote,
  toggleCode,
  toggleCodeBlock,
  insertLink,
  removeLink,
  insertImage,
  undo,
  redo,
} from './core';
export { toHTML, fromHTML, createEmptyDoc, isContentEmpty } from './core';
