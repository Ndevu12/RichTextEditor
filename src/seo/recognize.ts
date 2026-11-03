import { isDescriptiveAnchor, isInternalHref } from './links';
import type {
  SeoFinding,
  SeoHeading,
  SeoImage,
  SeoLink,
  SeoMetadata,
  SeoOptions,
  SeoReport,
} from './types';

function plain(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Returns a slug path derived from `title`.
 */
export function slugFromTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `/${slug}` : '';
}

function lengthPoints(
  length: number,
  idealMin: number,
  idealMax: number,
  okMin: number,
  okMax: number,
): number {
  if (length === 0) return 0;
  if (length >= idealMin && length <= idealMax) return 20;
  if (length >= okMin && length <= okMax) return 10;
  return 5;
}

/**
 * Builds title, description, and slug from `html`, keeping any captured fields.
 */
export function generateSeoMetadata(html: string, captured?: Partial<SeoMetadata>): SeoMetadata {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const generatedTitle = plain(doc.body.querySelector('h1, h2, h3')?.textContent);
  const generatedDescription = plain(doc.body.querySelector('p')?.textContent);
  const title = plain(captured?.title) || generatedTitle;
  const description = plain(captured?.description) || generatedDescription;
  const slug = plain(captured?.slug) || slugFromTitle(title);
  return { title, description, slug };
}

function collectHeadings(body: HTMLElement): SeoHeading[] {
  const headings: SeoHeading[] = [];
  body.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((node) => {
    const level = Number(node.tagName.slice(1));
    headings.push({ level, text: plain(node.textContent) });
  });
  return headings;
}

function collectLinks(body: HTMLElement, siteOrigin?: string): SeoLink[] {
  const links: SeoLink[] = [];
  body.querySelectorAll('a').forEach((node) => {
    const href = node.getAttribute('href') ?? '';
    if (!href) return;
    const text = plain(node.textContent);
    links.push({
      href,
      text,
      internal: isInternalHref(href, siteOrigin),
      descriptive: isDescriptiveAnchor(text),
    });
  });
  return links;
}

function collectImages(body: HTMLElement): SeoImage[] {
  const images: SeoImage[] = [];
  body.querySelectorAll('img').forEach((node) => {
    const alt = node.getAttribute('alt') ?? '';
    images.push({
      src: node.getAttribute('src') ?? '',
      alt,
      missingAlt: alt.trim().length === 0,
    });
  });
  return images;
}

/**
 * Scores `html` and reports what a search engine would recognize.
 */
export function recognizeSeo(html: string, options: SeoOptions = {}): SeoReport {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;
  const metadata = generateSeoMetadata(html, options.metadata);
  const headings = collectHeadings(body);
  const links = collectLinks(body, options.siteOrigin);
  const images = collectImages(body);
  const text = plain(body.textContent);
  const wordCount = text ? text.split(' ').length : 0;

  const h1Count = headings.filter((heading) => heading.level === 1).length;
  let previousLevel = 0;
  let headingSkip = false;
  for (const heading of headings) {
    if (previousLevel > 0 && heading.level > previousLevel + 1) headingSkip = true;
    previousLevel = heading.level;
  }

  const internalLinks = links.filter((link) => link.internal);
  const descriptiveInternal = internalLinks.filter((link) => link.descriptive);
  const titlePoints = lengthPoints(metadata.title.length, 30, 60, 15, 70);
  const descriptionPoints = lengthPoints(metadata.description.length, 110, 160, 50, 220);
  const h1Points = h1Count === 1 ? 15 : h1Count === 0 ? 0 : 5;
  const headingPoints = headingSkip ? 0 : 15;
  const imagePoints = images.some((image) => image.missingAlt) ? 0 : 15;
  let linkPoints = 8;
  if (descriptiveInternal.length > 0) linkPoints = 15;
  else if (links.length > 0 && internalLinks.length === 0) linkPoints = 0;

  const findings: SeoFinding[] = [];

  if (!metadata.title) {
    findings.push({ id: 'title', severity: 'bad', message: 'Add a title.' });
  } else if (titlePoints < 20) {
    findings.push({
      id: 'title',
      severity: 'warn',
      message: `Title is ${metadata.title.length} characters. Aim for 30–60.`,
    });
  }

  if (!metadata.description) {
    findings.push({ id: 'description', severity: 'bad', message: 'Add a description.' });
  } else if (descriptionPoints < 20) {
    findings.push({
      id: 'description',
      severity: 'warn',
      message: `Description is ${metadata.description.length} characters. Aim for 110–160.`,
    });
  }

  if (h1Count === 0) {
    findings.push({ id: 'h1', severity: 'bad', message: 'Add one H1.' });
  } else if (h1Count > 1) {
    findings.push({ id: 'h1', severity: 'warn', message: 'Use a single H1.' });
  }

  if (headingSkip) {
    findings.push({
      id: 'headings',
      severity: 'warn',
      message: 'Heading levels skip a rank.',
    });
  }

  const missingAlt = images.filter((image) => image.missingAlt).length;
  if (missingAlt > 0) {
    findings.push({
      id: 'images',
      severity: 'bad',
      message:
        missingAlt === 1
          ? '1 image is missing a description.'
          : `${missingAlt} images are missing a description.`,
    });
  }

  if (descriptiveInternal.length > 0) {
    findings.push({
      id: 'links',
      severity: 'good',
      message: 'Internal links use descriptive text.',
    });
  } else if (links.length > 0 && internalLinks.length === 0) {
    findings.push({
      id: 'links',
      severity: 'warn',
      message: 'Links leave the site. Add an internal link that names its page.',
    });
  } else if (internalLinks.length > 0) {
    findings.push({
      id: 'links',
      severity: 'warn',
      message: 'Internal link text is generic. Name the page it opens.',
    });
  } else {
    findings.push({ id: 'links', severity: 'warn', message: 'No links yet.' });
  }

  return {
    metadata,
    wordCount,
    headings,
    links,
    images,
    internalLinkCount: internalLinks.length,
    externalLinkCount: links.length - internalLinks.length,
    score: titlePoints + descriptionPoints + h1Points + headingPoints + imagePoints + linkPoints,
    findings,
  };
}
