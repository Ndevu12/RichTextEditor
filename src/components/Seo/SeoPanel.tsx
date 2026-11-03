import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditorStore } from '@/core/store';
import { recognizeSeo } from '@/seo/recognize';
import type { SeoMetadata, SeoOptions, SeoReport } from '@/seo/types';

export interface SeoPanelProps {
  options?: SeoOptions;
  onSeoChange?: (report: SeoReport) => void;
  readOnly?: boolean;
}

/**
 * Captures SEO metadata and shows what the document is recognized as.
 */
export function SeoPanel({ options, onSeoChange, readOnly = false }: SeoPanelProps) {
  const content = useEditorStore((state) => state.content);
  const storedOrigin = useEditorStore((state) => state.siteOrigin);
  const siteOrigin = options?.siteOrigin || storedOrigin;
  const [metadata, setMetadata] = useState<SeoMetadata>({
    title: options?.metadata?.title ?? '',
    description: options?.metadata?.description ?? '',
    slug: options?.metadata?.slug ?? '',
  });
  const onSeoChangeRef = useRef(onSeoChange);
  useEffect(() => {
    onSeoChangeRef.current = onSeoChange;
  }, [onSeoChange]);

  const report = useMemo(
    () =>
      recognizeSeo(content, {
        siteOrigin,
        metadata: {
          title: metadata.title || undefined,
          description: metadata.description || undefined,
          slug: metadata.slug || undefined,
        },
      }),
    [content, metadata.title, metadata.description, metadata.slug, siteOrigin],
  );

  const reportKey = [
    report.score,
    report.metadata.title,
    report.metadata.description,
    report.metadata.slug,
    report.internalLinkCount,
    report.externalLinkCount,
    report.findings.map((finding) => `${finding.id}:${finding.message}`).join('|'),
  ].join('~');

  useEffect(() => {
    onSeoChangeRef.current?.(report);
  }, [report, reportKey]);

  const title = metadata.title || report.metadata.title;
  const description = metadata.description || report.metadata.description;
  const slug = metadata.slug || report.metadata.slug;

  const update = (field: keyof SeoMetadata, value: string) => {
    setMetadata((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="rte-seo" aria-label="SEO">
      <div className="rte-seo__header">
        <h2 className="rte-seo__title">SEO</h2>
        <p className="rte-seo__score" data-score={report.score} aria-live="polite">
          Score {report.score}
        </p>
      </div>

      <label className="rte-seo__field">
        <span className="rte-seo__label">Title</span>
        <input
          className="rte-seo__input"
          value={title}
          disabled={readOnly}
          onChange={(event) => update('title', event.target.value)}
        />
      </label>

      <label className="rte-seo__field">
        <span className="rte-seo__label">Description</span>
        <textarea
          className="rte-seo__input rte-seo__input--area"
          value={description}
          disabled={readOnly}
          rows={3}
          onChange={(event) => update('description', event.target.value)}
        />
      </label>

      <label className="rte-seo__field">
        <span className="rte-seo__label">Slug</span>
        <input
          className="rte-seo__input"
          value={slug}
          disabled={readOnly}
          onChange={(event) => update('slug', event.target.value)}
        />
      </label>

      <p className="rte-seo__counts">
        {report.internalLinkCount} internal links, {report.externalLinkCount} external links,{' '}
        {report.wordCount} words
      </p>

      <ul className="rte-seo__findings">
        {report.findings.map((finding) => (
          <li key={finding.id} data-severity={finding.severity}>
            {finding.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
