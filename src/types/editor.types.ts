import type { ToolbarItem } from './toolbar.types';

// --- Theme ---
export type Theme = 'light' | 'dark';

// --- Dialog Types ---
export type DialogType = 'link' | 'image';

// --- Editor Props (public API, matches README spec) ---
export interface RichTextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  toolbar?: ToolbarItem[];
  theme?: Theme;
  minHeight?: string | number;
  maxHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
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
}

// --- Editor Actions (Zustand store actions) ---
export interface EditorActions {
  setContent: (content: string) => void;
  setTheme: (theme: Theme) => void;
  setReadOnly: (readOnly: boolean) => void;
  setFocused: (focused: boolean) => void;
  updateActiveState: (
    marks: Set<string>,
    nodes: Set<string>,
    headingLevel: number | null,
  ) => void;
  setOpenDialog: (dialog: DialogType | null) => void;
}

// --- Editor Config ---
export interface EditorConfig {
  placeholder: string;
  readOnly: boolean;
  theme: Theme;
  toolbar: ToolbarItem[];
  minHeight: string | number;
  maxHeight?: string | number;
}
