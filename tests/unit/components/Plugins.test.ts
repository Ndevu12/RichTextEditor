import { describe, it, expect, afterEach } from 'vitest';
import { createEditor } from '@/core/engine';
import type { Editor } from '@tiptap/core';

// ── HistoryPlugin ──────────────────────────────────
import {
  HISTORY_DEPTH,
  HISTORY_NEW_GROUP_DELAY,
  canUndo,
  canRedo,
} from '@/components/Plugins/HistoryPlugin';

// ── ListsPlugin ────────────────────────────────────
import {
  sinkListItem,
  liftListItem,
} from '@/components/Plugins/ListsPlugin';

// ── LinkPlugin ─────────────────────────────────────
import {
  getActiveLinkAttrs,
  getSelectedText,
  applyLink,
  removeLink as removeLinkPlugin,
  openLinkDialog,
} from '@/components/Plugins/LinkPlugin';

// ── ImagePlugin ────────────────────────────────────
import {
  MAX_IMAGE_SIZE,
  insertImageByUrl,
  insertImageBase64,  readFileAsBase64,  openImageDialog,
} from '@/components/Plugins/ImagePlugin';

// ── CodeBlockPlugin ────────────────────────────────
import {
  SUPPORTED_LANGUAGES,
  getCodeBlockLanguage,
  setCodeBlockLanguage,
} from '@/components/Plugins/CodeBlockPlugin';

import { useEditorStore } from '@/core/store';

describe('HistoryPlugin', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('exports correct constants', () => {
    expect(HISTORY_DEPTH).toBe(100);
    expect(HISTORY_NEW_GROUP_DELAY).toBe(500);
  });

  it('canUndo returns false on fresh editor', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    expect(canUndo(editor)).toBe(false);
  });

  it('canUndo returns true after a change', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    editor.commands.setContent('<p>Changed</p>');
    expect(canUndo(editor)).toBe(true);
  });

  it('canRedo returns false on fresh editor', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    expect(canRedo(editor)).toBe(false);
  });

  it('canRedo returns true after undo', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    editor.commands.setContent('<p>Changed</p>');
    editor.commands.undo();
    expect(canRedo(editor)).toBe(true);
  });
});

describe('ListsPlugin', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('sinkListItem is a function', () => {
    expect(typeof sinkListItem).toBe('function');
  });

  it('liftListItem is a function', () => {
    expect(typeof liftListItem).toBe('function');
  });

  it('sinkListItem runs without error on list content', () => {
    editor = createEditor({ content: '<ul><li>Item 1</li><li>Item 2</li></ul>' });
    // Won't actually indent since there's no sub-list, but should not throw
    expect(() => sinkListItem(editor)).not.toThrow();
  });

  it('liftListItem runs without error on list content', () => {
    editor = createEditor({ content: '<ul><li>Item 1</li></ul>' });
    expect(() => liftListItem(editor)).not.toThrow();
  });
});

describe('LinkPlugin', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('getActiveLinkAttrs returns null when no link is selected', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    expect(getActiveLinkAttrs(editor)).toBeNull();
  });

  it('getSelectedText returns empty string when nothing is selected', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    expect(getSelectedText(editor)).toBe('');
  });

  it('getSelectedText returns selected text', () => {
    editor = createEditor({ content: '<p>Hello World</p>' });
    editor.commands.selectAll();
    expect(getSelectedText(editor)).toContain('Hello World');
  });

  it('applyLink applies a link to selection', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    editor.commands.selectAll();
    applyLink(editor, 'https://example.com');
    expect(editor.getHTML()).toContain('href="https://example.com"');
  });

  it('applyLink inserts new text with link when text differs', () => {
    editor = createEditor({ content: '<p>Old text</p>' });
    editor.commands.selectAll();
    applyLink(editor, 'https://example.com', 'New text');
    expect(editor.getHTML()).toContain('New text');
  });

  it('removeLinkPlugin removes link mark', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    editor.commands.selectAll();
    applyLink(editor, 'https://example.com');
    editor.commands.selectAll();
    removeLinkPlugin(editor);
    expect(editor.getHTML()).not.toContain('<a ');
  });

  it('openLinkDialog sets dialog state in store', () => {
    openLinkDialog();
    expect(useEditorStore.getState().openDialog).toBe('link');
    useEditorStore.getState().setOpenDialog(null);
  });
});

describe('ImagePlugin', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('exports MAX_IMAGE_SIZE as 5MB', () => {
    expect(MAX_IMAGE_SIZE).toBe(5 * 1024 * 1024);
  });

  it('insertImageByUrl inserts an image', () => {
    editor = createEditor({ content: '<p></p>' });
    editor.commands.focus();
    insertImageByUrl(editor, 'https://example.com/img.png', 'Photo');
    const html = editor.getHTML();
    expect(html).toContain('<img');
    expect(html).toContain('src="https://example.com/img.png"');
  });

  it('insertImageBase64 inserts an image from data URI', () => {
    editor = createEditor({ content: '<p></p>' });
    editor.commands.focus();
    insertImageBase64(editor, 'data:image/png;base64,abc123', 'Base64 image');
    const html = editor.getHTML();
    expect(html).toContain('data:image/png;base64,abc123');
  });

  it('openImageDialog sets dialog state in store', () => {
    openImageDialog();
    expect(useEditorStore.getState().openDialog).toBe('image');
    useEditorStore.getState().setOpenDialog(null);
  });

  it('readFileAsBase64 returns a data URI promise', async () => {
    // Create a minimal image file
    const blob = new Blob(['fake-image-data'], { type: 'image/png' });
    const file = new File([blob], 'test.png', { type: 'image/png' });

    const result = await readFileAsBase64(file);
    expect(result).toMatch(/^data:image\/png;base64,/);
  });
});

describe('CodeBlockPlugin', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('exports SUPPORTED_LANGUAGES with expected entries', () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThan(10);
    const values = SUPPORTED_LANGUAGES.map((l) => l.value);
    expect(values).toContain('javascript');
    expect(values).toContain('typescript');
    expect(values).toContain('python');
  });

  it('getCodeBlockLanguage returns null when not in a code block', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    expect(getCodeBlockLanguage(editor)).toBeNull();
  });

  it('setCodeBlockLanguage is callable', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    // Won't do anything since cursor isn't in a code block, but should not throw
    expect(() => setCodeBlockLanguage(editor, 'javascript')).not.toThrow();
  });
});
