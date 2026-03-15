/**
 * Link Plugin
 *
 * Provides helpers for link insertion, editing, and removal.
 * The Link Tiptap extension is registered in `schema.ts`.
 * This module exposes utility functions consumed by `LinkDialog`.
 */

import type { Editor } from '@tiptap/core';
import { useEditorStore } from '@/core/store';

/** Get the link attributes (`href`) of the currently selected link, if any. */
export function getActiveLinkAttrs(editor: Editor): { href: string } | null {
  const attrs = editor.getAttributes('link');
  if (attrs.href) {
    return { href: attrs.href as string };
  }
  return null;
}

/** Get the currently selected text in the editor. */
export function getSelectedText(editor: Editor): string {
  const { from, to } = editor.state.selection;
  return editor.state.doc.textBetween(from, to, ' ');
}

/**
 * Open the link dialog, pre-filling with current link data if applicable.
 *
 * Called by the toolbar button action (wired in `useToolbar`).
 */
export function openLinkDialog(): void {
  useEditorStore.getState().setOpenDialog('link');
}

/**
 * Insert or update a link in the editor.
 *
 * - If `text` is provided and differs from current selection, replaces selection.
 * - Otherwise, applies the link mark to the current selection.
 */
export function applyLink(editor: Editor, href: string, text?: string): boolean {
  if (text) {
    // Delete current selection and insert new text with link
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (text !== selectedText) {
      return editor
        .chain()
        .focus()
        .deleteSelection()
        .insertContent(`<a href="${href}">${text}</a>`)
        .run();
    }
  }

  // Apply link to existing selection
  return editor.chain().focus().setLink({ href }).run();
}

/** Remove the link mark from the current selection. */
export function removeLink(editor: Editor): boolean {
  return editor.chain().focus().unsetLink().run();
}
