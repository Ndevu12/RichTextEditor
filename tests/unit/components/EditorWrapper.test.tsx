import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import { EditorProvider } from '@/components/Editor/EditorProvider';
import { EditorWrapper } from '@/components/Editor/EditorWrapper';
import { useEditorStore } from '@/core/store';
import { DEFAULT_TOOLBAR } from '@/types';

afterEach(async () => {
  const editor = useEditorStore.getState().editor;
  if (editor) {
    await act(() => {
      editor.destroy();
    });
  }
  useEditorStore.getState().setEditor(null);
  useEditorStore.getState().setContent('');
  useEditorStore.getState().setTheme('light');
  useEditorStore.getState().setReadOnly(false);
  useEditorStore.getState().setFocused(false);
  useEditorStore.getState().setOpenDialog(null);
  useEditorStore.getState().setPreviewMode('none');
  cleanup();
});

async function renderWrapper(
  wrapperProps: Partial<React.ComponentProps<typeof EditorWrapper>> = {},
  providerProps: Partial<React.ComponentProps<typeof EditorProvider>> = {},
) {
  let result!: ReturnType<typeof render>;
  await act(async () => {
    result = render(
      <EditorProvider {...providerProps}>
        <EditorWrapper toolbar={DEFAULT_TOOLBAR} {...wrapperProps} />
      </EditorProvider>,
    );
  });
  await waitFor(() => {
    expect(useEditorStore.getState().editor).not.toBeNull();
  });
  return result;
}

describe('EditorWrapper', () => {
  it('renders with the rte-editor class', async () => {
    const { container } = await renderWrapper();
    expect(container.querySelector('.rte-editor')).toBeInTheDocument();
  });

  it('applies data-theme from the store', async () => {
    const { container } = await renderWrapper({}, { theme: 'dark' });
    const wrapper = container.querySelector('.rte-editor');
    expect(wrapper).toHaveAttribute('data-theme', 'dark');
  });

  it('renders the toolbar when not readOnly', async () => {
    await renderWrapper({}, { readOnly: false });
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('hides the toolbar when readOnly is true', async () => {
    await renderWrapper({}, { readOnly: true });
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('sets data-readonly when readOnly is true', async () => {
    const { container } = await renderWrapper({}, { readOnly: true });
    const wrapper = container.querySelector('.rte-editor');
    expect(wrapper).toHaveAttribute('data-readonly', 'true');
  });

  it('does not set data-readonly when readOnly is false', async () => {
    const { container } = await renderWrapper({}, { readOnly: false });
    const wrapper = container.querySelector('.rte-editor');
    expect(wrapper).not.toHaveAttribute('data-readonly');
  });

  it('applies additional className', async () => {
    const { container } = await renderWrapper({ className: 'custom-class' });
    const wrapper = container.querySelector('.rte-editor');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('applies inline styles', async () => {
    const { container } = await renderWrapper({ style: { maxWidth: '600px' } });
    const wrapper = container.querySelector('.rte-editor');
    expect(wrapper).toHaveStyle({ maxWidth: '600px' });
  });

  it('renders the content area with rte-content class', async () => {
    const { container } = await renderWrapper();
    expect(container.querySelector('.rte-content')).toBeInTheDocument();
  });

  it('passes placeholder to the content area', async () => {
    const { container } = await renderWrapper({ placeholder: 'Start writing...' });
    const content = container.querySelector('.rte-content');
    expect(content).toHaveAttribute('data-placeholder', 'Start writing...');
  });

  it('does not render link dialog by default', async () => {
    await renderWrapper();
    expect(useEditorStore.getState().openDialog).toBeNull();
  });
});
