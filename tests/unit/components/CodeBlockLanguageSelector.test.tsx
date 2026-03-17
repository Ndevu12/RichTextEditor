import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { CodeBlockLanguageSelector } from '@/components/Plugins/CodeBlockLanguageSelector';
import { SUPPORTED_LANGUAGES } from '@/components/Plugins/CodeBlockPlugin';
import { createEditor } from '@/core/engine';
import type { Editor } from '@tiptap/core';

afterEach(cleanup);

describe('CodeBlockLanguageSelector', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('renders a select element with aria-label', () => {
    render(<CodeBlockLanguageSelector editor={null} />);
    expect(screen.getByRole('combobox', { name: 'Code block language' })).toBeInTheDocument();
  });

  it('accepts a custom ariaLabel', () => {
    render(<CodeBlockLanguageSelector editor={null} ariaLabel="Pick language" />);
    expect(screen.getByRole('combobox', { name: 'Pick language' })).toBeInTheDocument();
  });

  it('renders all supported languages as options', () => {
    render(<CodeBlockLanguageSelector editor={null} />);
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    expect(options.length).toBe(SUPPORTED_LANGUAGES.length);
  });

  it('is disabled when editor is null', () => {
    render(<CodeBlockLanguageSelector editor={null} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('is disabled when cursor is not in a code block', () => {
    editor = createEditor({ content: '<p>Hello</p>' });
    render(<CodeBlockLanguageSelector editor={editor} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('is enabled when cursor is in a code block', () => {
    editor = createEditor({ content: '<pre><code class="language-javascript">const x = 1;</code></pre>' });
    // Move cursor into the code block
    editor.commands.focus('start');
    render(<CodeBlockLanguageSelector editor={editor} />);
    expect(screen.getByRole('combobox')).not.toBeDisabled();
  });

  it('shows the current language of the code block', () => {
    editor = createEditor({ content: '<pre><code class="language-python">pass</code></pre>' });
    editor.commands.focus('start');
    render(<CodeBlockLanguageSelector editor={editor} />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('python');
  });

  it('changes the language when a new option is selected', () => {
    editor = createEditor({ content: '<pre><code class="language-javascript">const x = 1;</code></pre>' });
    editor.commands.focus('start');
    render(<CodeBlockLanguageSelector editor={editor} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'typescript' } });

    // The editor's code block should now have the new language
    const html = editor.getHTML();
    expect(html).toContain('language-typescript');
  });

  it('applies custom className', () => {
    render(<CodeBlockLanguageSelector editor={null} className="my-selector" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('rte-language-selector');
    expect(select).toHaveClass('my-selector');
  });

  it('defaults to plaintext when code block has no language set', () => {
    render(<CodeBlockLanguageSelector editor={null} />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('plaintext');
  });
});
