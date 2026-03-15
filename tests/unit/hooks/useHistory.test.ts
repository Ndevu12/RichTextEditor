import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useHistory } from '@/hooks/useHistory';
import { useEditorStore } from '@/core/store';
import { createEditor } from '@/core/engine';

afterEach(() => {
  cleanup();
  const editor = useEditorStore.getState().editor;
  editor?.destroy();
  useEditorStore.getState().setEditor(null);
});

describe('useHistory', () => {
  it('returns undo/redo functions and state', () => {
    // Set up an editor in the store
    const editor = createEditor({ content: '<p>Test</p>' });
    useEditorStore.getState().setEditor(editor);

    const { result } = renderHook(() => useHistory());

    expect(typeof result.current.undo).toBe('function');
    expect(typeof result.current.redo).toBe('function');
    expect(typeof result.current.canUndo).toBe('boolean');
    expect(typeof result.current.canRedo).toBe('boolean');
  });

  it('canUndo is false on a fresh editor', () => {
    const editor = createEditor({ content: '<p>Test</p>' });
    useEditorStore.getState().setEditor(editor);

    const { result } = renderHook(() => useHistory());
    expect(result.current.canUndo).toBe(false);
  });

  it('canRedo is false on a fresh editor', () => {
    const editor = createEditor({ content: '<p>Test</p>' });
    useEditorStore.getState().setEditor(editor);

    const { result } = renderHook(() => useHistory());
    expect(result.current.canRedo).toBe(false);
  });

  it('returns no-op functions when no editor is in the store', () => {
    const { result } = renderHook(() => useHistory());
    // Should not throw
    expect(() => result.current.undo()).not.toThrow();
    expect(() => result.current.redo()).not.toThrow();
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
});
