/**
 * Editor surface shipped to consumers.
 * It stays inside this package so typechecking does not require Tiptap.
 */
export interface EditorCommandChain {
  focus(): EditorCommandChain;
  run(): boolean;
  toggleBold(): EditorCommandChain;
  toggleItalic(): EditorCommandChain;
  toggleUnderline(): EditorCommandChain;
  toggleStrike(): EditorCommandChain;
  toggleHeading(attributes: { level: 1 | 2 | 3 | 4 | 5 | 6 }): EditorCommandChain;
  toggleBulletList(): EditorCommandChain;
  toggleOrderedList(): EditorCommandChain;
  sinkListItem(typeOrName: string): EditorCommandChain;
  liftListItem(typeOrName: string): EditorCommandChain;
  toggleBlockquote(): EditorCommandChain;
  toggleCode(): EditorCommandChain;
  toggleCodeBlock(): EditorCommandChain;
  setLink(attributes: { href: string; rel?: string; target?: string | null }): EditorCommandChain;
  unsetLink(): EditorCommandChain;
  insertContent(value: string): EditorCommandChain;
  deleteSelection(): EditorCommandChain;
  undo(): EditorCommandChain;
  redo(): EditorCommandChain;
  setImage(attributes: { src: string; alt?: string }): EditorCommandChain;
}

export interface EditorHandle {
  getHTML(): string;
  getText(): string;
  destroy(): void;
  isDestroyed: boolean;
  isActive(name: string, attributes?: Record<string, unknown>): boolean;
  setEditable(editable: boolean): void;
  can(): { undo(): boolean; redo(): boolean };
  chain(): EditorCommandChain;
  commands: {
    setContent(content: string, options?: { emitUpdate?: boolean }): boolean;
    focus(): boolean;
    undo(): boolean;
    redo(): boolean;
    selectAll(): boolean;
  };
  getAttributes(name: string): Record<string, unknown>;
  state: {
    selection: { from: number; to: number };
    doc: {
      textBetween(from: number, to: number, blockSeparator?: string): string;
    };
  };
  view?: { dom: HTMLElement };
  on(event: string, handler: (...args: unknown[]) => void): void;
  off(event: string, handler: (...args: unknown[]) => void): void;
}

/** Public store shape. The runtime store is the same object. */
export interface PublicEditorStore {
  editor: EditorHandle | null;
  content: string;
  theme: import('./editor.types').Theme;
  readOnly: boolean;
  isFocused: boolean;
  activeMarks: Set<string>;
  activeNodes: Set<string>;
  headingLevel: number | null;
  openDialog: import('./editor.types').DialogType | null;
  previewMode: import('./editor.types').PreviewMode;
  siteOrigin: string;
  setEditor: (editor: EditorHandle | null) => void;
  setContent: (content: string) => void;
  setTheme: (theme: import('./editor.types').Theme) => void;
  setReadOnly: (readOnly: boolean) => void;
  setFocused: (focused: boolean) => void;
  updateActiveState: (marks: Set<string>, nodes: Set<string>, headingLevel: number | null) => void;
  setOpenDialog: (dialog: import('./editor.types').DialogType | null) => void;
  setPreviewMode: (mode: import('./editor.types').PreviewMode) => void;
  setSiteOrigin: (siteOrigin: string) => void;
}

/** Syntax highlighter consumers can register extra languages on. */
export interface Highlighter {
  register(name: string, grammar: object): void;
  registered(name: string): boolean;
}
