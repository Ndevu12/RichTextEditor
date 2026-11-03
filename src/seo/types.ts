export interface SeoMetadata {
  title: string;
  description: string;
  /** Canonical path, for example `/guides/editor`. */
  slug: string;
}

export interface SeoOptions {
  /** Origin used to treat absolute URLs on this site as internal. */
  siteOrigin?: string;
  /** Captured metadata. Empty fields are filled from the document. */
  metadata?: Partial<SeoMetadata>;
}

export interface SeoLink {
  href: string;
  text: string;
  internal: boolean;
  descriptive: boolean;
}

export interface SeoImage {
  src: string;
  alt: string;
  missingAlt: boolean;
}

export interface SeoHeading {
  level: number;
  text: string;
}

export type SeoFindingSeverity = 'good' | 'warn' | 'bad';

export interface SeoFinding {
  id: 'title' | 'description' | 'h1' | 'headings' | 'images' | 'links';
  severity: SeoFindingSeverity;
  message: string;
}

export interface SeoReport {
  metadata: SeoMetadata;
  wordCount: number;
  headings: SeoHeading[];
  links: SeoLink[];
  images: SeoImage[];
  internalLinkCount: number;
  externalLinkCount: number;
  /** 0–100. Descriptive internal links raise it. */
  score: number;
  findings: SeoFinding[];
}
