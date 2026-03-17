import { useEditorStore } from '@/core/store';
import type { PreviewMode } from '@/types';

const MODES: { value: PreviewMode; label: string }[] = [
  { value: 'none', label: 'Editor' },
  { value: 'html', label: 'HTML' },
  { value: 'markdown', label: 'MD' },
];

/**
 * Segmented toggle that lets users switch between editor-only view
 * and live HTML or Markdown preview.
 */
export function PreviewToggle() {
  const previewMode = useEditorStore((s) => s.previewMode);
  const setPreviewMode = useEditorStore((s) => s.setPreviewMode);

  return (
    <div className="rte-preview-toggle" role="radiogroup" aria-label="Preview mode">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={previewMode === value}
          className={`rte-preview-toggle__btn${previewMode === value ? ' rte-preview-toggle__btn--active' : ''}`}
          onClick={() => setPreviewMode(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
