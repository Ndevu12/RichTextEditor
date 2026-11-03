/**
 * rich-text-editor-ndevu — Public API
 *
 * This is the single entry point consumers see when they
 * `import from 'rich-text-editor-ndevu'`.
 *
 * @packageDocumentation
 */

import { createElement, type ComponentProps, type ReactElement } from 'react';
import type { Editor } from '@tiptap/core';
import './styles/index.css';

import { RichTextEditor } from './components/Editor';
import { toMarkdown } from './components/Content';
import { PreviewPanel, PreviewToggle } from './components/Preview';
import type { PreviewPanelProps } from './components/Preview';
import {
  insertImageByUrl as insertImageByUrlImpl,
  insertImageBase64 as insertImageBase64Impl,
  readFileAsBase64,
  openImageDialog,
  MAX_IMAGE_SIZE,
} from './components/Plugins/ImagePlugin';
import {
  getCodeBlockLanguage as getCodeBlockLanguageImpl,
  setCodeBlockLanguage as setCodeBlockLanguageImpl,
  SUPPORTED_LANGUAGES,
} from './components/Plugins/CodeBlockPlugin';
import { CodeBlockLanguageSelector as CodeBlockLanguageSelectorImpl } from './components/Plugins/CodeBlockLanguageSelector';
import {
  canUndo as canUndoImpl,
  canRedo as canRedoImpl,
  HISTORY_DEPTH,
  HISTORY_NEW_GROUP_DELAY,
} from './components/Plugins/HistoryPlugin';
import { compileDocument, compileSource, looksLikeHtml } from './compile';
import type { CompiledDocument, CompileOptions } from './compile';
import {
  useEditorStore as useEditorStoreImpl,
  createEditor as createEditorImpl,
  createExtensions as createExtensionsImpl,
  createPluginRegistry,
  lowlight as lowlightImpl,
  toHTML as toHTMLImpl,
  fromHTML,
  createEmptyDoc,
  isContentEmpty,
  toggleBold as toggleBoldImpl,
  toggleItalic as toggleItalicImpl,
  toggleUnderline as toggleUnderlineImpl,
  toggleStrike as toggleStrikeImpl,
  setHeading as setHeadingImpl,
  toggleBulletList as toggleBulletListImpl,
  toggleOrderedList as toggleOrderedListImpl,
  sinkListItem as sinkListItemImpl,
  liftListItem as liftListItemImpl,
  toggleBlockquote as toggleBlockquoteImpl,
  toggleCode as toggleCodeImpl,
  toggleCodeBlock as toggleCodeBlockImpl,
  insertLink as insertLinkImpl,
  removeLink as removeLinkImpl,
  insertImage as insertImageImpl,
  undo as undoImpl,
  redo as redoImpl,
  type CreateEditorOptions,
} from './core';
import {
  useEditor as useEditorImpl,
  useToolbar as useToolbarImpl,
  useHistory as useHistoryImpl,
} from './hooks';
import type { UseEditorOptions, UseToolbarResult, UseHistoryResult } from './hooks';
import { generateSeoMetadata, recognizeSeo, isInternalHref, attributesForHref } from './seo';
import type { SeoFinding, SeoMetadata, SeoOptions, SeoReport } from './seo';
import { DEFAULT_TOOLBAR } from './types';
import type {
  EditorExtension,
  EditorHandle,
  Highlighter,
  PluginConfig,
  PluginRegistry,
  PublicEditorStore,
  RichTextEditorProps,
  Theme,
  DialogType,
  PreviewMode,
  EditorState,
  EditorActions,
  EditorConfig,
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
import {
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

export { RichTextEditor };
export type {
  RichTextEditorProps,
  Theme,
  DialogType,
  PreviewMode,
  EditorState,
  EditorActions,
  EditorConfig,
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
  PluginConfig,
  PluginRegistry,
  EditorExtension,
  EditorHandle,
  CompiledDocument,
  CompileOptions,
  SeoFinding,
  SeoMetadata,
  SeoOptions,
  SeoReport,
  UseEditorOptions,
  UseToolbarResult,
  UseHistoryResult,
  CreateEditorOptions,
  PreviewPanelProps,
};
export type { PublicEditorStore as EditorStore };

export { DEFAULT_TOOLBAR };
export { compileDocument, compileSource, looksLikeHtml };
export { generateSeoMetadata, recognizeSeo, isInternalHref, attributesForHref };
export { createPluginRegistry };
export { fromHTML, createEmptyDoc, isContentEmpty, toMarkdown };
export { PreviewPanel, PreviewToggle };
export { readFileAsBase64, openImageDialog, MAX_IMAGE_SIZE, SUPPORTED_LANGUAGES };
export { HISTORY_DEPTH, HISTORY_NEW_GROUP_DELAY };
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
};

function asEditor(editor: EditorHandle): Editor {
  return editor as unknown as Editor;
}

export function useEditor(options?: UseEditorOptions): EditorHandle | null {
  return useEditorImpl(options) as unknown as EditorHandle | null;
}

export function useToolbar(toolbar: ToolbarInput): UseToolbarResult {
  return useToolbarImpl(toolbar);
}

export function useHistory(): UseHistoryResult {
  return useHistoryImpl();
}

export function createEditor(options?: CreateEditorOptions): EditorHandle {
  return createEditorImpl(options) as unknown as EditorHandle;
}

export function createExtensions(pluginExtensions?: EditorExtension[]): EditorExtension[] {
  return createExtensionsImpl(
    pluginExtensions as unknown as Parameters<typeof createExtensionsImpl>[0],
  ) as EditorExtension[];
}

export const lowlight: Highlighter = lowlightImpl as unknown as Highlighter;

export const useEditorStore: {
  (): PublicEditorStore;
  <T>(selector: (state: PublicEditorStore) => T): T;
  getState: () => PublicEditorStore;
  setState: (partial: Partial<PublicEditorStore>) => void;
} = useEditorStoreImpl as unknown as {
  (): PublicEditorStore;
  <T>(selector: (state: PublicEditorStore) => T): T;
  getState: () => PublicEditorStore;
  setState: (partial: Partial<PublicEditorStore>) => void;
};

export const toggleBold = (editor: EditorHandle): boolean => toggleBoldImpl(asEditor(editor));
export const toggleItalic = (editor: EditorHandle): boolean => toggleItalicImpl(asEditor(editor));
export const toggleUnderline = (editor: EditorHandle): boolean =>
  toggleUnderlineImpl(asEditor(editor));
export const toggleStrike = (editor: EditorHandle): boolean => toggleStrikeImpl(asEditor(editor));
export const setHeading = (editor: EditorHandle, level: 1 | 2 | 3 | 4 | 5 | 6): boolean =>
  setHeadingImpl(asEditor(editor), level);
export const toggleBulletList = (editor: EditorHandle): boolean =>
  toggleBulletListImpl(asEditor(editor));
export const toggleOrderedList = (editor: EditorHandle): boolean =>
  toggleOrderedListImpl(asEditor(editor));
export const sinkListItem = (editor: EditorHandle): boolean => sinkListItemImpl(asEditor(editor));
export const liftListItem = (editor: EditorHandle): boolean => liftListItemImpl(asEditor(editor));
export const toggleBlockquote = (editor: EditorHandle): boolean =>
  toggleBlockquoteImpl(asEditor(editor));
export const toggleCode = (editor: EditorHandle): boolean => toggleCodeImpl(asEditor(editor));
export const toggleCodeBlock = (editor: EditorHandle): boolean =>
  toggleCodeBlockImpl(asEditor(editor));
export const insertLink = (editor: EditorHandle, href: string, text?: string): boolean =>
  insertLinkImpl(asEditor(editor), href, text);
export const removeLink = (editor: EditorHandle): boolean => removeLinkImpl(asEditor(editor));
export const insertImage = (editor: EditorHandle, src: string, alt?: string): boolean =>
  insertImageImpl(asEditor(editor), src, alt);
export const undo = (editor: EditorHandle): boolean => undoImpl(asEditor(editor));
export const redo = (editor: EditorHandle): boolean => redoImpl(asEditor(editor));

export function toHTML(doc: Record<string, unknown>): string {
  return toHTMLImpl(doc as unknown as Parameters<typeof toHTMLImpl>[0]);
}

export const insertImageByUrl = (editor: EditorHandle, src: string, alt?: string): boolean =>
  insertImageByUrlImpl(asEditor(editor), src, alt);
export const insertImageBase64 = (editor: EditorHandle, dataUri: string, alt?: string): boolean =>
  insertImageBase64Impl(asEditor(editor), dataUri, alt);

export const getCodeBlockLanguage = (editor: EditorHandle): string | null =>
  getCodeBlockLanguageImpl(asEditor(editor));
export const setCodeBlockLanguage = (editor: EditorHandle, language: string): boolean =>
  setCodeBlockLanguageImpl(asEditor(editor), language);

export interface CodeBlockLanguageSelectorProps {
  editor: EditorHandle | null;
  className?: string;
  ariaLabel?: string;
}

export function CodeBlockLanguageSelector(props: CodeBlockLanguageSelectorProps): ReactElement {
  return createElement(
    CodeBlockLanguageSelectorImpl,
    props as unknown as ComponentProps<typeof CodeBlockLanguageSelectorImpl>,
  );
}

export const canUndo = (editor: EditorHandle): boolean => canUndoImpl(asEditor(editor));
export const canRedo = (editor: EditorHandle): boolean => canRedoImpl(asEditor(editor));
