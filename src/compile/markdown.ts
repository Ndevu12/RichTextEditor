import { attributesForHref } from '@/seo/links';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text: string, siteOrigin?: string): string {
  const codes: string[] = [];
  let source = text.replace(/`([^`]+)`/g, (_match, code: string) => {
    codes.push(`<code>${escapeHtml(code)}</code>`);
    return `\uE000${codes.length - 1}\uE001`;
  });

  source = escapeHtml(source);
  source = source.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  source = source.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  source = source.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  source = source.replace(/_([^_]+)_/g, '<em>$1</em>');
  source = source.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  source = source.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_match, alt: string, src: string) => {
    return `<img src="${src}" alt="${alt}">`;
  });
  source = source.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) => {
    const attrs = attributesForHref(href, siteOrigin);
    return `<a href="${href}" rel="${attrs.rel}" target="${attrs.target}">${label}</a>`;
  });
  source = source.replace(
    /\uE000(\d+)\uE001/g,
    (_match, index: string) => codes[Number(index)] ?? '',
  );
  return source;
}

function isBlockStart(line: string): boolean {
  return (
    /^#{1,6}\s+/.test(line) ||
    line.startsWith('```') ||
    /^>\s?/.test(line) ||
    /^[-*]\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^---+$/.test(line.trim())
  );
}

/**
 * Compiles a Markdown subset into HTML.
 */
export function markdownToHtml(markdown: string, siteOrigin?: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === '') {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const className = language ? ` class="language-${escapeHtml(language)}"` : '';
      blocks.push(`<pre><code${className}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${renderInline(heading[2], siteOrigin)}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(`<blockquote><p>${renderInline(quote.join(' '), siteOrigin)}</p></blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(
          `<li><p>${renderInline(lines[index].replace(/^[-*]\s+/, ''), siteOrigin)}</p></li>`,
        );
        index += 1;
      }
      blocks.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(
          `<li><p>${renderInline(lines[index].replace(/^\d+\.\s+/, ''), siteOrigin)}</p></li>`,
        );
        index += 1;
      }
      blocks.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push('<hr>');
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() !== '' && !isBlockStart(lines[index])) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(`<p>${renderInline(paragraph.join(' '), siteOrigin)}</p>`);
  }

  return blocks.join('') || '<p></p>';
}
