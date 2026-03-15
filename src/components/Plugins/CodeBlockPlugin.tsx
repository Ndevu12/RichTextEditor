/**
 * Code Block Plugin — helpers for code block operations.
 *
 * Uses @tiptap/extension-code-block-lowlight configured in schema.ts.
 * Lowlight (highlight.js-based) provides automatic language detection
 * and syntax highlighting out of the box.
 *
 * Input rules:
 * - Typing ``` (triple backtick) at the start of a line creates a code block
 * - Typing ```js (with language hint) creates a code block with that language
 *
 * Provides:
 * - getCodeBlockLanguage: read current code block's language attribute
 * - setCodeBlockLanguage: change the language on the active code block
 * - SUPPORTED_LANGUAGES: list of common language options for a selector UI
 */

import type { Editor } from '@tiptap/core';

/**
 * Common languages available via lowlight's `common` bundle.
 * Useful for building a language selector dropdown.
 */
export const SUPPORTED_LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'xml', label: 'XML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'yaml', label: 'YAML' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
] as const;

/**
 * Get the language attribute of the currently active code block.
 *
 * @returns The language string, or null if the cursor is not in a code block.
 */
export function getCodeBlockLanguage(editor: Editor): string | null {
  const { node } =
    editor.state.selection.$from.parent.type.name === 'codeBlock'
      ? { node: editor.state.selection.$from.parent }
      : { node: null };

  if (!node) return null;
  return (node.attrs as { language?: string }).language ?? null;
}

/**
 * Set the language attribute on the current code block.
 *
 * @param editor   - Tiptap editor instance
 * @param language - Language identifier (e.g. 'javascript', 'python')
 * @returns true if the command ran successfully
 */
export function setCodeBlockLanguage(editor: Editor, language: string): boolean {
  return editor.chain().focus().updateAttributes('codeBlock', { language }).run();
}
