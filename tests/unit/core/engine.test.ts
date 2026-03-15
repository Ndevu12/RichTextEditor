import { describe, it, expect, afterEach, vi } from 'vitest';
import { createEditor } from '@/core/engine';
import type { Editor } from '@tiptap/core';

describe('createEditor', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('creates a Tiptap Editor instance', () => {
    editor = createEditor();
    expect(editor).toBeDefined();
    expect(editor.isDestroyed).toBe(false);
  });

  it('initializes with HTML content', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    expect(editor.getHTML()).toContain('Hello');
  });

  it('calls onUpdate when content changes', () => {
    const onUpdate = vi.fn();
    editor = createEditor({ content: '<p>initial</p>', onUpdate });

    // Programmatically change the content
    editor.commands.setContent('<p>changed</p>');

    expect(onUpdate).toHaveBeenCalled();
    expect(onUpdate.mock.calls.at(-1)?.[0]).toContain('changed');
  });

  it('respects editable: false option', () => {
    editor = createEditor({ editable: false });
    expect(editor.isEditable).toBe(false);
  });

  it('destroys cleanly without errors', () => {
    editor = createEditor();
    expect(() => editor.destroy()).not.toThrow();
    expect(editor.isDestroyed).toBe(true);
  });

  it('sets ARIA attributes on the editor element', () => {
    editor = createEditor({
      ariaLabel: 'Test editor',
      placeholder: 'Type here…',
    });

    const el = editor.view.dom as HTMLElement;
    expect(el.getAttribute('role')).toBe('textbox');
    expect(el.getAttribute('aria-multiline')).toBe('true');
    expect(el.getAttribute('aria-label')).toBe('Test editor');
    expect(el.getAttribute('aria-placeholder')).toBe('Type here…');
  });

  it('calls onFocus and onBlur callbacks', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    editor = createEditor({ onFocus, onBlur });

    // jsdom doesn't truly dispatch focus/blur like a real browser,
    // so we dispatch the events directly on the editor DOM element.
    const dom = editor.view.dom as HTMLElement;
    dom.dispatchEvent(new FocusEvent('focus'));
    expect(onFocus).toHaveBeenCalled();

    dom.dispatchEvent(new FocusEvent('blur'));
    expect(onBlur).toHaveBeenCalled();
  });
});
