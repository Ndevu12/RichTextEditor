import { Editor } from '@tiptap/core';
import { createExtensions } from './schema';

/**
 * Options for creating a new editor instance.
 */
export interface CreateEditorOptions {
  /** Initial HTML content */
  content?: string;
  /** Whether the editor is editable */
  editable?: boolean;
  /** Placeholder text shown when the editor is empty */
  placeholder?: string;
  /** Called when the editor content changes */
  onUpdate?: (html: string) => void;
  /** Called when the selection changes */
  onSelectionUpdate?: () => void;
  /** Called when the editor gains focus */
  onFocus?: () => void;
  /** Called when the editor loses focus */
  onBlur?: () => void;
}

/**
 * Factory function that creates a headless Tiptap Editor instance.
 *
 * This is the single entry point for editor creation. React hooks
 * (Phase 5) will call this and manage the lifecycle.
 */
export function createEditor(options: CreateEditorOptions = {}): Editor {
  return new Editor({
    extensions: createExtensions(),
    content: options.content || '',
    editable: options.editable ?? true,
    onUpdate: ({ editor }) => {
      options.onUpdate?.(editor.getHTML());
    },
    onSelectionUpdate: () => {
      options.onSelectionUpdate?.();
    },
    onFocus: () => {
      options.onFocus?.();
    },
    onBlur: () => {
      options.onBlur?.();
    },
  });
}
