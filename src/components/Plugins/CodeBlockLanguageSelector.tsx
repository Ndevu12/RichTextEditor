import { useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import { SUPPORTED_LANGUAGES, getCodeBlockLanguage, setCodeBlockLanguage } from './CodeBlockPlugin';

export interface CodeBlockLanguageSelectorProps {
  /** The Tiptap editor instance */
  editor: Editor | null;
  /** Additional CSS class name */
  className?: string;
  /** Accessible label (defaults to "Code block language") */
  ariaLabel?: string;
}

/**
 * Dropdown `<select>` for choosing the language of the active code block.
 *
 * Renders as disabled when the cursor is not inside a code block or the
 * editor is unavailable. Designed to be placed in a toolbar or alongside
 * the code block in the editor chrome.
 */
export function CodeBlockLanguageSelector({
  editor,
  className,
  ariaLabel = 'Code block language',
}: CodeBlockLanguageSelectorProps) {
  const currentLanguage = editor ? getCodeBlockLanguage(editor) : null;
  const isInCodeBlock = currentLanguage !== null;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (editor) {
        setCodeBlockLanguage(editor, e.target.value);
      }
    },
    [editor],
  );

  return (
    <select
      className={['rte-language-selector', className].filter(Boolean).join(' ')}
      value={currentLanguage ?? 'plaintext'}
      onChange={handleChange}
      disabled={!editor || !isInCodeBlock}
      aria-label={ariaLabel}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
