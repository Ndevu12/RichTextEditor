import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Theme } from 'rich-text-editor-ndevu';
import { DEFAULT_TOOLBAR } from 'rich-text-editor-ndevu';
import { Header, HtmlOutput } from '../src/components';
import { INITIAL_CONTENT } from '../src/utils/constants';

/**
 * Dynamic import with ssr: false — contentEditable doesn't work server-side.
 * The loading fallback prevents layout shift while the editor JS loads.
 */
const RichTextEditor = dynamic(
  () => import('rich-text-editor-ndevu').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="editor-loading">Loading editor…</div>,
  },
);

export default function HomePage() {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  return (
    <div className="app" data-theme={theme}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="main">
        <RichTextEditor
          value={content}
          onChange={setContent}
          theme={theme}
          toolbar={DEFAULT_TOOLBAR}
          placeholder="Start writing…"
          minHeight="250px"
          ariaLabel="Next.js editor demo"
        />

        <HtmlOutput html={content} />
      </main>
    </div>
  );
}
