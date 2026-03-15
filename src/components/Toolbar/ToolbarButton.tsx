import type { ToolbarButtonConfig } from '@/types';

export interface ToolbarButtonProps extends ToolbarButtonConfig {
  /** tabIndex for roving tabindex (0 = active, -1 = inactive) */
  tabIndex?: number;
}

/**
 * A single toolbar button that renders an icon, responds to clicks,
 * and reflects the current active formatting state.
 *
 * Accessibility:
 * - `aria-label` for screen readers
 * - `aria-pressed` for toggle state
 * - `aria-disabled` for disabled state (announced by screen readers)
 * - Roving tabindex: only the active button has tabIndex=0
 * - Focusable via Tab (when active), operable via Enter/Space
 */
export function ToolbarButton({
  id,
  label,
  icon,
  action,
  isActive,
  isDisabled,
  shortcut,
  tabIndex = 0,
}: ToolbarButtonProps) {
  const title = shortcut ? `${label} (${shortcut})` : label;

  return (
    <button
      type="button"
      className="rte-toolbar__button"
      onClick={action}
      disabled={isDisabled}
      aria-label={label}
      aria-pressed={isActive}
      aria-disabled={isDisabled || undefined}
      title={title}
      tabIndex={isDisabled ? -1 : tabIndex}
      data-toolbar-item={id}
      data-active={isActive || undefined}
    >
      {icon ?? label}
    </button>
  );
}
