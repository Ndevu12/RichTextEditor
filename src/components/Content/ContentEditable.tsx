import { EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';

export interface ContentEditableProps {
  /** The Tiptap editor instance */
  editor: Editor | null;
  /** Minimum height of the editable area */
  minHeight?: string | number;
  /** Maximum height of the editable area (enables scrolling) */
  maxHeight?: string | number;
  /** Placeholder text shown when editor is empty */
  placeholder?: string;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Renders Tiptap's EditorContent with size constraints and placeholder.
 *
 * The placeholder is rendered via a `data-placeholder` attribute and
 * CSS `:empty::before` pseudo-element (styled in Phase 8).
 */
export function ContentEditable({
  editor,
  minHeight,
  maxHeight,
  placeholder,
  className,
}: ContentEditableProps) {
  const style: React.CSSProperties = {
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    overflowY: maxHeight ? 'auto' : undefined,
  };

  return (
    <div className={className} style={style} data-placeholder={placeholder}>
      <EditorContent editor={editor} />
    </div>
  );
}
