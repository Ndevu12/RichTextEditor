import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '../../src/components/Editor';
import { DEFAULT_TOOLBAR } from '../../src/types';
import type { RichTextEditorProps, ToolbarItem } from '../../src/types';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'inline-radio', options: ['light', 'dark'] },
    readOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
    minHeight: { control: 'text' },
    maxHeight: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  args: {
    value: '',
    theme: 'light',
    readOnly: false,
    placeholder: 'Write something...',
    minHeight: '200px',
  },
};

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

// ── Wrapper for controlled stories ───────────────────────────

function ControlledEditor(props: RichTextEditorProps) {
  const [value, setValue] = useState(props.value);
  return <RichTextEditor {...props} value={value} onChange={setValue} />;
}

// ── Stories ──────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => <ControlledEditor {...args} />,
};

export const WithInitialContent: Story = {
  render: (args) => <ControlledEditor {...args} />,
  args: {
    value: `
      <h2>Hello World</h2>
      <p>This is a <strong>rich text editor</strong> with <em>formatted</em> content.</p>
      <ul>
        <li>Bullet point one</li>
        <li>Bullet point two</li>
      </ul>
      <blockquote><p>A wise quote.</p></blockquote>
    `.trim(),
  },
};

const CUSTOM_TOOLBAR: ToolbarItem[] = ['bold', 'italic', 'underline', '|', 'link'];

export const CustomToolbar: Story = {
  render: (args) => <ControlledEditor {...args} />,
  args: {
    toolbar: CUSTOM_TOOLBAR,
  },
};

export const ReadOnly: Story = {
  render: (args) => <ControlledEditor {...args} />,
  args: {
    readOnly: true,
    value: '<p>This content is <strong>read-only</strong>. You cannot edit it.</p>',
  },
};

export const WithPlaceholder: Story = {
  render: (args) => <ControlledEditor {...args} />,
  args: {
    placeholder: 'Start typing your blog post here...',
    value: '',
  },
};

export const MinMaxHeight: Story = {
  render: (args) => <ControlledEditor {...args} />,
  args: {
    minHeight: '150px',
    maxHeight: '300px',
    value: `
      <h2>Scrollable Content</h2>
      <p>This editor has a constrained height. When content exceeds the max height, it becomes scrollable.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
    `.trim(),
  },
};

export const Controlled: Story = {
  render: () => {
    const [html, setHtml] = useState('<p>Type here and watch the output below.</p>');
    return (
      <div>
        <RichTextEditor value={html} onChange={setHtml} toolbar={DEFAULT_TOOLBAR} />
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f0f0f0',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          {html}
        </div>
      </div>
    );
  },
};

export const FullFeatured: Story = {
  render: (args) => <ControlledEditor {...args} />,
  args: {
    toolbar: DEFAULT_TOOLBAR,
    value: `
      <h1>Full Featured Editor</h1>
      <p>This editor demonstrates <strong>all</strong> <em>formatting</em> <u>options</u> including <s>strikethrough</s>.</p>
      <h2>Lists</h2>
      <ul>
        <li>Unordered item 1</li>
        <li>Unordered item 2</li>
      </ul>
      <ol>
        <li>Ordered item 1</li>
        <li>Ordered item 2</li>
      </ol>
      <h2>Special Blocks</h2>
      <blockquote><p>This is a blockquote.</p></blockquote>
      <p>Inline <code>code</code> and a code block:</p>
      <pre><code class="language-javascript">const greeting = "Hello, World!";
console.log(greeting);</code></pre>
      <h2>Links &amp; Images</h2>
      <p>Visit <a href="https://github.com">GitHub</a> for more.</p>
    `.trim(),
    minHeight: '300px',
  },
};
