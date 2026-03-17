import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { EditorProvider } from '@/components/Editor/EditorProvider';
import { EditorWrapper } from '@/components/Editor/EditorWrapper';
import { useEditorStore } from '@/core/store';
import { DEFAULT_TOOLBAR } from '@/types';

afterEach(() => {
  cleanup();
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

function renderWrapper(
  wrapperProps: Partial<React.ComponentProps<typeof EditorWrapper>> = {},
  providerProps: Partial<React.ComponentProps<typeof EditorProvider>> = {},
) {
  return render(
    <EditorProvider {...providerProps}>
      <EditorWrapper toolbar={DEFAULT_TOOLBAR} {...wrapperProps} />
    </EditorProvider>,
  );
}

describe('EditorWrapper', () => {
  it('renders with the rte-editor class', async () => {
    const { container } = renderWrapper();
    await waitFor(() => {
      expect(container.querySelector('.rte-editor')).toBeInTheDocument();
    });
  });

  it('applies data-theme from the store', async () => {
    const { container } = renderWrapper({}, { theme: 'dark' });
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).toHaveAttribute('data-theme', 'dark');
    });
  });

  it('renders the toolbar when not readOnly', async () => {
    renderWrapper({}, { readOnly: false });
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });
  });

  it('hides the toolbar when readOnly is true', async () => {
    renderWrapper({}, { readOnly: true });
    await waitFor(() => {
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });
  });

  it('sets data-readonly when readOnly is true', async () => {
    const { container } = renderWrapper({}, { readOnly: true });
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).toHaveAttribute('data-readonly', 'true');
    });
  });

  it('does not set data-readonly when readOnly is false', async () => {
    const { container } = renderWrapper({}, { readOnly: false });
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).not.toHaveAttribute('data-readonly');
    });
  });

  it('applies additional className', async () => {
    const { container } = renderWrapper({ className: 'custom-class' });
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  it('applies inline styles', async () => {
    const { container } = renderWrapper({ style: { maxWidth: '600px' } });
    await waitFor(() => {
      const wrapper = container.querySelector('.rte-editor');
      expect(wrapper).toHaveStyle({ maxWidth: '600px' });
    });
  });

  it('renders the content area with rte-content class', async () => {
    const { container } = renderWrapper();
    await waitFor(() => {
      expect(container.querySelector('.rte-content')).toBeInTheDocument();
    });
  });

  it('passes placeholder to the content area', async () => {
    const { container } = renderWrapper({ placeholder: 'Start writing...' });
    await waitFor(() => {
      const content = container.querySelector('.rte-content');
      expect(content).toHaveAttribute('data-placeholder', 'Start writing...');
    });
  });

  it('does not render link dialog by default', async () => {
    const { container } = renderWrapper();
    await waitFor(() => {
      expect(container.querySelector('.rte-editor')).toBeInTheDocument();
    });
    expect(useEditorStore.getState().openDialog).toBeNull();
  });
});
