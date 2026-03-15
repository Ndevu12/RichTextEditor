import type { ToolbarButtonConfig } from '@/types';

/**
 * A single toolbar button that renders an icon, responds to clicks,
 * and reflects the current active formatting state.
 *
 * Accessibility:
 * - `aria-label` for screen readers
 * - `aria-pressed` for toggle state
 * - Focusable via Tab, operable via Enter/Space
 */
export function ToolbarButton({
  id,
  label,
  icon,
  action,
  isActive,
  isDisabled,
  shortcut,
}: ToolbarButtonConfig) {
  const title = shortcut ? `${label} (${shortcut})` : label;

  return (
    <button
      type="button"
      onClick={action}
      disabled={isDisabled}
      aria-label={label}
      aria-pressed={isActive}
      title={title}
      data-toolbar-item={id}
      data-active={isActive || undefined}
    >
      {icon ?? label}
    </button>
  );
}
