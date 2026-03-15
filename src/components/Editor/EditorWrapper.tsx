import { useEditorStore } from '@/core/store';
import { useToolbar } from '@/hooks/useToolbar';
import { Toolbar } from '@/components/Toolbar';
import { ContentEditable } from '@/components/Content';
import type { ToolbarItem } from '@/types';

export interface EditorWrapperProps {
  /** Toolbar items configuration */
  toolbar: ToolbarItem[];
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Minimum height of the editable area */
  minHeight?: string | number;
  /** Maximum height of the editable area */
  maxHeight?: string | number;
  /** Additional CSS class for the outer wrapper */
  className?: string;
  /** Inline styles for the outer wrapper */
  style?: React.CSSProperties;
}

/**
 * Composes Toolbar + ContentEditable vertically.
 *
 * Applies `data-theme` attribute for CSS theming and conditionally
 * hides the toolbar when `readOnly` is true.
 */
export function EditorWrapper({
  toolbar,
  placeholder,
  minHeight,
  maxHeight,
  className,
  style,
}: EditorWrapperProps) {
  const editor = useEditorStore((s) => s.editor);
  const theme = useEditorStore((s) => s.theme);
  const readOnly = useEditorStore((s) => s.readOnly);
  const { items: toolbarItems } = useToolbar(toolbar);

  return (
    <div
      className={className}
      style={style}
      data-theme={theme}
      data-readonly={readOnly || undefined}
    >
      {!readOnly && <Toolbar items={toolbarItems} />}

      <ContentEditable
        editor={editor}
        minHeight={minHeight}
        maxHeight={maxHeight}
        placeholder={placeholder}
      />

      {/* Dialogs rendered here in Phases 11–12 */}
    </div>
  );
}
