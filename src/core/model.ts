import { generateHTML, generateJSON } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
import { createExtensions } from './schema';

/**
 * Convert a Tiptap JSON document to an HTML string.
 */
export function toHTML(doc: JSONContent): string {
  return generateHTML(doc, createExtensions());
}

/**
 * Convert an HTML string to a Tiptap JSON document.
 */
export function fromHTML(html: string): Record<string, unknown> {
  return generateJSON(html, createExtensions());
}

/**
 * Create an empty document as an HTML string.
 */
export function createEmptyDoc(): string {
  return '<p></p>';
}

/**
 * Check if the given HTML content is effectively empty.
 * Strips all tags and checks whether any visible text remains.
 */
export function isContentEmpty(html: string): boolean {
  const stripped = html.replace(/<[^>]*>/g, '').trim();
  return stripped.length === 0;
}
