import { describe, it, expect, vi } from 'vitest';
import { sanitizeHTML, isElementVisible, focusFirstFocusable, trapFocus, getSelectionRect } from '@/utils/dom';
import { isValidURL, escapeHTML, truncate, formatShortcut, isMac } from '@/utils/string';

// ═══════════════════════════════════════════════
// DOM Utilities
// ═══════════════════════════════════════════════

describe('sanitizeHTML', () => {
  it('strips <script> tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>';
    expect(sanitizeHTML(input)).not.toContain('<script');
    expect(sanitizeHTML(input)).toContain('<p>Hello</p>');
  });

  it('strips <style> tags', () => {
    const input = '<style>body{color:red}</style><p>OK</p>';
    expect(sanitizeHTML(input)).not.toContain('<style');
    expect(sanitizeHTML(input)).toContain('<p>OK</p>');
  });

  it('strips <iframe> tags', () => {
    const input = '<p>Content</p><iframe src="evil.com"></iframe>';
    expect(sanitizeHTML(input)).not.toContain('<iframe');
  });

  it('strips event handler attributes', () => {
    const input = '<p onclick="alert(1)" onmouseover="hack()">Click</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('onmouseover');
    expect(result).toContain('<p>');
  });

  it('strips javascript: URIs from href', () => {
    const input = '<a href="javascript:alert(1)">Link</a>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('javascript:');
  });

  it('preserves safe HTML tags', () => {
    const input = '<p><strong>Bold</strong> and <em>italic</em> and <a href="https://ok.com">link</a></p>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
    expect(result).toContain('<a');
    expect(result).toContain('href="https://ok.com"');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeHTML('')).toBe('');
  });
});

describe('isElementVisible', () => {
  it('returns false for a hidden element', () => {
    const el = document.createElement('div');
    el.style.display = 'none';
    document.body.appendChild(el);
    expect(isElementVisible(el)).toBe(false);
    el.remove();
  });

  it('returns true for a visible element', () => {
    const el = document.createElement('div');
    // jsdom sets offsetWidth/Height to 0 by default, so we need to override
    Object.defineProperty(el, 'offsetWidth', { value: 100 });
    Object.defineProperty(el, 'offsetHeight', { value: 50 });
    document.body.appendChild(el);
    expect(isElementVisible(el)).toBe(true);
    el.remove();
  });

  it('returns false for visibility:hidden', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'offsetWidth', { value: 100 });
    Object.defineProperty(el, 'offsetHeight', { value: 50 });
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    expect(isElementVisible(el)).toBe(false);
    el.remove();
  });

  it('returns false for opacity:0', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'offsetWidth', { value: 100 });
    Object.defineProperty(el, 'offsetHeight', { value: 50 });
    el.style.opacity = '0';
    document.body.appendChild(el);
    expect(isElementVisible(el)).toBe(false);
    el.remove();
  });
});

describe('focusFirstFocusable', () => {
  it('focuses the first focusable element inside a container', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'Click me';
    container.appendChild(button);
    document.body.appendChild(container);

    focusFirstFocusable(container);
    expect(document.activeElement).toBe(button);
    container.remove();
  });
});

describe('trapFocus', () => {
  it('returns a cleanup function', () => {
    const container = document.createElement('div');
    const btn = document.createElement('button');
    container.appendChild(btn);
    document.body.appendChild(container);

    const cleanup = trapFocus(container);
    expect(typeof cleanup).toBe('function');
    cleanup();
    container.remove();
  });

  it('traps Tab on the last element back to first', () => {
    const container = document.createElement('div');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    btn1.textContent = 'First';
    btn2.textContent = 'Last';
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);

    const cleanup = trapFocus(container);

    // Focus the last button
    btn2.focus();
    expect(document.activeElement).toBe(btn2);

    // Simulate Tab key
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(event);

    // Focus should wrap to the first button
    expect(document.activeElement).toBe(btn1);

    cleanup();
    container.remove();
  });

  it('traps Shift+Tab on the first element back to last', () => {
    const container = document.createElement('div');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    btn1.textContent = 'First';
    btn2.textContent = 'Last';
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);

    const cleanup = trapFocus(container);

    // Focus the first button
    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    // Simulate Shift+Tab
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(event);

    // Focus should wrap to the last button
    expect(document.activeElement).toBe(btn2);

    cleanup();
    container.remove();
  });
});

describe('getSelectionRect', () => {
  it('returns null when nothing is selected', () => {
    window.getSelection()?.removeAllRanges();
    expect(getSelectionRect()).toBeNull();
  });
});

describe('isValidURL', () => {
  it('accepts http and https URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true);
    expect(isValidURL('http://example.com/path?q=1')).toBe(true);
  });

  it('accepts mailto and tel URIs', () => {
    expect(isValidURL('mailto:user@example.com')).toBe(true);
    expect(isValidURL('tel:+1234567890')).toBe(true);
  });

  it('accepts relative paths and anchors', () => {
    expect(isValidURL('/about')).toBe(true);
    expect(isValidURL('#section')).toBe(true);
  });

  it('rejects empty strings and whitespace', () => {
    expect(isValidURL('')).toBe(false);
    expect(isValidURL('   ')).toBe(false);
  });

  it('rejects javascript: URIs', () => {
    expect(isValidURL('javascript:alert(1)')).toBe(false);
  });

  it('rejects random strings without protocol', () => {
    expect(isValidURL('not a url')).toBe(false);
  });

  it('accepts tel: with phone number (catch branch for non-URL parseable)', () => {
    // tel: URLs may fail URL constructor parsing — covers the catch branch
    expect(isValidURL('tel:12345')).toBe(true);
  });

  it('handles http URL with unusual but valid format', () => {
    expect(isValidURL('http://localhost:3000')).toBe(true);
  });

  it('handles mailto with invalid format via catch branch', () => {
    // mailto: prefix triggers URL constructor which may throw for some cases
    expect(isValidURL('mailto:user@example.com')).toBe(true);
  });
});

describe('escapeHTML', () => {
  it('escapes special characters', () => {
    expect(escapeHTML('<div class="a">&</div>')).toBe(
      '&lt;div class=&quot;a&quot;&gt;&amp;&lt;/div&gt;',
    );
  });

  it('escapes single quotes', () => {
    expect(escapeHTML("it's")).toBe('it&#x27;s');
  });

  it('returns empty string for empty input', () => {
    expect(escapeHTML('')).toBe('');
  });
});

describe('truncate', () => {
  it('returns original string if shorter than length', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('truncates and adds ellipsis when exceeding length', () => {
    expect(truncate('Hello, World!', 5)).toBe('He...');
  });

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('handles very short max length (<=3)', () => {
    expect(truncate('Hello, World!', 3)).toBe('Hel');
    expect(truncate('Hello, World!', 2)).toBe('He');
  });

  it('returns empty string for empty/null-ish input', () => {
    expect(truncate('', 5)).toBe('');
  });
});

describe('formatShortcut', () => {
  it('converts Mod+ to platform-specific modifier', () => {
    const result = formatShortcut('Mod+B');
    expect(result).toContain('B');
    expect(result).not.toContain('Mod+');
  });

  it('converts Shift+ to platform symbol', () => {
    const result = formatShortcut('Shift+Z');
    expect(result).toContain('Z');
  });

  it('handles Alt+ modifier', () => {
    const result = formatShortcut('Alt+X');
    expect(result).toContain('X');
  });

  it('handles complex shortcut Mod+Shift+Z', () => {
    const result = formatShortcut('Mod+Shift+Z');
    expect(result).toContain('Z');
    expect(result).not.toContain('Mod+');
  });
});

describe('isMac', () => {
  it('returns a boolean', () => {
    expect(typeof isMac()).toBe('boolean');
  });
});