import { describe, it, expect } from 'vitest';
import { toMarkdown } from '@/components/Content/MarkdownSerializer';

describe('toMarkdown', () => {
  it('returns empty string for empty input', () => {
    expect(toMarkdown('')).toBe('');
  });

  it('returns empty string for empty paragraph', () => {
    expect(toMarkdown('<p></p>')).toBe('');
  });

  it('converts a paragraph to plain text', () => {
    expect(toMarkdown('<p>Hello world</p>')).toBe('Hello world');
  });

  it('converts bold to **', () => {
    expect(toMarkdown('<p><strong>bold</strong></p>')).toBe('**bold**');
  });

  it('converts italic to *', () => {
    expect(toMarkdown('<p><em>italic</em></p>')).toBe('*italic*');
  });

  it('converts headings to ATX style', () => {
    expect(toMarkdown('<h1>Title</h1>')).toBe('# Title');
    expect(toMarkdown('<h2>Subtitle</h2>')).toBe('## Subtitle');
  });

  it('converts bullet list with - marker', () => {
    const html = '<ul><li>one</li><li>two</li></ul>';
    const md = toMarkdown(html);
    expect(md).toContain('-   one');
    expect(md).toContain('-   two');
  });

  it('converts links to inline style', () => {
    const html = '<p><a href="https://example.com">link</a></p>';
    expect(toMarkdown(html)).toContain('[link](https://example.com)');
  });

  it('converts strikethrough (del) to ~~', () => {
    expect(toMarkdown('<p><del>deleted</del></p>')).toBe('~~deleted~~');
  });

  it('converts strikethrough (s tag) to ~~', () => {
    expect(toMarkdown('<p><s>struck</s></p>')).toBe('~~struck~~');
  });

  it('preserves underline as <u> HTML', () => {
    expect(toMarkdown('<p><u>underlined</u></p>')).toBe('<u>underlined</u>');
  });

  it('converts code blocks to fenced style', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    const md = toMarkdown(html);
    expect(md).toContain('```');
    expect(md).toContain('const x = 1;');
  });

  it('converts horizontal rules to ---', () => {
    expect(toMarkdown('<hr>')).toBe('---');
  });
});
