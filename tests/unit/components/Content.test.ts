import { describe, it, expect } from 'vitest';
import { parseHTML } from '@/components/Content/Parser';
import { serializeHTML } from '@/components/Content/Serializer';

describe('Parser', () => {
  it('parses HTML into a Tiptap JSON document', () => {
    const result = parseHTML('<p>Hello <strong>World</strong></p>');
    expect(result.type).toBe('doc');
    expect(result.content).toBeDefined();
    expect(result.content!.length).toBeGreaterThan(0);
  });

  it('parses empty HTML', () => {
    const result = parseHTML('');
    expect(result.type).toBe('doc');
  });
});

describe('Serializer', () => {
  it('serializes a JSON document to HTML', () => {
    const doc = {
      type: 'doc' as const,
      content: [
        {
          type: 'paragraph' as const,
          content: [{ type: 'text' as const, text: 'Hello' }],
        },
      ],
    };
    expect(serializeHTML(doc)).toContain('<p>Hello</p>');
  });
});
