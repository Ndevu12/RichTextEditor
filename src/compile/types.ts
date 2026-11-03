import type { SeoReport } from '@/seo/types';

export interface CompileOptions {
  /** Origin used when classifying links inside compiled Markdown. */
  siteOrigin?: string;
}

export interface CompiledDocument {
  html: string;
  markdown: string;
  text: string;
  seo: SeoReport;
}
