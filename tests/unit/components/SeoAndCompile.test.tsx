import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { RichTextEditor } from '@/components/Editor/RichTextEditor';
import { useEditorStore } from '@/core/store';

afterEach(() => {
  cleanup();
  const editor = useEditorStore.getState().editor;
  editor?.destroy();
  useEditorStore.setState({
    editor: null,
    content: '',
    siteOrigin: '',
    openDialog: null,
  });
});

describe('RichTextEditor seo and compilation', () => {
  it('shows an SEO score for the document', async () => {
    render(
      <RichTextEditor
        value="<h1>Shipping notes for the editor release</h1><p>AAAA</p>"
        seo
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'SEO' })).toBeInTheDocument();
    });
    expect(screen.getByText(/Score \d+/)).toBeInTheDocument();
  });

  it('compiles Markdown into HTML and reports the compiled document', async () => {
    const onChange = vi.fn();
    const onCompile = vi.fn();

    render(
      <RichTextEditor
        value={'# Hello\n\nPlain **text**'}
        autoCompile
        onChange={onChange}
        onCompile={onCompile}
      />,
    );

    await waitFor(() => {
      expect(onCompile).toHaveBeenCalled();
    });

    const calls = onCompile.mock.calls;
    const compiled = calls[calls.length - 1]?.[0] as { html: string };
    expect(compiled.html).toContain('<h1>Hello</h1>');
    expect(compiled.html).toContain('<strong>text</strong>');
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining('<h1>Hello</h1>'));
  });
});
