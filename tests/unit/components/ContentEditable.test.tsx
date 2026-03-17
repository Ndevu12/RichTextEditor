import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ContentEditable } from '@/components/Content/ContentEditable';

afterEach(cleanup);

describe('ContentEditable', () => {
  it('renders without crashing when editor is null', () => {
    const { container } = render(<ContentEditable editor={null} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies className to the wrapper div', () => {
    const { container } = render(<ContentEditable editor={null} className="my-content" />);
    expect(container.firstChild).toHaveClass('my-content');
  });

  it('sets data-placeholder attribute', () => {
    const { container } = render(
      <ContentEditable editor={null} placeholder="Type here..." />,
    );
    expect(container.firstChild).toHaveAttribute('data-placeholder', 'Type here...');
  });

  it('applies minHeight as a string style', () => {
    const { container } = render(<ContentEditable editor={null} minHeight="200px" />);
    expect(container.firstChild).toHaveStyle({ minHeight: '200px' });
  });

  it('applies minHeight as a number (converted to px)', () => {
    const { container } = render(<ContentEditable editor={null} minHeight={150} />);
    expect(container.firstChild).toHaveStyle({ minHeight: '150px' });
  });

  it('applies maxHeight and enables overflow scrolling', () => {
    const { container } = render(<ContentEditable editor={null} maxHeight="400px" />);
    expect(container.firstChild).toHaveStyle({
      maxHeight: '400px',
      overflowY: 'auto',
    });
  });

  it('does not set overflowY when maxHeight is not provided', () => {
    const { container } = render(<ContentEditable editor={null} minHeight="100px" />);
    const style = (container.firstChild as HTMLElement).style;
    expect(style.overflowY).toBe('');
  });

  it('applies maxHeight as a number (converted to px)', () => {
    const { container } = render(<ContentEditable editor={null} maxHeight={300} />);
    expect(container.firstChild).toHaveStyle({ maxHeight: '300px' });
  });
});
