export interface ToolbarGroupProps {
  /** Accessibility label for the group */
  label: string;
  /** Button children */
  children: React.ReactNode;
  /** Share of the toolbar width. Matches the number of buttons so every control stays the same size. */
  weight: number;
}

/**
 * Groups related toolbar buttons for accessibility.
 * Screen readers will announce the group label.
 */
export function ToolbarGroup({ label, children, weight }: ToolbarGroupProps) {
  return (
    <div
      className="rte-toolbar__group"
      role="group"
      aria-label={label}
      style={{ flexGrow: weight }}
    >
      {children}
    </div>
  );
}
