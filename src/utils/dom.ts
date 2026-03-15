/**
 * DOM utility helpers.
 *
 * Provides HTML sanitization for pasted content, selection positioning,
 * focus management for dialogs, and element visibility checks.
 */

// ── Dangerous tags & attributes ──────────────────────────────
const DISALLOWED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'applet',
  'form',
  'input',
  'textarea',
  'select',
  'button',
]);

const EVENT_ATTR_RE = /^on/i;

const DANGEROUS_ATTRS = new Set([
  'srcdoc',
  'formaction',
  'xlink:href',
]);

// ── HTML Sanitization ────────────────────────────────────────

/**
 * Sanitize an HTML string by removing dangerous elements and attributes.
 *
 * Strips: `<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`,
 *         `<applet>`, `<form>`, form controls, event handlers (onclick, etc.),
 *         `javascript:` URIs
 *
 * Allows: all formatting tags, links, images, lists, headings, code, tables
 *
 * Uses DOMParser for robust cross-browser parsing.
 *
 * @param html - Raw HTML string (e.g. from clipboard paste)
 * @returns Sanitized HTML string safe for editor insertion
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  sanitizeNode(doc.body);

  return doc.body.innerHTML;
}

/**
 * Recursively sanitize a DOM node and its children.
 */
function sanitizeNode(node: Node): void {
  const toRemove: Node[] = [];

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];

    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      const tagName = el.tagName.toLowerCase();

      // Remove disallowed tags entirely
      if (DISALLOWED_TAGS.has(tagName)) {
        toRemove.push(child);
        continue;
      }

      // Remove dangerous attributes
      const attrsToRemove: string[] = [];
      for (let j = 0; j < el.attributes.length; j++) {
        const attr = el.attributes[j];
        const name = attr.name.toLowerCase();

        if (
          EVENT_ATTR_RE.test(name) ||
          DANGEROUS_ATTRS.has(name) ||
          isJavascriptURI(attr.value)
        ) {
          attrsToRemove.push(attr.name);
        }
      }
      for (const attrName of attrsToRemove) {
        el.removeAttribute(attrName);
      }

      // Recurse into allowed elements
      sanitizeNode(child);
    }
  }

  for (const child of toRemove) {
    node.removeChild(child);
  }
}

/**
 * Check if a string is a javascript: URI.
 */
function isJavascriptURI(value: string): boolean {
  return /^\s*javascript\s*:/i.test(value);
}

// ── Selection helpers ────────────────────────────────────────

/**
 * Get the bounding rectangle of the current browser selection.
 *
 * Useful for positioning floating toolbars or dialogs near the cursor.
 *
 * @returns DOMRect of the selection, or null if nothing is selected
 */
export function getSelectionRect(): DOMRect | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Collapsed selection at start of line can return a zero-width rect
  if (rect.width === 0 && rect.height === 0) return null;

  return rect;
}

// ── Focus management ─────────────────────────────────────────

/** Selector for focusable elements. */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus the first focusable element inside a container.
 *
 * @param container - DOM element to search within
 */
export function focusFirstFocusable(container: HTMLElement): void {
  const first = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  first?.focus();
}

/**
 * Set up focus trapping within a container element.
 *
 * Focus wraps from the last focusable element back to the first (and vice versa).
 * Returns a cleanup function to remove the event listener.
 *
 * @param container - DOM element to trap focus within
 * @returns Cleanup function to stop trapping
 */
export function trapFocus(container: HTMLElement): () => void {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  return () => container.removeEventListener('keydown', handleKeyDown);
}

// ── Visibility ───────────────────────────────────────────────

/**
 * Check if an element is visible in the viewport.
 *
 * An element is considered visible if it has non-zero dimensions
 * and is not hidden via CSS.
 *
 * @param el - Element to check
 * @returns true if the element is visible
 */
export function isElementVisible(el: HTMLElement): boolean {
  if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;

  const style = getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}
