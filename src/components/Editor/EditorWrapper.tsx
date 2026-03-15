import { useEditorStore } from '@/core/store';
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
 *
 * NOTE: Toolbar component is a stub until Phase 7. Dialogs are
 * added in Phases 11–12.
 */
export function EditorWrapper({
  toolbar: _toolbar,
  placeholder,
  minHeight,
  maxHeight,
  className,
  style,
}: EditorWrapperProps) {
  const editor = useEditorStore((s) => s.editor);
  const theme = useEditorStore((s) => s.theme);
  const readOnly = useEditorStore((s) => s.readOnly);

  return (
    <div
      className={className}
      style={style}
      data-theme={theme}
      data-readonly={readOnly || undefined}
    >
      {/* Toolbar will be rendered here in Phase 7 */}
      {!readOnly && (
        <div role="toolbar" aria-label="Text formatting" aria-orientation="horizontal">
          {/* Phase 7: <Toolbar items={toolbarItems} /> */}
        </div>
      )}

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
