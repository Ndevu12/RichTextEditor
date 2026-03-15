import { useState, useCallback } from 'react';
import { RichTextEditor, DEFAULT_TOOLBAR } from 'rich-text-editor-ndevu';
import type { Theme } from 'rich-text-editor-ndevu';
import { Header, Preview, HtmlOutput } from './components';
import { INITIAL_CONTENT } from './utils/constants';
import './styles/app.css';

export default function App() {
  const [title, setTitle] = useState('Untitled Post');
  const [body, setBody] = useState(INITIAL_CONTENT);
  const [theme, setTheme] = useState<Theme>('light');
  const [showPreview, setShowPreview] = useState(false);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);
  const togglePreview = useCallback(() => setShowPreview((p) => !p), []);

  const handleSave = useCallback(() => {
    const payload = { title, body, savedAt: new Date().toISOString() };
    // eslint-disable-next-line no-console
    console.log('[Save]', payload);
    alert('Saved! Check the console for the payload.');
  }, [title, body]);

  return (
    <div className="app" data-theme={theme}>
      <Header
        theme={theme}
        showPreview={showPreview}
        onToggleTheme={toggleTheme}
        onTogglePreview={togglePreview}
        onSave={handleSave}
      />

      <main className="main">
        <input
          className="title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title…"
        />

        {showPreview ? (
          <Preview title={title} body={body} />
        ) : (
          <RichTextEditor
            value={body}
            onChange={setBody}
            theme={theme}
            toolbar={DEFAULT_TOOLBAR}
            placeholder="Write your blog post…"
            minHeight="300px"
            ariaLabel="Blog post body"
          />
        )}

        <HtmlOutput html={body} />
      </main>
    </div>
  );
}
