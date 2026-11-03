import { escapeHTML } from '@/utils/string';

const GENERIC_ANCHORS = new Set([
  'click here',
  'here',
  'read more',
  'learn more',
  'link',
  'this',
  'more',
  'page',
]);

/**
 * Returns whether `href` points at the same site.
 */
export function isInternalHref(href: string, siteOrigin?: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith('#') || value.startsWith('?')) return true;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  if (!siteOrigin) return false;

  try {
    const origin = new URL(siteOrigin).origin;
    return new URL(value, origin).origin === origin;
  } catch {
    return false;
  }
}

/**
 * Returns whether anchor text names its destination.
 */
export function isDescriptiveAnchor(text: string): boolean {
  const normalized = text.replace(/\s+/g, ' ').trim().toLowerCase();
  if (normalized.length < 3) return false;
  if (GENERIC_ANCHORS.has(normalized)) return false;
  if (/^https?:\/\//.test(normalized)) return false;
  return true;
}

/**
 * Returns the `rel` and `target` that should be stored on `href`.
 * Internal links stay on this site and can pass equity. External links do not.
 */
export function attributesForHref(
  href: string,
  siteOrigin?: string,
): { rel: string; target: '_blank' | '_self' } {
  if (isInternalHref(href, siteOrigin)) {
    return { rel: 'noopener', target: '_self' };
  }
  return { rel: 'noopener noreferrer nofollow', target: '_blank' };
}

/**
 * Returns an anchor tag for `href` and `text`.
 */
export function linkMarkup(href: string, text: string, siteOrigin?: string): string {
  const attrs = attributesForHref(href, siteOrigin);
  return `<a href="${escapeHTML(href)}" rel="${attrs.rel}" target="${attrs.target}">${escapeHTML(text)}</a>`;
}
