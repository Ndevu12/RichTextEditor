import type { Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

/**
 * Shared lowlight instance (highlight.js-based, common language bundle).
 *
 * Includes: JavaScript, TypeScript, Python, HTML, CSS, JSON, Bash, XML,
 * Markdown, SQL, YAML, C, C++, Java, Go, Rust, Ruby, PHP, and more.
 */
const lowlight = createLowlight(common);

/**
 * Assemble the base Tiptap extension stack.
 *
 * Starts with StarterKit which provides: bold, italic, strike, headings,
 * bullet list, ordered list, blockquote, code, history,
 * hard break, horizontal rule, document, paragraph, text.
 *
 * Additional extensions:
 * - Phase 9:  Underline (not in StarterKit)
 * - Phase 11: Link (autolink, paste-link, opens in new tab)
 * - Phase 12: Image (block-level, base64 allowed, lazy loading)
 * - Phase 13: CodeBlockLowlight (replaces StarterKit's codeBlock)
 * - Phase 14: Custom history config
 */
export function createExtensions(): Extensions {
  return [
    StarterKit.configure({
      // Phase 13 — disable StarterKit's codeBlock, replaced by CodeBlockLowlight
      codeBlock: false,
      // history: false,      // Phase 14 — custom history config
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        loading: 'lazy',
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'plaintext',
    }),
  ];
}

/** Expose lowlight instance for language registration by consumers. */
export { lowlight };
