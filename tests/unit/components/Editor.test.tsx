import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { RichTextEditor } from '@/components/Editor/RichTextEditor';
import { useEditorStore } from '@/core/store';

afterEach(() => {
  cleanup();
  // Reset the Zustand store between tests
  const { setEditor, setContent, setTheme, setReadOnly, setFocused, setOpenDialog } =
    useEditorStore.getState();
  const editor = useEditorStore.getState().editor;
  editor?.destroy();
  setEditor(null);
  setContent('');
  setTheme('light');
  setReadOnly(false);
  setFocused(false);
  setOpenDialog(null);
});

describe('RichTextEditor', () => {
  it('renders without crashing', async () => {
    const { container } = render(<RichTextEditor value="" />);
    await waitFor(() => {
      expect(container.querySelector('.rte-editor')).toBeInTheDocument();
    });
  });

  it('applies data-theme attribute', async () => {
    const { container } = render(<RichTextEditor value="" theme="dark" />);
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).toHaveAttribute('data-theme', 'dark');
    });
  });

  it('applies custom className', async () => {
    const { container } = render(<RichTextEditor value="" className="my-custom" />);
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).toHaveClass('my-custom');
    });
  });

  it('renders toolbar with role="toolbar"', async () => {
    render(<RichTextEditor value="" />);
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });
  });

  it('hides toolbar when readOnly is true', async () => {
    render(<RichTextEditor value="" readOnly />);
    await waitFor(() => {
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });
  });

  it('sets data-readonly when readOnly is true', async () => {
    const { container } = render(<RichTextEditor value="" readOnly />);
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).toHaveAttribute('data-readonly', 'true');
    });
  });

  it('calls onChange when content changes', async () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="" onChange={onChange} />);

    // Wait for editor to initialize, then set content via store
    await waitFor(() => {
      expect(useEditorStore.getState().editor).not.toBeNull();
    });

    const editor = useEditorStore.getState().editor!;
    editor.commands.setContent('<p>New content</p>');

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('initializes editor in the Zustand store', async () => {
    render(<RichTextEditor value="<p>Hello</p>" />);

    await waitFor(() => {
      const editor = useEditorStore.getState().editor;
      expect(editor).not.toBeNull();
    });
  });
});
