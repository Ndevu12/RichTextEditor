import { useEditorStore } from '@/core/store';
import { undo as undoCmd, redo as redoCmd } from '@/core/commands';

export interface UseHistoryResult {
  /** Execute undo */
  undo: () => void;
  /** Execute redo */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
}

/**
 * Lightweight hook for undo/redo state and actions.
 *
 * `canUndo` / `canRedo` re-evaluate whenever the editor reference
 * or active marks change in the store (which happens on every
 * transaction via `useEditor`'s selection update handler).
 */
export function useHistory(): UseHistoryResult {
  const editor = useEditorStore((s) => s.editor);
  // Subscribe to activeMarks to trigger re-renders on every transaction
  // (activeMarks update acts as a proxy for "editor state changed")
  useEditorStore((s) => s.activeMarks);

  return {
    undo: () => editor && undoCmd(editor),
    redo: () => editor && redoCmd(editor),
    canUndo: editor?.can().undo() ?? false,
    canRedo: editor?.can().redo() ?? false,
  };
}
