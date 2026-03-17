import { create } from 'zustand';
import type { Editor } from '@tiptap/core';
import type { EditorState, EditorActions, Theme, DialogType, PreviewMode } from '@/types';

/**
 * The Zustand store — single source of truth for editor state.
 *
 * Holds a reference to the Tiptap `Editor` instance so commands
 * can access it from anywhere via `useEditorStore.getState().editor`.
 *
 * Design decisions:
 * - `activeMarks` / `activeNodes` are `Set<string>` for O(1) lookup
 *   when rendering toolbar button active states.
 * - `openDialog` tracks which dialog (link/image) is open; `null` = none.
 * - Zustand's shallow selectors prevent unnecessary re-renders.
 */
export interface EditorStore extends EditorState, EditorActions {
  /** The Tiptap editor instance (null before initialization, null after destroy) */
  editor: Editor | null;
  /** Set or clear the Tiptap editor instance */
  setEditor: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  // ── State ──────────────────────────────────
  editor: null,
  content: '',
  theme: 'light' as Theme,
  readOnly: false,
  isFocused: false,
  activeMarks: new Set<string>(),
  activeNodes: new Set<string>(),
  headingLevel: null,
  openDialog: null as DialogType | null,
  previewMode: 'none' as PreviewMode,

  // ── Actions ────────────────────────────────
  setEditor: (editor) => set({ editor }),
  setContent: (content) => set({ content }),
  setTheme: (theme) => set({ theme }),
  setReadOnly: (readOnly) => set({ readOnly }),
  setFocused: (focused) => set({ isFocused: focused }),
  updateActiveState: (marks, nodes, headingLevel) =>
    set({ activeMarks: marks, activeNodes: nodes, headingLevel }),
  setOpenDialog: (dialog) => set({ openDialog: dialog }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
}));
