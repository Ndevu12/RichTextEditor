import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { EditorProvider } from '@/components/Editor/EditorProvider';
import { useEditorStore } from '@/core/store';

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

describe('EditorProvider', () => {
  it('renders its children', () => {
    render(
      <EditorProvider>
        <div data-testid="child">Hello</div>
      </EditorProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('initializes the Tiptap editor in the store', async () => {
    render(
      <EditorProvider value="<p>Test</p>">
        <span />
      </EditorProvider>,
    );
    await waitFor(() => {
      expect(useEditorStore.getState().editor).not.toBeNull();
    });
  });

  it('syncs theme prop to the store', async () => {
    render(
      <EditorProvider theme="dark">
        <span />
      </EditorProvider>,
    );
    await waitFor(() => {
      expect(useEditorStore.getState().theme).toBe('dark');
    });
  });

  it('defaults theme to light', async () => {
    render(
      <EditorProvider>
        <span />
      </EditorProvider>,
    );
    await waitFor(() => {
      expect(useEditorStore.getState().theme).toBe('light');
    });
  });

  it('syncs readOnly prop to the store', async () => {
    render(
      <EditorProvider readOnly>
        <span />
      </EditorProvider>,
    );
    await waitFor(() => {
      expect(useEditorStore.getState().readOnly).toBe(true);
    });
  });

  it('defaults readOnly to false', async () => {
    render(
      <EditorProvider>
        <span />
      </EditorProvider>,
    );
    await waitFor(() => {
      expect(useEditorStore.getState().readOnly).toBe(false);
    });
  });

  it('updates theme when prop changes', async () => {
    const { rerender } = render(
      <EditorProvider theme="light">
        <span />
      </EditorProvider>,
    );

    await waitFor(() => {
      expect(useEditorStore.getState().theme).toBe('light');
    });

    rerender(
      <EditorProvider theme="dark">
        <span />
      </EditorProvider>,
    );

    await waitFor(() => {
      expect(useEditorStore.getState().theme).toBe('dark');
    });
  });

  it('updates readOnly when prop changes', async () => {
    const { rerender } = render(
      <EditorProvider readOnly={false}>
        <span />
      </EditorProvider>,
    );

    await waitFor(() => {
      expect(useEditorStore.getState().readOnly).toBe(false);
    });

    rerender(
      <EditorProvider readOnly>
        <span />
      </EditorProvider>,
    );

    await waitFor(() => {
      expect(useEditorStore.getState().readOnly).toBe(true);
    });
  });
});
