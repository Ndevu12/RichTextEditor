import { useState, useCallback } from 'react';
import { RichTextEditor, DEFAULT_TOOLBAR } from 'rich-text-editor-ndevu';
import type { Theme, ToolbarItem } from 'rich-text-editor-ndevu';

// ── Toolbar presets ──────────────────────────────────────────

const TOOLBAR_PRESETS: Record<string, ToolbarItem[]> = {
  full: DEFAULT_TOOLBAR,
  minimal: ['bold', 'italic', 'underline', '|', 'link'],
  writing: [
    'bold',
    'italic',
    'underline',
    'strike',
    '|',
    'heading1',
    'heading2',
    'heading3',
    '|',
    'bulletList',
    'orderedList',
    'blockquote',
    '|',
    'link',
    '|',
    'undo',
    'redo',
  ],
  code: [
    'bold',
    'italic',
    'code',
    'codeBlock',
    '|',
    'bulletList',
    'orderedList',
    '|',
    'link',
    'image',
    '|',
    'undo',
    'redo',
  ],
};

const PRESET_LABELS: Record<string, string> = {
  full: 'Full (all items)',
  minimal: 'Minimal (bold, italic, underline, link)',
  writing: 'Writing (text + lists + link)',
  code: 'Code-focused (code + basic)',
};

// ── Sample content ───────────────────────────────────────────

const SAMPLE_HTML = `
<h2>Welcome to the Playground</h2>
<p>This is a <strong>rich text editor</strong> built with <em>Tiptap</em> and <u>React</u>.</p>
<ul>
  <li>Bold, italic, underline, and <s>strikethrough</s></li>
  <li>Links: <a href="https://github.com/Ndevu12/RichTextEditor">GitHub Repo</a></li>
  <li>Code: <code>console.log('hello')</code></li>
</ul>
<blockquote><p>Blockquote for emphasis</p></blockquote>
<pre><code class="language-typescript">function greet(name: string): string {
  return \`Hello, \${name}!\`;
}</code></pre>
<p>Try editing, toggling themes, and switching toolbar presets!</p>
`.trim();

// ── App ──────────────────────────────────────────────────────

export function App() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [theme, setTheme] = useState<Theme>('light');
  const [readOnly, setReadOnly] = useState(false);
  const [preset, setPreset] = useState('full');
  const [showHTML, setShowHTML] = useState(true);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#1a1b26' : '#f5f5f5',
        color: isDark ? '#c0caf5' : '#1a1a1a',
        transition: 'background-color 0.2s, color 0.2s',
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <header
        style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${isDark ? '#2f3348' : '#ddd'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          Rich Text Editor — Playground
        </h1>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Toolbar preset selector */}
          <label
            htmlFor="preset-select"
            style={{ fontSize: '0.85rem', fontWeight: 500 }}
          >
            Toolbar:
          </label>
          <select
            id="preset-select"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#444' : '#ccc'}`,
              backgroundColor: isDark ? '#24283b' : '#fff',
              color: 'inherit',
              fontSize: '0.85rem',
            }}
          >
            {Object.entries(PRESET_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#444' : '#ccc'}`,
              backgroundColor: isDark ? '#24283b' : '#fff',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Read-only toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
            />
            Read-only
          </label>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {/* Editor */}
        <section style={{ marginBottom: '24px' }}>
          <RichTextEditor
            value={html}
            onChange={setHtml}
            theme={theme}
            readOnly={readOnly}
            toolbar={TOOLBAR_PRESETS[preset]}
            placeholder="Start writing..."
            minHeight="250px"
            maxHeight="500px"
            ariaLabel="Playground editor"
          />
        </section>

        {/* ── Output panel toggle ───────────────────────── */}
        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={() => setShowHTML((v) => !v)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: `1px solid ${isDark ? '#444' : '#ccc'}`,
              backgroundColor: isDark ? '#24283b' : '#fff',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {showHTML ? 'Hide' : 'Show'} HTML Output
          </button>
        </div>

        {/* ── HTML output ───────────────────────────────── */}
        {showHTML && (
          <section>
            <h2 style={{ fontSize: '1rem', marginBottom: '8px' }}>HTML Output</h2>
            <pre
              style={{
                backgroundColor: isDark ? '#24283b' : '#fff',
                border: `1px solid ${isDark ? '#2f3348' : '#ddd'}`,
                borderRadius: '6px',
                padding: '16px',
                overflow: 'auto',
                maxHeight: '300px',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {html}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}
