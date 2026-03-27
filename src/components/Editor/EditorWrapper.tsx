import { useEditorStore } from '@/core/store';
import { useToolbar } from '@/hooks/useToolbar';
import { Toolbar } from '@/components/Toolbar';
import { ContentEditable } from '@/components/Content';
import { LinkDialog } from '@/components/Dialogs/LinkDialog';
import { ImageDialog } from '@/components/Dialogs/ImageDialog';
import { PreviewPanel, PreviewToggle } from '@/components/Preview';
import type { ToolbarInput } from '@/types';

export interface EditorWrapperProps {
  /** Toolbar items configuration */
  toolbar: ToolbarInput;
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
 * Composes Toolbar + ContentEditable + PreviewPanel vertically.
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
  const openDialog = useEditorStore((s) => s.openDialog);
  const previewMode = useEditorStore((s) => s.previewMode);
  const { items: toolbarItems } = useToolbar(toolbar);

  const wrapperClass = ['rte-editor', className].filter(Boolean).join(' ');

  return (
    <div
      className={wrapperClass}
      style={style}
      data-theme={theme}
      data-readonly={readOnly || undefined}
    >
      {!readOnly && (
        <div className="rte-toolbar-row">
          <Toolbar items={toolbarItems} />
          <PreviewToggle />
        </div>
      )}

      <div className={`rte-body${previewMode !== 'none' ? ' rte-body--split' : ''}`}>
        <ContentEditable
          editor={editor}
          minHeight={minHeight}
          maxHeight={maxHeight}
          placeholder={placeholder}
          className="rte-content"
        />

        <PreviewPanel mode={previewMode} />
      </div>

      {/* Dialogs */}
      {openDialog === 'link' && <LinkDialog />}
      {openDialog === 'image' && <ImageDialog />}
    </div>
  );
}
