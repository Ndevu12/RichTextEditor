import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createEditor } from '@/core/engine';
import {
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
} from '@/core/commands';
import type { Editor } from '@tiptap/core';

/**
 * Helper: create an editor with selected text to run formatting commands on.
 */
function editorWithSelection(content = '<p>Hello World</p>'): Editor {
  const editor = createEditor({ content });
  // Select all content so formatting commands have a target
  editor.commands.selectAll();
  return editor;
}

describe('commands', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  // ── Text formatting ────────────────────────────

  describe('toggleBold', () => {
    it('applies bold mark', () => {
      editor = editorWithSelection();
      toggleBold(editor);
      expect(editor.getHTML()).toContain('<strong>');
    });

    it('removes bold mark when toggled again', () => {
      editor = editorWithSelection();
      toggleBold(editor);
      expect(editor.getHTML()).toContain('<strong>');
      editor.commands.selectAll();
      toggleBold(editor);
      expect(editor.getHTML()).not.toContain('<strong>');
    });
  });

  describe('toggleItalic', () => {
    it('applies italic mark', () => {
      editor = editorWithSelection();
      toggleItalic(editor);
      expect(editor.getHTML()).toContain('<em>');
    });
  });

  describe('toggleUnderline', () => {
    it('applies underline mark', () => {
      editor = editorWithSelection();
      toggleUnderline(editor);
      expect(editor.getHTML()).toContain('<u>');
    });
  });

  describe('toggleStrike', () => {
    it('applies strikethrough mark', () => {
      editor = editorWithSelection();
      toggleStrike(editor);
      expect(editor.getHTML()).toContain('<s>');
    });
  });

  // ── Headings ───────────────────────────────────

  describe('setHeading', () => {
    it('applies heading level 2', () => {
      editor = editorWithSelection();
      setHeading(editor, 2);
      expect(editor.getHTML()).toContain('<h2>');
    });

    it('switches between heading levels', () => {
      editor = editorWithSelection();
      setHeading(editor, 1);
      expect(editor.getHTML()).toContain('<h1>');
      // Switch from H1 to H3
      editor.commands.selectAll();
      setHeading(editor, 3);
      expect(editor.getHTML()).toContain('<h3>');
      expect(editor.getHTML()).not.toContain('<h1>');
    });
  });

  // ── Lists ──────────────────────────────────────

  describe('toggleBulletList', () => {
    it('creates an unordered list', () => {
      editor = editorWithSelection();
      toggleBulletList(editor);
      expect(editor.getHTML()).toContain('<ul>');
    });
  });

  describe('toggleOrderedList', () => {
    it('creates an ordered list', () => {
      editor = editorWithSelection();
      toggleOrderedList(editor);
      expect(editor.getHTML()).toContain('<ol>');
    });
  });

  // ── Block formatting ───────────────────────────

  describe('toggleBlockquote', () => {
    it('wraps content in blockquote', () => {
      editor = editorWithSelection();
      toggleBlockquote(editor);
      expect(editor.getHTML()).toContain('<blockquote>');
    });
  });

  describe('toggleCode', () => {
    it('applies inline code mark', () => {
      editor = editorWithSelection();
      toggleCode(editor);
      expect(editor.getHTML()).toContain('<code>');
    });
  });

  describe('toggleCodeBlock', () => {
    it('creates a code block', () => {
      editor = editorWithSelection();
      toggleCodeBlock(editor);
      expect(editor.getHTML()).toContain('<pre>');
    });
  });

  // ── Links ──────────────────────────────────────

  describe('insertLink', () => {
    it('creates a link with href', () => {
      editor = editorWithSelection();
      insertLink(editor, 'https://example.com');
      expect(editor.getHTML()).toContain('href="https://example.com"');
    });

    it('creates a link with custom text', () => {
      editor = createEditor({ content: '<p></p>' });
      editor.commands.focus();
      insertLink(editor, 'https://example.com', 'Click me');
      expect(editor.getHTML()).toContain('Click me');
      expect(editor.getHTML()).toContain('href="https://example.com"');
    });
  });

  describe('removeLink', () => {
    it('removes a link', () => {
      editor = editorWithSelection();
      insertLink(editor, 'https://example.com');
      editor.commands.selectAll();
      removeLink(editor);
      expect(editor.getHTML()).not.toContain('<a ');
    });
  });

  // ── Images ─────────────────────────────────────

  describe('insertImage', () => {
    it('inserts an image with src and alt', () => {
      editor = createEditor({ content: '<p></p>' });
      editor.commands.focus();
      insertImage(editor, 'https://example.com/image.png', 'A photo');
      const html = editor.getHTML();
      expect(html).toContain('<img');
      expect(html).toContain('src="https://example.com/image.png"');
      expect(html).toContain('alt="A photo"');
    });
  });

  // ── History ────────────────────────────────────

  describe('undo / redo', () => {
    it('undo reverses the last action', () => {
      editor = editorWithSelection();
      toggleBold(editor);
      expect(editor.getHTML()).toContain('<strong>');

      undo(editor);
      expect(editor.getHTML()).not.toContain('<strong>');
    });

    it('redo re-applies the undone action', () => {
      editor = editorWithSelection();
      toggleBold(editor);
      undo(editor);
      expect(editor.getHTML()).not.toContain('<strong>');

      redo(editor);
      expect(editor.getHTML()).toContain('<strong>');
    });
  });
});
