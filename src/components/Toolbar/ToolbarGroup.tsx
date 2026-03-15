export interface ToolbarGroupProps {
  /** Accessibility label for the group */
  label: string;
  /** Button and separator children */
  children: React.ReactNode;
}

/**
 * Groups related toolbar buttons for accessibility.
 * Screen readers will announce the group label.
 */
export function ToolbarGroup({ label, children }: ToolbarGroupProps) {
  return (
    <div className="rte-toolbar__group" role="group" aria-label={label}>
      {children}
    </div>
  );
}
