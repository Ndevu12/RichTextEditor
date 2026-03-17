import { useMemo } from 'react';
import { useEditorStore } from '@/core/store';
import { toMarkdown } from '@/components/Content/MarkdownSerializer';
import type { PreviewMode } from '@/types';

export interface PreviewPanelProps {
  mode: PreviewMode;
}

function formatHTML(html: string): string {
  if (!html) return '';
  let formatted = '';
  let indent = 0;
  const tokens = html.split(/(<\/?[^>]+>)/g).filter(Boolean);

  for (const token of tokens) {
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted += `${'  '.repeat(indent)}${token}\n`;
    } else if (
      token.startsWith('<') &&
      !token.endsWith('/>') &&
      !token.startsWith('<br') &&
      !token.startsWith('<img') &&
      !token.startsWith('<hr')
    ) {
      formatted += `${'  '.repeat(indent)}${token}\n`;
      indent++;
    } else if (token.startsWith('<')) {
      formatted += `${'  '.repeat(indent)}${token}\n`;
    } else {
      const trimmed = token.trim();
      if (trimmed) {
        formatted += `${'  '.repeat(indent)}${trimmed}\n`;
      }
    }
  }

  return formatted.trim();
}

/**
 * Live preview panel that shows compiled HTML or Markdown output
 * in real-time as the user edits content.
 */
export function PreviewPanel({ mode }: PreviewPanelProps) {
  const content = useEditorStore((s) => s.content);

  const output = useMemo(() => {
    if (mode === 'html') return formatHTML(content);
    if (mode === 'markdown') return toMarkdown(content);
    return '';
  }, [content, mode]);

  if (mode === 'none') return null;

  return (
    <div
      className="rte-preview"
      role="region"
      aria-label={`${mode === 'html' ? 'HTML' : 'Markdown'} preview`}
    >
      <div className="rte-preview__header">
        <span className="rte-preview__label">{mode === 'html' ? 'HTML' : 'Markdown'}</span>
        <CopyButton text={output} />
      </div>
      <pre className="rte-preview__code">
        <code>
          {output || <span className="rte-preview__empty">Start typing to see output...</span>}
        </code>
      </pre>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  return (
    <button
      type="button"
      className="rte-preview__copy"
      onClick={handleCopy}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
      </svg>
    </button>
  );
}
