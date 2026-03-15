import { generateJSON } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
import { createExtensions } from '@/core/schema';

/**
 * Parse an HTML string into a Tiptap JSON document.
 */
export function parseHTML(html: string): JSONContent {
  return generateJSON(html, createExtensions());
}
