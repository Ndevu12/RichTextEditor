/**
 * String utility helpers.
 *
 * Provides URL validation, HTML escaping, text truncation,
 * platform detection, and keyboard shortcut formatting.
 */

// ── URL Validation ───────────────────────────────────────────

/**
 * Validate that a string is a well-formed URL.
 *
 * Accepts http(s), mailto, tel, relative paths (/...), and anchors (#...).
 *
 * @param str - String to validate
 * @returns true if the string is a valid URL format
 */
export function isValidURL(str: string): boolean {
  if (!str || !str.trim()) return false;
  const trimmed = str.trim();

  // Relative paths and anchors
  if (/^(\/|#)/.test(trimmed)) return true;

  // Standard protocols
  if (/^(https?:\/\/|mailto:|tel:)/.test(trimmed)) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      // mailto: and tel: may not parse as URL, accept if they match the prefix
      return /^(mailto:|tel:)/.test(trimmed);
    }
  }

  return false;
}

// ── HTML Escaping ────────────────────────────────────────────

/** Map of characters to their HTML entity equivalents. */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const HTML_ESCAPE_RE = /[&<>"']/g;

/**
 * Escape special HTML characters for safe interpolation into HTML strings.
 *
 * @param str - Raw string
 * @returns Escaped string safe for HTML insertion
 */
export function escapeHTML(str: string): string {
  if (!str) return '';
  return str.replace(HTML_ESCAPE_RE, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

// ── Truncation ───────────────────────────────────────────────

/**
 * Truncate a string to a maximum length, appending an ellipsis if truncated.
 *
 * @param str    - String to truncate
 * @param length - Maximum length (including ellipsis)
 * @returns Truncated string
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str ?? '';
  if (length <= 3) return str.slice(0, length);
  return str.slice(0, length - 3) + '...';
}

// ── Platform Detection ───────────────────────────────────────

/**
 * Detect if the current platform is macOS.
 *
 * Uses `navigator.platform` (deprecated but widely supported) with
 * a fallback to `navigator.userAgentData` where available.
 *
 * @returns true on macOS/iOS
 */
export function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Modern API (Chromium-based browsers)
  const uaData = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData;
  if (uaData?.platform) {
    return /mac/i.test(uaData.platform);
  }

  // Legacy fallback
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

// ── Shortcut Formatting ──────────────────────────────────────

/**
 * Format a keyboard shortcut string for display.
 *
 * Replaces `Mod` with `⌘` on Mac or `Ctrl` on other platforms.
 * Replaces `+` separators with platform-appropriate formatting.
 *
 * @param key - Shortcut descriptor (e.g. 'Mod+B', 'Mod+Shift+Z')
 * @returns Formatted shortcut string (e.g. '⌘B', 'Ctrl+Shift+Z')
 *
 * @example
 * formatShortcut('Mod+B') // '⌘B' on Mac, 'Ctrl+B' on Windows
 * formatShortcut('Mod+Shift+Z') // '⌘⇧Z' on Mac, 'Ctrl+Shift+Z' on Windows
 */
export function formatShortcut(key: string): string {
  const mac = isMac();

  if (mac) {
    return key
      .replace(/Mod\+/g, '⌘')
      .replace(/Shift\+/g, '⇧')
      .replace(/Alt\+/g, '⌥')
      .replace(/\+/g, '');
  }

  return key.replace(/Mod\+/g, 'Ctrl+');
}
