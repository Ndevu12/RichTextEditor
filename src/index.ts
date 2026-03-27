/**
 * rich-text-editor-ndevu — Public API
 *
 * This is the single entry point consumers see when they
 * `import from 'rich-text-editor-ndevu'`.
 *
 * @packageDocumentation
 */

// ── Styles (bundled to dist/index.css by tsup) ─────────────────────
import './styles/index.css';

// ── Main Component ─────────────────────────────────────────────────
export { RichTextEditor } from './components/Editor';

// ── Types ──────────────────────────────────────────────────────────
export type {
  RichTextEditorProps,
  Theme,
  DialogType,
  PreviewMode,
  EditorState,
  EditorActions,
  EditorConfig,
} from './types';
export type {
  ToolbarItemType,
  ToolbarSeparator,
  ToolbarItem,
  LegacyToolbarInput,
  ToolbarResolverContext,
  ToolbarValueResolver,
  RichToolbarButtonInput,
  RichToolbarSeparatorInput,
  RichToolbarItemInput,
  RichToolbarInput,
  ToolbarInput,
  NormalizedToolbarButtonItem,
  NormalizedToolbarSeparatorItem,
  NormalizedToolbarItem,
  ToolbarRenderButtonItem,
  ToolbarRenderSeparatorItem,
  ToolbarRenderItem,
  ToolbarButtonConfig,
  ToolbarGroupConfig,
} from './types';
export type { PluginConfig, PluginRegistry } from './types';

// ── Constants ──────────────────────────────────────────────────────
export { DEFAULT_TOOLBAR } from './types';

// ── Hooks ──────────────────────────────────────────────────────────
export { useEditor } from './hooks';
export type { UseEditorOptions } from './hooks';
export { useToolbar } from './hooks';
export type { UseToolbarResult } from './hooks';
export { useHistory } from './hooks';
export type { UseHistoryResult } from './hooks';

// ── Core / Headless (advanced usage) ───────────────────────────────
export { useEditorStore } from './core';
export type { EditorStore } from './core';
export { createEditor, createExtensions, createPluginRegistry, lowlight } from './core';
export type { CreateEditorOptions } from './core';

// ── Commands ───────────────────────────────────────────────────────
export {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  setHeading,
  toggleBulletList,
  toggleOrderedList,
  sinkListItem,
  liftListItem,
  toggleBlockquote,
  toggleCode,
  toggleCodeBlock,
  insertLink,
  removeLink,
  insertImage,
  undo,
  redo,
} from './core';

// ── Content Helpers ────────────────────────────────────────────────
export { toHTML, fromHTML, createEmptyDoc, isContentEmpty } from './core';
export { toMarkdown } from './components/Content';

// ── Preview Components ────────────────────────────────────────────
export { PreviewPanel, PreviewToggle } from './components/Preview';
export type { PreviewPanelProps } from './components/Preview';

// ── Plugin Utilities ───────────────────────────────────────────────
export {
  insertImageByUrl,
  insertImageBase64,
  readFileAsBase64,
  openImageDialog,
  MAX_IMAGE_SIZE,
} from './components/Plugins/ImagePlugin';

export {
  getCodeBlockLanguage,
  setCodeBlockLanguage,
  SUPPORTED_LANGUAGES,
} from './components/Plugins/CodeBlockPlugin';

export { CodeBlockLanguageSelector } from './components/Plugins/CodeBlockLanguageSelector';
export type { CodeBlockLanguageSelectorProps } from './components/Plugins/CodeBlockLanguageSelector';

export {
  canUndo,
  canRedo,
  HISTORY_DEPTH,
  HISTORY_NEW_GROUP_DELAY,
} from './components/Plugins/HistoryPlugin';

// ── DOM & String Utilities ─────────────────────────────────────────
export {
  sanitizeHTML,
  getSelectionRect,
  focusFirstFocusable,
  trapFocus,
  isElementVisible,
  isValidURL,
  escapeHTML,
  truncate,
  isMac,
  formatShortcut,
} from './utils';
