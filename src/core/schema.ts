import type { Extension, Extensions, Mark, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import { common, createLowlight } from 'lowlight';

/**
 * Shared lowlight instance (highlight.js-based, common language bundle).
 *
 * Includes: JavaScript, TypeScript, Python, HTML, CSS, JSON, Bash, XML,
 * Markdown, SQL, YAML, C, C++, Java, Go, Rust, Ruby, PHP, and more.
 */
const lowlight = createLowlight(common);

/**
 * Assemble the base Tiptap extension stack, optionally appending
 * extensions contributed by registered plugins.
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
export function createExtensions(pluginExtensions: (Extension | Mark | Node)[] = []): Extensions {
  return [
    StarterKit.configure({
      codeBlock: false,
      undoRedo: {
        depth: 100,
        newGroupDelay: 500,
      },
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
    Typography.configure({
      emDash: '\u2014',
      ellipsis: '\u2026',
      openDoubleQuote: '\u201c',
      closeDoubleQuote: '\u201d',
      openSingleQuote: '\u2018',
      closeSingleQuote: '\u2019',
      copyright: '\u00a9',
      trademark: '\u2122',
      servicemark: '\u2120',
      registeredTrademark: '\u00ae',
      plusMinus: '\u00b1',
      notEqual: '\u2260',
      oneHalf: '\u00bd',
      oneQuarter: '\u00bc',
      threeQuarters: '\u00be',
    }),
    ...pluginExtensions,
  ];
}

/** Expose lowlight instance for language registration by consumers. */
export { lowlight };
