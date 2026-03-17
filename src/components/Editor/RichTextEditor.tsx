import type { RichTextEditorProps } from '@/types';
import { DEFAULT_TOOLBAR } from '@/types';
import { EditorProvider } from './EditorProvider';
import { EditorWrapper } from './EditorWrapper';

/**
 * The public API component — the one consumers import.
 *
 * ```tsx
 * import { RichTextEditor } from 'rich-text-editor-ndevu';
 *
 * <RichTextEditor
 *   value={html}
 *   onChange={setHtml}
 *   theme="dark"
 * />
 * ```
 */
export function RichTextEditor(props: RichTextEditorProps) {
  const {
    value = '',
    onChange,
    placeholder = 'Write something...',
    readOnly = false,
    toolbar = DEFAULT_TOOLBAR,
    theme = 'light',
    minHeight = '200px',
    maxHeight,
    className,
    style,
    ariaLabel,
    pluginRegistry,
    onFocus,
    onBlur,
  } = props;

  return (
    <EditorProvider
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      theme={theme}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      pluginRegistry={pluginRegistry}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <EditorWrapper
        toolbar={toolbar}
        placeholder={placeholder}
        minHeight={minHeight}
        maxHeight={maxHeight}
        className={className}
        style={style}
      />
    </EditorProvider>
  );
}
