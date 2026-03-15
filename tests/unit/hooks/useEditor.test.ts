import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useEditor } from '@/hooks/useEditor';
import { useEditorStore } from '@/core/store';

afterEach(() => {
  cleanup();
  // Reset store
  const editor = useEditorStore.getState().editor;
  editor?.destroy();
  useEditorStore.getState().setEditor(null);
  useEditorStore.getState().setContent('');
  useEditorStore.getState().setFocused(false);
});

describe('useEditor', () => {
  it('creates a Tiptap editor and stores it in Zustand', () => {
    const { result } = renderHook(() =>
      useEditor({ value: '<p>Test</p>' }),
    );
    expect(result.current).not.toBeNull();
    expect(useEditorStore.getState().editor).toBe(result.current);
  });

  it('syncs the value prop to editor content', () => {
    const { result } = renderHook(() =>
      useEditor({ value: '<p>Initial</p>' }),
    );
    expect(result.current!.getHTML()).toContain('Initial');
  });

  it('calls onChange when content is updated', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useEditor({ value: '', onChange }),
    );

    act(() => {
      result.current!.commands.setContent('<p>Hello</p>');
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('destroys the editor on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useEditor({ value: '' }),
    );
    const editor = result.current!;
    expect(editor.isDestroyed).toBe(false);

    unmount();
    expect(editor.isDestroyed).toBe(true);
    expect(useEditorStore.getState().editor).toBeNull();
  });

  it('syncs readOnly prop changes', () => {
    let readOnly = false;
    const { result, rerender } = renderHook(() =>
      useEditor({ value: '<p>Test</p>', readOnly }),
    );
    expect(result.current!.isEditable).toBe(true);

    readOnly = true;
    rerender();
    expect(result.current!.isEditable).toBe(false);
  });

  it('syncs external value changes to editor content', () => {
    let value = '<p>Initial</p>';
    const { result, rerender } = renderHook(() =>
      useEditor({ value }),
    );
    expect(result.current!.getHTML()).toContain('Initial');

    value = '<p>Updated</p>';
    rerender();
    expect(result.current!.getHTML()).toContain('Updated');
  });

  it('sets focused state in store on focus/blur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { result } = renderHook(() =>
      useEditor({ value: '', onFocus, onBlur }),
    );
    const dom = result.current!.view.dom;

    dom.dispatchEvent(new FocusEvent('focus'));
    expect(useEditorStore.getState().isFocused).toBe(true);
    expect(onFocus).toHaveBeenCalled();

    dom.dispatchEvent(new FocusEvent('blur'));
    expect(useEditorStore.getState().isFocused).toBe(false);
    expect(onBlur).toHaveBeenCalled();
  });

  it('updates active marks/nodes on selectionUpdate', () => {
    const { result } = renderHook(() =>
      useEditor({ value: '<p><strong>Bold text</strong></p>' }),
    );
    const editor = result.current!;

    // Select all to trigger selection update
    act(() => {
      editor.commands.selectAll();
    });

    // Active marks should be updated in store
    const state = useEditorStore.getState();
    expect(state.activeMarks).toBeInstanceOf(Set);
    expect(state.activeNodes).toBeInstanceOf(Set);
  });
});