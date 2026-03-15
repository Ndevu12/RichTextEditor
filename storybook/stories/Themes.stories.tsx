import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '../../src/components/Editor';
import { DEFAULT_TOOLBAR } from '../../src/types';
import type { Theme } from '../../src/types';

const SAMPLE_HTML = `
<h2>Theme Preview</h2>
<p>This is <strong>bold</strong>, <em>italic</em>, and <u>underlined</u> text.</p>
<ul><li>List item one</li><li>List item two</li></ul>
<blockquote><p>A blockquote for visual contrast.</p></blockquote>
<pre><code class="language-typescript">const theme: Theme = 'light';</code></pre>
<p>A <a href="https://example.com">link</a> for color testing.</p>
`.trim();

const meta: Meta<typeof RichTextEditor> = {
  title: 'Theming/Themes',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Theme variations for the Rich Text Editor.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

// ── Controlled wrapper ───────────────────────────────────────

function ThemedEditor({ theme }: { theme: Theme }) {
  const [html, setHtml] = useState(SAMPLE_HTML);
  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      theme={theme}
      toolbar={DEFAULT_TOOLBAR}
      minHeight="200px"
    />
  );
}

// ── Stories ──────────────────────────────────────────────────

export const LightTheme: Story = {
  render: () => <ThemedEditor theme="light" />,
  name: 'Light Theme',
};

export const DarkTheme: Story = {
  render: () => (
    <div style={{ backgroundColor: '#1a1b26', padding: '24px', borderRadius: '8px' }}>
      <ThemedEditor theme="dark" />
    </div>
  ),
  name: 'Dark Theme',
};

export const SideBySide: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        <h3 style={{ marginTop: 0 }}>Light</h3>
        <ThemedEditor theme="light" />
      </div>
      <div
        style={{ backgroundColor: '#1a1b26', padding: '16px', borderRadius: '8px', color: '#c0caf5' }}
      >
        <h3 style={{ marginTop: 0 }}>Dark</h3>
        <ThemedEditor theme="dark" />
      </div>
    </div>
  ),
  name: 'Side by Side',
  parameters: { layout: 'fullscreen' },
};

export const ThemeToggle: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('light');
    const isDark = theme === 'dark';

    return (
      <div
        style={{
          backgroundColor: isDark ? '#1a1b26' : '#fff',
          padding: '24px',
          borderRadius: '8px',
          transition: 'background-color 0.2s',
        }}
      >
        <button
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          style={{
            marginBottom: '16px',
            padding: '8px 16px',
            borderRadius: '4px',
            border: `1px solid ${isDark ? '#444' : '#ccc'}`,
            backgroundColor: isDark ? '#24283b' : '#f5f5f5',
            color: isDark ? '#c0caf5' : '#1a1a1a',
            cursor: 'pointer',
          }}
        >
          Switch to {isDark ? 'Light' : 'Dark'} Theme
        </button>
        <ThemedEditor theme={theme} />
      </div>
    );
  },
  name: 'Theme Toggle',
};
