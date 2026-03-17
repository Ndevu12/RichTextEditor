import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LinkDialog } from '@/components/Dialogs/LinkDialog';
import { ImageDialog } from '@/components/Dialogs/ImageDialog';
import { useEditorStore } from '@/core/store';
import { createEditor } from '@/core/engine';
import type { Editor } from '@tiptap/core';

vi.mock('@/components/Plugins/ImagePlugin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/Plugins/ImagePlugin')>();
  return {
    ...actual,
    readFileAsBase64: vi.fn(),
  };
});

import { readFileAsBase64 } from '@/components/Plugins/ImagePlugin';
const mockedReadFile = vi.mocked(readFileAsBase64);

let editor: Editor;

beforeEach(() => {
  editor = createEditor({ content: '<p>Hello World</p>' });
  useEditorStore.getState().setEditor(editor);
  mockedReadFile.mockReset();
});

afterEach(() => {
  cleanup();
  editor?.destroy();
  useEditorStore.getState().setEditor(null);
  useEditorStore.getState().setOpenDialog(null);
});

// ═══════════════════════════════════════════════
// LinkDialog
// ═══════════════════════════════════════════════

describe('LinkDialog', () => {
  it('renders the dialog with role="dialog"', () => {
    render(<LinkDialog />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has an aria-modal attribute', () => {
    render(<LinkDialog />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has a title "Insert Link"', () => {
    render(<LinkDialog />);
    expect(screen.getByRole('heading', { name: 'Insert Link' })).toBeInTheDocument();
  });

  it('renders URL and text inputs', () => {
    render(<LinkDialog />);
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Display text')).toBeInTheDocument();
  });

  it('renders Insert Link button', () => {
    render(<LinkDialog />);
    expect(screen.getByRole('button', { name: 'Insert Link' })).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<LinkDialog />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('closes dialog on Cancel click', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('link');
    render(<LinkDialog />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('shows validation error when submitting empty URL', async () => {
    const user = userEvent.setup();
    render(<LinkDialog />);
    await user.click(screen.getByRole('button', { name: 'Insert Link' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert').textContent).toMatch(/url/i);
  });

  it('shows error for invalid URL format', async () => {
    const user = userEvent.setup();
    render(<LinkDialog />);
    await user.type(screen.getByLabelText('URL'), 'invalid-url');
    await user.click(screen.getByRole('button', { name: 'Insert Link' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('clears error when typing in URL field', async () => {
    const user = userEvent.setup();
    render(<LinkDialog />);
    // Trigger error first
    await user.click(screen.getByRole('button', { name: 'Insert Link' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Type in URL to clear error
    await user.type(screen.getByLabelText('URL'), 'h');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('submits valid URL and closes', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('link');
    render(<LinkDialog />);
    await user.type(screen.getByLabelText('URL'), 'https://example.com');
    await user.click(screen.getByRole('button', { name: 'Insert Link' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('submits with display text', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('link');
    // Select text in editor first
    editor.commands.selectAll();
    render(<LinkDialog />);
    await user.clear(screen.getByLabelText('URL'));
    await user.type(screen.getByLabelText('URL'), 'https://example.com');
    await user.type(screen.getByLabelText('Display text'), 'Example');
    await user.click(screen.getByRole('button', { name: 'Insert Link' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('closes on Escape key', () => {
    useEditorStore.getState().setOpenDialog('link');
    render(<LinkDialog />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('submits on Enter key', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('link');
    render(<LinkDialog />);
    await user.type(screen.getByLabelText('URL'), 'https://example.com');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('closes when clicking overlay', () => {
    useEditorStore.getState().setOpenDialog('link');
    const { container } = render(<LinkDialog />);
    const overlay = container.querySelector('.rte-dialog__overlay')!;
    fireEvent.click(overlay);
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('traps focus forward: Tab on last element focuses first', () => {
    render(<LinkDialog />);
    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>('input, button');
    const last = focusable[focusable.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toBe(focusable[0]);
  });

  it('traps focus backward: Shift+Tab on first element focuses last', () => {
    render(<LinkDialog />);
    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>('input, button');
    const first = focusable[0];
    first.focus();

    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);
  });

  it('shows "Edit Link" title and Remove button in edit mode', () => {
    editor.commands.selectAll();
    editor.commands.setLink({ href: 'https://existing.com' });
    editor.commands.selectAll();

    render(<LinkDialog />);
    expect(screen.getByRole('heading', { name: 'Edit Link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Link' })).toBeInTheDocument();
  });

  it('Remove Link button removes the link and closes', async () => {
    const user = userEvent.setup();
    editor.commands.selectAll();
    editor.commands.setLink({ href: 'https://existing.com' });
    editor.commands.selectAll();
    useEditorStore.getState().setOpenDialog('link');

    render(<LinkDialog />);
    await user.click(screen.getByRole('button', { name: 'Remove Link' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });
});

// ═══════════════════════════════════════════════
// ImageDialog
// ═══════════════════════════════════════════════

describe('ImageDialog', () => {
  it('renders the dialog with role="dialog"', () => {
    render(<ImageDialog />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has an aria-modal attribute', () => {
    render(<ImageDialog />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has a title "Insert Image"', () => {
    render(<ImageDialog />);
    expect(screen.getByRole('heading', { name: 'Insert Image' })).toBeInTheDocument();
  });

  it('renders URL input', () => {
    render(<ImageDialog />);
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument();
  });

  it('renders alt text input', () => {
    render(<ImageDialog />);
    expect(screen.getByLabelText(/alt/i)).toBeInTheDocument();
  });

  it('renders Insert Image button', () => {
    render(<ImageDialog />);
    expect(screen.getByRole('button', { name: 'Insert Image' })).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<ImageDialog />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('closes dialog on Cancel click', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('image');
    render(<ImageDialog />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('shows validation error when submitting empty URL', async () => {
    const user = userEvent.setup();
    render(<ImageDialog />);
    await user.click(screen.getByRole('button', { name: 'Insert Image' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows error for invalid URL format', async () => {
    const user = userEvent.setup();
    render(<ImageDialog />);
    await user.type(screen.getByLabelText('Image URL'), 'invalid-url');
    await user.click(screen.getByRole('button', { name: 'Insert Image' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('clears error when typing in URL field', async () => {
    const user = userEvent.setup();
    render(<ImageDialog />);
    // Trigger error
    await user.click(screen.getByRole('button', { name: 'Insert Image' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Start typing to clear
    await user.type(screen.getByLabelText('Image URL'), 'h');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('submits valid URL and closes', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('image');
    render(<ImageDialog />);
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/img.png');
    await user.click(screen.getByRole('button', { name: 'Insert Image' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('allows entering alt text', async () => {
    const user = userEvent.setup();
    render(<ImageDialog />);
    const altInput = screen.getByLabelText(/alt/i);
    await user.type(altInput, 'A beautiful sunset');
    expect(altInput).toHaveValue('A beautiful sunset');
  });

  it('closes on Escape key', () => {
    useEditorStore.getState().setOpenDialog('image');
    render(<ImageDialog />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('closes when clicking overlay', () => {
    useEditorStore.getState().setOpenDialog('image');
    const { container } = render(<ImageDialog />);
    const overlay = container.querySelector('.rte-dialog__overlay')!;
    fireEvent.click(overlay);
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('renders drag-and-drop zone', () => {
    render(<ImageDialog />);
    expect(screen.getByText(/drag/i)).toBeInTheDocument();
  });

  it('renders browse button', () => {
    render(<ImageDialog />);
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument();
  });

  it('handles drag over event', () => {
    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass('rte-dialog__dropzone--active');
  });

  it('handles drag leave event', () => {
    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);
    expect(dropzone).not.toHaveClass('rte-dialog__dropzone--active');
  });

  it('submits on Enter key', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('image');
    render(<ImageDialog />);
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/img.png');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('submits with alt text', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().setOpenDialog('image');
    render(<ImageDialog />);
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/img.png');
    await user.type(screen.getByLabelText(/alt/i), 'A photo');
    await user.click(screen.getByRole('button', { name: 'Insert Image' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('handles file drop with a valid image', async () => {
    const dataUri = 'data:image/png;base64,ZmFrZQ==';
    mockedReadFile.mockResolvedValue(dataUri);

    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const file = new File(['fake'], 'photo.png', { type: 'image/png' });

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText('photo.png')).toBeInTheDocument();
    });
  });

  it('rejects non-image files on drop', async () => {
    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const file = new File(['text'], 'doc.txt', { type: 'text/plain' });

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/image file/i);
    });
  });

  it('shows size warning for large files', async () => {
    const dataUri = 'data:image/png;base64,ZmFrZQ==';
    mockedReadFile.mockResolvedValue(dataUri);

    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const bigFile = new File(['x'.repeat(100)], 'big.png', { type: 'image/png' });
    Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [bigFile] },
    });

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/MB/);
    });
  });

  it('shows error when readFileAsBase64 rejects', async () => {
    mockedReadFile.mockRejectedValue(new Error('read error'));

    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const file = new File(['img'], 'fail.png', { type: 'image/png' });

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to read/i);
    });
  });

  it('processes file from file input change', async () => {
    const dataUri = 'data:image/png;base64,ZmFrZQ==';
    mockedReadFile.mockResolvedValue(dataUri);

    const { container } = render(<ImageDialog />);
    const fileInput = container.querySelector('input[type="file"]')!;
    const file = new File(['data'], 'upload.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('upload.png')).toBeInTheDocument();
    });
  });

  it('submits file and closes in file mode', async () => {
    const dataUri = 'data:image/png;base64,ZmFrZQ==';
    mockedReadFile.mockResolvedValue(dataUri);
    useEditorStore.getState().setOpenDialog('image');

    const user = userEvent.setup();
    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const file = new File(['data'], 'test.png', { type: 'image/png' });

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText('test.png')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Insert Image' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });

  it('shows error when submitting file mode without file selected', async () => {
    const dataUri = 'data:image/png;base64,ZmFrZQ==';
    mockedReadFile.mockResolvedValue(dataUri);
    const user = userEvent.setup();

    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const file = new File(['data'], 'test.png', { type: 'image/png' });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('test.png')).toBeInTheDocument();
    });

    // Clear the file, then submit
    await user.click(screen.getByRole('button', { name: 'Remove selected file' }));
    expect(screen.queryByText('test.png')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument();
  });

  it('clear file button resets to URL mode', async () => {
    const dataUri = 'data:image/png;base64,ZmFrZQ==';
    mockedReadFile.mockResolvedValue(dataUri);
    const user = userEvent.setup();

    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const file = new File(['data'], 'clear-me.png', { type: 'image/png' });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('clear-me.png')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Remove selected file' }));
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument();
  });

  it('traps focus forward: Tab on last element focuses first', () => {
    render(<ImageDialog />);
    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>('input, button');
    const last = focusable[focusable.length - 1];
    last.focus();

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toBe(focusable[0]);
  });

  it('traps focus backward: Shift+Tab on first element focuses last', () => {
    render(<ImageDialog />);
    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>('input, button');
    const first = focusable[0];
    first.focus();

    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);
  });

  it('shows preview when URL is typed', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageDialog />);
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/img.jpg');
    const preview = container.querySelector('.rte-dialog__preview');
    expect(preview).toBeInTheDocument();
  });

  it('image onError hides the preview image', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageDialog />);
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/img.jpg');
    const img = container.querySelector('.rte-dialog__preview-image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    fireEvent.error(img);
    expect(img.style.display).toBe('none');
  });

  it('image onLoad shows the preview image', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageDialog />);
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/img.jpg');
    const img = container.querySelector('.rte-dialog__preview-image') as HTMLImageElement;
    fireEvent.load(img);
    expect(img.style.display).toBe('block');
  });

  it('sets source to url when typing in URL field', async () => {
    const dataUri = 'data:image/png;base64,ZmFrZQ==';
    mockedReadFile.mockResolvedValue(dataUri);

    const user = userEvent.setup();
    const { container } = render(<ImageDialog />);
    const dropzone = container.querySelector('.rte-dialog__dropzone')!;
    const file = new File(['data'], 'test.png', { type: 'image/png' });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('test.png')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/other.jpg');
    // Now submit - should use URL mode since we typed a URL
    useEditorStore.getState().setOpenDialog('image');
    await user.click(screen.getByRole('button', { name: 'Insert Image' }));
    expect(useEditorStore.getState().openDialog).toBeNull();
  });
});
