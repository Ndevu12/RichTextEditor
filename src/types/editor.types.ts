import type React from 'react';
import type { CompiledDocument } from '@/compile/types';
import type { SeoOptions, SeoReport } from '@/seo/types';
import type { ToolbarInput } from './toolbar.types';
import type { PluginRegistry } from './plugin.types';

// --- Theme ---
export type Theme = 'light' | 'dark';

// --- Dialog Types ---
export type DialogType = 'link' | 'image';

// --- Preview Mode ---
export type PreviewMode = 'none' | 'html' | 'markdown';

// --- Editor Props (public API, matches README spec) ---
export interface RichTextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  toolbar?: ToolbarInput;
  theme?: Theme;
  minHeight?: string | number;
  maxHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible label for the editor content area (default: 'Rich text editor') */
  ariaLabel?: string;
  /** Plugin registry for dynamic extension loading */
  pluginRegistry?: PluginRegistry;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Show the SEO panel and capture title, description, and slug. */
  seo?: boolean | SeoOptions;
  /** Called when the recognized SEO report changes. */
  onSeoChange?: (report: SeoReport) => void;
  /** Compile Markdown or plain text in `value` into HTML. */
  autoCompile?: boolean;
  /** Called with the compiled document after content changes. */
  onCompile?: (document: CompiledDocument) => void;
  /** Origin used when compiling links and recognizing internal URLs. */
  siteOrigin?: string;
}

// --- Editor State (internal, for Zustand store) ---
export interface EditorState {
  content: string;
  theme: Theme;
  readOnly: boolean;
  isFocused: boolean;
  activeMarks: Set<string>; // e.g. 'bold', 'italic', 'underline', ...
  activeNodes: Set<string>; // e.g. 'heading', 'bulletList', ...
  headingLevel: number | null; // currently active heading level (1-6) or null
  openDialog: DialogType | null;
  previewMode: PreviewMode;
  /** Origin used to classify internal links. Empty means only relative URLs count. */
  siteOrigin: string;
}

// --- Editor Actions (Zustand store actions) ---
export interface EditorActions {
  setContent: (content: string) => void;
  setTheme: (theme: Theme) => void;
  setReadOnly: (readOnly: boolean) => void;
  setFocused: (focused: boolean) => void;
  updateActiveState: (marks: Set<string>, nodes: Set<string>, headingLevel: number | null) => void;
  setOpenDialog: (dialog: DialogType | null) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setSiteOrigin: (siteOrigin: string) => void;
}

// --- Editor Config ---
export interface EditorConfig {
  placeholder: string;
  readOnly: boolean;
  theme: Theme;
  toolbar: ToolbarInput;
  minHeight: string | number;
  maxHeight?: string | number;
}
