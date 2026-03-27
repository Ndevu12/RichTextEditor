import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useToolbar } from '@/hooks/useToolbar';
import { useEditorStore } from '@/core/store';
import { createEditor } from '@/core/engine';
import type { RichToolbarInput, ToolbarItem } from '@/types';
import type { Editor } from '@tiptap/core';

let editor: Editor;

afterEach(() => {
  cleanup();
  editor?.destroy();
  useEditorStore.getState().setEditor(null);
});

describe('useToolbar', () => {
  function setupEditor() {
    editor = createEditor({ content: '<p>Hello</p>' });
    useEditorStore.getState().setEditor(editor);
    useEditorStore.getState().setReadOnly(false);
    return editor;
  }

  it('returns resolved items matching input toolbar', () => {
    setupEditor();
    const toolbar: ToolbarItem[] = ['bold', 'italic', '|', 'undo', 'redo'];
    const { result } = renderHook(() => useToolbar(toolbar));

    expect(result.current.items).toHaveLength(5);
    expect(result.current.items[2]).toBe('|'); // separator preserved
  });

  it('keeps legacy and rich built-in input compatible', () => {
    setupEditor();
    const legacyToolbar: ToolbarItem[] = ['bold', '|', 'italic'];
    const richToolbar: RichToolbarInput = [{ id: 'bold' }, { type: 'separator' }, { id: 'italic' }];

    const legacyResult = renderHook(() => useToolbar(legacyToolbar));
    const richResult = renderHook(() => useToolbar(richToolbar));

    expect(richResult.result.current.items).toHaveLength(legacyResult.result.current.items.length);
    expect(richResult.result.current.items[1]).toBe('|');
    expect(legacyResult.result.current.items[1]).toBe('|');

    const richBold = richResult.result.current.items[0];
    const legacyBold = legacyResult.result.current.items[0];
    const richItalic = richResult.result.current.items[2];
    const legacyItalic = legacyResult.result.current.items[2];

    if (richBold !== '|' && legacyBold !== '|') {
      expect(richBold.id).toBe(legacyBold.id);
      expect(richBold.label).toBe(legacyBold.label);
      expect(richBold.isDisabled).toBe(legacyBold.isDisabled);
    }
    if (richItalic !== '|' && legacyItalic !== '|') {
      expect(richItalic.id).toBe(legacyItalic.id);
      expect(richItalic.label).toBe(legacyItalic.label);
      expect(richItalic.isDisabled).toBe(legacyItalic.isDisabled);
    }
  });

  it('updates resolved items when toolbar input changes at runtime', () => {
    setupEditor();
    const { result, rerender } = renderHook(
      ({ toolbar }) => useToolbar(toolbar),
      {
        initialProps: {
          toolbar: ['bold', '|', 'italic'] as ToolbarItem[],
        },
      },
    );

    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[1]).toBe('|');

    rerender({
      toolbar: ['underline', '|', 'undo', 'redo'],
    });

    expect(result.current.items).toHaveLength(4);
    expect(result.current.items[1]).toBe('|');
    const first = result.current.items[0];
    const third = result.current.items[2];
    if (first !== '|') expect(first.id).toBe('underline');
    if (third !== '|') expect(third.id).toBe('undo');
  });

  it('compacts leading, trailing, and consecutive separators', () => {
    setupEditor();
    const toolbar: RichToolbarInput = [
      '|',
      { type: 'separator', id: 's-1' },
      { id: 'bold' },
      '|',
      { type: 'separator', id: 's-2' },
      { id: 'italic' },
      '|',
      '|',
    ];
    const { result } = renderHook(() => useToolbar(toolbar));

    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[1]).toBe('|');
    const first = result.current.items[0];
    const last = result.current.items[2];
    if (first !== '|') expect(first.id).toBe('bold');
    if (last !== '|') expect(last.id).toBe('italic');
  });

  it('keeps built-in labels and actions when rich input only specifies id', () => {
    setupEditor();
    const toolbar: RichToolbarInput = [{ id: 'bold' }];
    const { result } = renderHook(() => useToolbar(toolbar));

    const item = result.current.items[0];
    expect(item).not.toBe('|');
    if (item !== '|') {
      expect(item.label).toBe('Bold');
      expect(typeof item.action).toBe('function');
    }
  });

  it('sets isDisabled=true when readOnly', () => {
    setupEditor();
    useEditorStore.getState().setReadOnly(true);
    const toolbar: ToolbarItem[] = ['bold'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const boldItem = result.current.items[0];
    expect(boldItem).not.toBe('|');
    if (boldItem !== '|') {
      expect(boldItem.isDisabled).toBe(true);
    }
  });

  it('sets isDisabled=true when no editor', () => {
    useEditorStore.getState().setEditor(null);
    const toolbar: ToolbarItem[] = ['bold'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const boldItem = result.current.items[0];
    if (boldItem !== '|') {
      expect(boldItem.isDisabled).toBe(true);
    }
  });

  it('resolves active state from activeMarks', () => {
    setupEditor();
    useEditorStore.getState().updateActiveState(new Set(['bold']), new Set(), null);
    const toolbar: ToolbarItem[] = ['bold', 'italic'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const boldItem = result.current.items[0];
    const italicItem = result.current.items[1];
    if (boldItem !== '|') expect(boldItem.isActive).toBe(true);
    if (italicItem !== '|') expect(italicItem.isActive).toBe(false);
  });

  it('resolves heading active state from headingLevel', () => {
    setupEditor();
    useEditorStore.getState().updateActiveState(new Set(), new Set(['heading']), 2);
    const toolbar: ToolbarItem[] = ['heading1', 'heading2', 'heading3'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const h1 = result.current.items[0];
    const h2 = result.current.items[1];
    const h3 = result.current.items[2];
    if (h1 !== '|') expect(h1.isActive).toBe(false);
    if (h2 !== '|') expect(h2.isActive).toBe(true);
    if (h3 !== '|') expect(h3.isActive).toBe(false);
  });

  it('resolves node active state from activeNodes', () => {
    setupEditor();
    useEditorStore.getState().updateActiveState(new Set(), new Set(['bulletList']), null);
    const toolbar: ToolbarItem[] = ['bulletList', 'orderedList'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const bullet = result.current.items[0];
    const ordered = result.current.items[1];
    if (bullet !== '|') expect(bullet.isActive).toBe(true);
    if (ordered !== '|') expect(ordered.isActive).toBe(false);
  });

  it('provides actions for undo/redo items', () => {
    setupEditor();
    const toolbar: ToolbarItem[] = ['undo', 'redo'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const undoItem = result.current.items[0];
    const redoItem = result.current.items[1];
    if (undoItem !== '|') {
      expect(typeof undoItem.action).toBe('function');
      // undo should be disabled on fresh editor (nothing to undo)
      expect(undoItem.isDisabled).toBe(true);
    }
    if (redoItem !== '|') {
      expect(redoItem.isDisabled).toBe(true);
    }
  });

  it('resolves link and image items with actions that open dialogs', () => {
    setupEditor();
    const toolbar: ToolbarItem[] = ['link', 'image'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const linkItem = result.current.items[0];
    const imageItem = result.current.items[1];

    if (linkItem !== '|') {
      linkItem.action();
      expect(useEditorStore.getState().openDialog).toBe('link');
    }

    useEditorStore.getState().setOpenDialog(null);

    if (imageItem !== '|') {
      imageItem.action();
      expect(useEditorStore.getState().openDialog).toBe('image');
    }
    useEditorStore.getState().setOpenDialog(null);
  });

  it('resolves all heading levels (4, 5, 6)', () => {
    setupEditor();
    useEditorStore.getState().updateActiveState(new Set(), new Set(['heading']), 5);
    const toolbar: ToolbarItem[] = ['heading4', 'heading5', 'heading6'];
    const { result } = renderHook(() => useToolbar(toolbar));

    const h4 = result.current.items[0];
    const h5 = result.current.items[1];
    const h6 = result.current.items[2];
    if (h4 !== '|') expect(h4.isActive).toBe(false);
    if (h5 !== '|') expect(h5.isActive).toBe(true);
    if (h6 !== '|') expect(h6.isActive).toBe(false);
  });

  it('resolves all formatting actions (strike, code, blockquote, codeBlock, orderedList)', () => {
    setupEditor();
    const toolbar: ToolbarItem[] = [
      'strike', 'underline', 'code', 'blockquote', 'codeBlock', 'orderedList', 'bulletList',
    ];
    const { result } = renderHook(() => useToolbar(toolbar));

    // All should be callable without throwing
    for (const item of result.current.items) {
      if (item !== '|') {
        expect(() => item.action()).not.toThrow();
      }
    }
  });
});
