import type { Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

/**
 * Assemble the base Tiptap extension stack.
 *
 * Starts with StarterKit which provides: bold, italic, strike, headings,
 * bullet list, ordered list, blockquote, code, code block, history,
 * hard break, horizontal rule, document, paragraph, text.
 *
 * Individual plugin phases will add or override extensions:
 * - Phase 9:  Underline extension
 * - Phase 11: Link extension
 * - Phase 12: Image extension
 * - Phase 13: CodeBlockLowlight (replaces StarterKit's codeBlock)
 * - Phase 14: Custom history config
 */
export function createExtensions(): Extensions {
  return [
    StarterKit.configure({
      // Overrides will be applied in later phases:
      // history: false,      // Phase 14 — custom history config
      // codeBlock: false,    // Phase 13 — replaced by code-block-lowlight
    }),
  ];
}
