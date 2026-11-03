import { describe, it, expect } from 'vitest';
import { attributesForHref, isInternalHref } from '@/seo/links';
import { recognizeSeo } from '@/seo/recognize';

const TITLE = 'Shipping notes for the editor release';
const DESCRIPTION = 'A'.repeat(120);

function page(href: string, text: string): string {
  return `<h1>${TITLE}</h1><p>${DESCRIPTION}</p><img src="/cover.png" alt="Cover"><p><a href="${href}">${text}</a></p>`;
}

describe('recognizeSeo', () => {
  it('scores a descriptive internal link higher than an external link by 15', () => {
    const metadata = { title: TITLE, description: DESCRIPTION, slug: '/shipping-notes' };
    const internal = recognizeSeo(page('/guides/markdown', 'Markdown guide'), { metadata });
    const external = recognizeSeo(page('https://example.com/guides/markdown', 'Markdown guide'), {
      metadata,
    });

    expect(internal.score).toBe(100);
    expect(external.score).toBe(85);
    expect(internal.score - external.score).toBe(15);
    expect(internal.findings.find((finding) => finding.id === 'links')?.severity).toBe('good');
  });

  it('treats a same-origin absolute URL as internal when siteOrigin is set', () => {
    const report = recognizeSeo('<p><a href="https://example.com/docs">Docs page</a></p>', {
      siteOrigin: 'https://example.com',
      metadata: { title: TITLE, description: DESCRIPTION, slug: '/docs' },
    });
    expect(report.internalLinkCount).toBe(1);
    expect(report.externalLinkCount).toBe(0);
  });

  it('fills an empty title from the H1', () => {
    const report = recognizeSeo(`<h1>${TITLE}</h1><p>${DESCRIPTION}</p>`);
    expect(report.metadata.title).toBe(TITLE);
    expect(report.metadata.slug).toBe('/shipping-notes-for-the-editor-release');
  });
});

describe('attributesForHref', () => {
  it('lets internal links be followed and marks external links nofollow', () => {
    expect(isInternalHref('/docs/guide')).toBe(true);
    expect(attributesForHref('/docs/guide')).toEqual({ rel: 'noopener', target: '_self' });
    expect(attributesForHref('https://example.com').rel).toContain('nofollow');
    expect(attributesForHref('https://example.com').target).toBe('_blank');
  });
});
