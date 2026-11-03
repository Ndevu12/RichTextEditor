import { toMarkdown } from '@/components/Content/MarkdownSerializer';
import { recognizeSeo } from '@/seo/recognize';
import { markdownToHtml } from './markdown';
import type { CompileOptions, CompiledDocument } from './types';

/**
 * Returns whether `source` already looks like HTML.
 */
export function looksLikeHtml(source: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(source);
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
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
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
