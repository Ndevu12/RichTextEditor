import { toMarkdown } from '@/components/Content/MarkdownSerializer';
import { recognizeSeo } from '@/seo/recognize';
import { markdownToHtml } from './markdown';
import type { CompileOptions, CompiledDocument } from './types';

function isAsciiLetter(char: string | undefined): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

/**
 * Returns whether `source` already looks like HTML.
 */
export function looksLikeHtml(source: string): boolean {
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] !== '<') continue;
    const nameIndex = source[i + 1] === '/' ? i + 2 : i + 1;
    if (!isAsciiLetter(source[nameIndex])) continue;
    return source.indexOf('>', nameIndex + 1) !== -1;
  }
  return false;
}

/**
 * Returns editor HTML for `source`. Markdown and plain text are compiled.
 * HTML is returned unchanged. Empty input stays empty.
 */
export function compileSource(source: string, options: CompileOptions = {}): string {
  if (!source.trim() || looksLikeHtml(source)) return source;
  return markdownToHtml(source, options.siteOrigin);
}

function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Compiles `source` into HTML, Markdown, plain text, and an SEO report.
 */
export function compileDocument(source: string, options: CompileOptions = {}): CompiledDocument {
  const html = compileSource(source, options);
  const markdown = looksLikeHtml(source) ? toMarkdown(html) : source.trim();
  return {
    html,
    markdown,
    text: htmlToText(html),
    seo: recognizeSeo(html, { siteOrigin: options.siteOrigin }),
  };
}
