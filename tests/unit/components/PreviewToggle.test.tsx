import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewToggle } from '@/components/Preview/PreviewToggle';
import { useEditorStore } from '@/core/store';

afterEach(() => {
  useEditorStore.getState().setPreviewMode('none');
  cleanup();
});

describe('PreviewToggle', () => {
  it('renders a radiogroup', () => {
    render(<PreviewToggle />);
    expect(screen.getByRole('radiogroup', { name: 'Preview mode' })).toBeInTheDocument();
  });

  it('renders three mode buttons', () => {
    render(<PreviewToggle />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('marks "Editor" as checked by default', () => {
    render(<PreviewToggle />);
    expect(screen.getByRole('radio', { name: 'Editor' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('switches to HTML mode on click', async () => {
    const user = userEvent.setup();
    render(<PreviewToggle />);
    await user.click(screen.getByRole('radio', { name: 'HTML' }));
    expect(useEditorStore.getState().previewMode).toBe('html');
  });

  it('switches to Markdown mode on click', async () => {
    const user = userEvent.setup();
    render(<PreviewToggle />);
    await user.click(screen.getByRole('radio', { name: 'MD' }));
    expect(useEditorStore.getState().previewMode).toBe('markdown');
  });

  it('applies active class to selected button', async () => {
    const user = userEvent.setup();
    render(<PreviewToggle />);
    const htmlBtn = screen.getByRole('radio', { name: 'HTML' });
    await user.click(htmlBtn);
    expect(htmlBtn).toHaveClass('rte-preview-toggle__btn--active');
  });
});
