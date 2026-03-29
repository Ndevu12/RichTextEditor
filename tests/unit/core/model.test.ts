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

    it('returns false when < is unclosed and there is visible text after it', () => {
      expect(isContentEmpty('< world')).toBe(false);
    });

    it('returns false for a bare unclosed tag (no closing >)', () => {
      expect(isContentEmpty('<foo')).toBe(false);
    });

    it('returns true for paragraph with only HTML ASCII whitespace between tags', () => {
      expect(isContentEmpty('<p>\n\t\r\f </p>')).toBe(true);
    });

    it('returns true for a string with no tags that is only whitespace', () => {
      expect(isContentEmpty('   \n  ')).toBe(true);
    });
  });
});
