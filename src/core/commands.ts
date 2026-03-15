import type { Editor } from '@tiptap/core';

// ──────────────────────────────────────────────
// Text Formatting
// ──────────────────────────────────────────────

export const toggleBold = (editor: Editor): boolean =>
  editor.chain().focus().toggleBold().run();

export const toggleItalic = (editor: Editor): boolean =>
  editor.chain().focus().toggleItalic().run();

/** Requires Underline extension (Phase 9) */
export const toggleUnderline = (editor: Editor): boolean =>
  editor.chain().focus().toggleUnderline().run();

export const toggleStrike = (editor: Editor): boolean =>
  editor.chain().focus().toggleStrike().run();

// ──────────────────────────────────────────────
// Headings
// ──────────────────────────────────────────────

export const setHeading = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6): boolean =>
  editor.chain().focus().toggleHeading({ level }).run();

// ──────────────────────────────────────────────
// Lists
// ──────────────────────────────────────────────

export const toggleBulletList = (editor: Editor): boolean =>
  editor.chain().focus().toggleBulletList().run();

export const toggleOrderedList = (editor: Editor): boolean =>
  editor.chain().focus().toggleOrderedList().run();

// ──────────────────────────────────────────────
// Block Formatting
// ──────────────────────────────────────────────

export const toggleBlockquote = (editor: Editor): boolean =>
  editor.chain().focus().toggleBlockquote().run();

export const toggleCode = (editor: Editor): boolean =>
  editor.chain().focus().toggleCode().run();

export const toggleCodeBlock = (editor: Editor): boolean =>
  editor.chain().focus().toggleCodeBlock().run();

// ──────────────────────────────────────────────
// Links (requires Link extension — Phase 11)
// ──────────────────────────────────────────────

export const insertLink = (editor: Editor, href: string, text?: string): boolean => {
  if (text) {
    return editor.chain().focus().insertContent(`<a href="${href}">${text}</a>`).run();
  }
  return editor.chain().focus().setLink({ href }).run();
};

export const removeLink = (editor: Editor): boolean =>
  editor.chain().focus().unsetLink().run();

// ──────────────────────────────────────────────
// Images (requires Image extension — Phase 12)
// ──────────────────────────────────────────────

export const insertImage = (editor: Editor, src: string, alt?: string): boolean =>
  editor
    .chain()
    .focus()
    .insertContent(`<img src="${src}" alt="${alt || ''}" />`)
    .run();

// ──────────────────────────────────────────────
// History
// ──────────────────────────────────────────────

export const undo = (editor: Editor): boolean => editor.chain().focus().undo().run();

export const redo = (editor: Editor): boolean => editor.chain().focus().redo().run();
