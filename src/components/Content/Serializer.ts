import { generateHTML } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
import { createExtensions } from '@/core/schema';

/**
 * Serialize a Tiptap JSON document to an HTML string.
 */
export function serializeHTML(doc: JSONContent): string {
  return generateHTML(doc, createExtensions());
}
