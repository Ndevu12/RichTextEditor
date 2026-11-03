import { describe, it, expect } from 'vitest';
import { compileDocument, compileSource, looksLikeHtml } from '@/compile/compileDocument';

describe('compileDocument', () => {
  it('compiles Markdown into HTML and keeps internal links followable', () => {
    const compiled = compileDocument('# Title\n\nHello **world**\n\n[Markdown guide](/docs/guide)\n');

    expect(looksLikeHtml('# Title')).toBe(false);
    expect(compiled.html).toContain('<h1>Title</h1>');
    expect(compiled.html).toContain('<strong>world</strong>');
    expect(compiled.html).toContain('href="/docs/guide"');
    expect(compiled.html).not.toContain('nofollow');
    expect(compiled.text).toContain('Hello world');
    expect(compiled.seo.internalLinkCount).toBe(1);
  });

  it('marks a compiled external link nofollow', () => {
    const compiled = compileDocument('[Example](https://example.com)');
    expect(compiled.html).toContain('nofollow');
    expect(compiled.html).toContain('target="_blank"');
  });

  it('leaves HTML source unchanged', () => {
    const html = '<p>Already <strong>html</strong></p>';
    expect(looksLikeHtml(html)).toBe(true);
    expect(compileSource(html)).toBe(html);
    expect(compileDocument(html).html).toBe(html);
  });

  it('compiles a fenced code block and a list', () => {
    const compiled = compileDocument('```ts\nconst n = 1;\n```\n\n- One\n- Two\n');
    expect(compiled.html).toContain('<pre><code class="language-ts">');
    expect(compiled.html).toContain('const n = 1;');
    expect(compiled.html).toContain('<ul>');
    expect(compiled.html).toContain('<li><p>One</p></li>');
  });
});
