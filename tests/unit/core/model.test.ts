import { describe, it, expect } from 'vitest';
import { toHTML, fromHTML, createEmptyDoc, isContentEmpty } from '@/core/model';

describe('model', () => {
  describe('toHTML', () => {
    it('converts a JSON document to HTML', () => {
      const doc = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      };
      expect(toHTML(doc)).toContain('<p>Hello</p>');
    });
  });

  describe('fromHTML', () => {
    it('converts HTML to a JSON document', () => {
      const result = fromHTML('<p>World</p>');
      expect(result.type).toBe('doc');
      expect(result.content).toBeDefined();
    });
  });

  describe('createEmptyDoc', () => {
    it('returns an empty paragraph HTML string', () => {
      expect(createEmptyDoc()).toBe('<p></p>');
    });
  });

  describe('isContentEmpty', () => {
    it('returns true for empty paragraph', () => {
      expect(isContentEmpty('<p></p>')).toBe(true);
    });

    it('returns true for whitespace-only content', () => {
      expect(isContentEmpty('<p>  </p>')).toBe(true);
    });

    it('returns false for non-empty content', () => {
      expect(isContentEmpty('<p>Hello</p>')).toBe(false);
    });

    it('returns true for empty string', () => {
      expect(isContentEmpty('')).toBe(true);
    });
  });
});
