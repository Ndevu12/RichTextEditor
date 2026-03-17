import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewPanel } from '@/components/Preview/PreviewPanel';
import { useEditorStore } from '@/core/store';

afterEach(() => {
  useEditorStore.getState().setContent('');
  cleanup();
});

describe('PreviewPanel', () => {
  it('returns null when mode is "none"', () => {
    const { container } = render(<PreviewPanel mode="none" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders HTML preview with region role', () => {
    useEditorStore.setState({ content: '<p>Hello</p>' });
    render(<PreviewPanel mode="html" />);
    expect(screen.getByRole('region', { name: 'HTML preview' })).toBeInTheDocument();
  });

  it('renders Markdown preview with region role', () => {
    useEditorStore.setState({ content: '<p>Hello</p>' });
    render(<PreviewPanel mode="markdown" />);
    expect(screen.getByRole('region', { name: 'Markdown preview' })).toBeInTheDocument();
  });

  it('displays formatted HTML output', () => {
    useEditorStore.setState({ content: '<p>Hello</p>' });
    render(<PreviewPanel mode="html" />);
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });

  it('displays Markdown output', () => {
    useEditorStore.setState({ content: '<p><strong>bold</strong></p>' });
    render(<PreviewPanel mode="markdown" />);
    expect(screen.getByText('**bold**')).toBeInTheDocument();
  });

  it('shows placeholder when content is empty', () => {
    useEditorStore.setState({ content: '' });
    render(<PreviewPanel mode="html" />);
    expect(screen.getByText('Start typing to see output...')).toBeInTheDocument();
  });

  it('shows the label "HTML" for html mode', () => {
    useEditorStore.setState({ content: '<p>X</p>' });
    render(<PreviewPanel mode="html" />);
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  it('shows the label "Markdown" for markdown mode', () => {
    useEditorStore.setState({ content: '<p>X</p>' });
    render(<PreviewPanel mode="markdown" />);
    expect(screen.getByText('Markdown')).toBeInTheDocument();
  });

  it('renders a copy button', () => {
    useEditorStore.setState({ content: '<p>Copy me</p>' });
    render(<PreviewPanel mode="html" />);
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toBeInTheDocument();
  });

  it('copy button uses navigator.clipboard.writeText', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    useEditorStore.setState({ content: '<p>Copy test</p>' });
    render(<PreviewPanel mode="html" />);

    await user.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    expect(writeText).toHaveBeenCalled();
  });

  it('formats HTML with indentation', () => {
    useEditorStore.setState({ content: '<ul><li>item</li></ul>' });
    render(<PreviewPanel mode="html" />);
    const code = screen.getByRole('region').querySelector('code');
    expect(code?.textContent).toContain('  ');
  });
});
