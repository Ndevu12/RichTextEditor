import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from '@/components/Toolbar/Toolbar';
import type { ToolbarButtonConfig } from '@/types';

afterEach(cleanup);

function makeButton(overrides: Partial<ToolbarButtonConfig> = {}): ToolbarButtonConfig {
  return {
    id: 'bold',
    label: 'Bold',
    icon: 'B',
    action: vi.fn(),
    isActive: false,
    isDisabled: false,
    ...overrides,
  };
}

describe('Toolbar', () => {
  it('renders toolbar with role="toolbar"', () => {
    render(<Toolbar items={[makeButton()]} />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('renders buttons from items array', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
    ];
    render(<Toolbar items={items} />);
    expect(screen.getByLabelText('Bold')).toBeInTheDocument();
    expect(screen.getByLabelText('Italic')).toBeInTheDocument();
  });

  it('renders separators between groups', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      '|',
      makeButton({ id: 'italic', label: 'Italic' }),
    ];
    const { container } = render(<Toolbar items={items} />);
    expect(container.querySelector('.rte-toolbar__separator')).toBeInTheDocument();
  });

  it('calls action when button is clicked', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(<Toolbar items={[makeButton({ action })]} />);

    await user.click(screen.getByLabelText('Bold'));
    expect(action).toHaveBeenCalledOnce();
  });

  it('reflects active state via aria-pressed', () => {
    render(<Toolbar items={[makeButton({ isActive: true })]} />);
    expect(screen.getByLabelText('Bold')).toHaveAttribute('aria-pressed', 'true');
  });

  it('disables buttons when isDisabled is true', () => {
    render(<Toolbar items={[makeButton({ isDisabled: true })]} />);
    expect(screen.getByLabelText('Bold')).toBeDisabled();
  });

  it('renders label-mode button when icon is null', () => {
    render(<Toolbar items={[makeButton({ icon: null })]} />);
    const button = screen.getByLabelText('Bold');
    expect(button).toHaveTextContent('Bold');
    expect(button).toHaveClass('rte-toolbar__button--label');
    expect(button).not.toHaveAttribute('data-has-icon');
  });

  it('has aria-orientation="horizontal"', () => {
    render(<Toolbar items={[makeButton()]} />);
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('has aria-label="Text formatting"', () => {
    render(<Toolbar items={[makeButton()]} />);
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Text formatting');
  });

  // ── Roving tabindex keyboard navigation ──────

  it('moves focus right with ArrowRight', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
      makeButton({ id: 'underline', label: 'Underline' }),
    ];
    render(<Toolbar items={items} />);

    const bold = screen.getByLabelText('Bold');
    const italic = screen.getByLabelText('Italic');
    bold.focus();

    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(italic);
  });

  it('moves focus left with ArrowLeft', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
    ];
    render(<Toolbar items={items} />);

    const bold = screen.getByLabelText('Bold');
    const italic = screen.getByLabelText('Italic');
    italic.focus();

    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(bold);
  });

  it('wraps focus from last to first with ArrowRight', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
    ];
    render(<Toolbar items={items} />);

    const bold = screen.getByLabelText('Bold');
    const italic = screen.getByLabelText('Italic');
    italic.focus();

    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(bold);
  });

  it('wraps focus from first to last with ArrowLeft', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
    ];
    render(<Toolbar items={items} />);

    const bold = screen.getByLabelText('Bold');
    const italic = screen.getByLabelText('Italic');
    bold.focus();

    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(italic);
  });

  it('jumps to first button on Home', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
      makeButton({ id: 'underline', label: 'Underline' }),
    ];
    render(<Toolbar items={items} />);

    const bold = screen.getByLabelText('Bold');
    const underline = screen.getByLabelText('Underline');
    underline.focus();

    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'Home' });
    expect(document.activeElement).toBe(bold);
  });

  it('jumps to last button on End', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
      makeButton({ id: 'underline', label: 'Underline' }),
    ];
    render(<Toolbar items={items} />);

    const bold = screen.getByLabelText('Bold');
    const underline = screen.getByLabelText('Underline');
    bold.focus();

    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'End' });
    expect(document.activeElement).toBe(underline);
  });

  it('renders multiple groups from separator-delimited items', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
      '|',
      makeButton({ id: 'undo', label: 'Undo' }),
    ];
    const { container } = render(<Toolbar items={items} />);
    const groups = container.querySelectorAll('.rte-toolbar__group');
    expect(groups.length).toBe(2);
  });

  it('ignores leading, trailing, and consecutive separators when grouping', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      '|',
      '|',
      makeButton({ id: 'bold', label: 'Bold' }),
      '|',
      '|',
      makeButton({ id: 'italic', label: 'Italic' }),
      '|',
    ];
    const { container } = render(<Toolbar items={items} />);

    const groups = container.querySelectorAll('.rte-toolbar__group');
    const separators = container.querySelectorAll('.rte-toolbar__separator');
    expect(groups.length).toBe(2);
    expect(separators.length).toBe(1);
  });

  it('sets tabIndex=0 on active roving item and -1 on others', () => {
    const items: (ToolbarButtonConfig | '|')[] = [
      makeButton({ id: 'bold', label: 'Bold' }),
      makeButton({ id: 'italic', label: 'Italic' }),
    ];
    render(<Toolbar items={items} />);

    const bold = screen.getByLabelText('Bold');
    const italic = screen.getByLabelText('Italic');
    // First enabled button should have tabIndex=0
    expect(bold.tabIndex).toBe(0);
    expect(italic.tabIndex).toBe(-1);
  });
});
