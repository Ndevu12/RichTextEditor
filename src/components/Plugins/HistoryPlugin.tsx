/**
 * History Plugin — undo/redo configuration and helpers.
 *
 * StarterKit includes the History extension by default. This plugin
 * documents the configuration and provides helpers for history state.
 *
 * Configuration (via StarterKit in schema.ts):
 * - depth: 100 (max undo steps stored)
 * - newGroupDelay: 500ms (time before a new undo group is created)
 *
 * Keyboard shortcuts (provided by Tiptap History extension):
 * - Undo: Ctrl/⌘+Z
 * - Redo: Ctrl/⌘+Shift+Z or Ctrl/⌘+Y
 *
 * The `useHistory` hook (Phase 5) reads `canUndo`/`canRedo` state.
 * The `useToolbar` hook syncs disabled state to undo/redo buttons.
 */

import type { Editor } from '@tiptap/core';

/** Default history depth configured in schema.ts. */
export const HISTORY_DEPTH = 100;

/** Default new group delay (ms) configured in schema.ts. */
export const HISTORY_NEW_GROUP_DELAY = 500;

/**
 * Check if the editor can currently undo.
 *
 * @param editor - Tiptap editor instance
 * @returns true if there are steps to undo
 */
export function canUndo(editor: Editor): boolean {
  return editor.can().undo();
}

/**
 * Check if the editor can currently redo.
 *
 * @param editor - Tiptap editor instance
 * @returns true if there are undone steps to redo
 */
export function canRedo(editor: Editor): boolean {
  return editor.can().redo();
}
