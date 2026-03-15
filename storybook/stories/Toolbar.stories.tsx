import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '../../src/components/Editor';
import type { ToolbarItem } from '../../src/types';
import { DEFAULT_TOOLBAR } from '../../src/types';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Components/Toolbar',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toolbar variations for the Rich Text Editor. Each story demonstrates a different toolbar configuration.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

// ── Controlled wrapper ───────────────────────────────────────

function ToolbarDemo({ toolbar, ...rest }: { toolbar: ToolbarItem[] } & Record<string, unknown>) {
  const [html, setHtml] = useState('<p>Type here to test the toolbar.</p>');
  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      toolbar={toolbar}
      minHeight="150px"
      {...rest}
    />
  );
}

// ── Stories ──────────────────────────────────────────────────

export const AllItems: Story = {
  render: () => <ToolbarDemo toolbar={DEFAULT_TOOLBAR} />,
  name: 'All Items',
};

const MINIMAL: ToolbarItem[] = ['bold', 'italic', 'underline'];

export const Minimal: Story = {
  render: () => <ToolbarDemo toolbar={MINIMAL} />,
  name: 'Minimal',
};

const WITH_HEADINGS: ToolbarItem[] = [
  'heading1',
  'heading2',
  'heading3',
  '|',
  'bold',
  'italic',
  'underline',
];

export const WithHeadings: Story = {
  render: () => <ToolbarDemo toolbar={WITH_HEADINGS} />,
  name: 'With Headings',
};

export const DisabledState: Story = {
  render: () => (
    <ToolbarDemo
      toolbar={DEFAULT_TOOLBAR}
      readOnly
    />
  ),
  name: 'Disabled (Read-only)',
};

const CUSTOM_GROUPS: ToolbarItem[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  '|',
  'heading1',
  'heading2',
  '|',
  'link',
  'image',
  '|',
  'undo',
  'redo',
];

export const CustomGroups: Story = {
  render: () => <ToolbarDemo toolbar={CUSTOM_GROUPS} />,
  name: 'Custom Groups',
};
