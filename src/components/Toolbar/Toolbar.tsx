import { useRef, useCallback, useMemo, useState } from 'react';
import type { ToolbarButtonConfig } from '@/types';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSeparator } from './ToolbarSeparator';
import { ToolbarGroup } from './ToolbarGroup';

export interface ToolbarProps {
  /** Resolved toolbar items from `useToolbar` hook */
  items: (ToolbarButtonConfig | '|')[];
}

/**
 * Main toolbar component.
 *
 * - Groups items by separators into `ToolbarGroup` components
 * - Renders each item as `ToolbarButton` or `ToolbarSeparator`
 * - Implements roving tabindex: only one button has tabindex=0 at a time
 *   - Arrow Left/Right moves focus between buttons (wraps)
 *   - Home/End jumps to first/last button
 *   - Tab exits the toolbar (only one button is in the tab order)
 * - role="toolbar" with aria-label and aria-orientation
 */
export function Toolbar({ items }: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Flat list of button configs (excluding separators)
  const flatButtons = useMemo(
    () => items.filter((i): i is ToolbarButtonConfig => i !== '|'),
    [items],
  );

  // Track which button id has tabindex=0 in the roving tabindex scheme
  const [rovingId, setRovingId] = useState<string | null>(null);

  // Resolve active roving target: stored id (if still valid & enabled), or first enabled
  const activeRovingId = useMemo(() => {
    if (rovingId && flatButtons.some((b) => b.id === rovingId && !b.isDisabled)) {
      return rovingId;
    }
    return flatButtons.find((b) => !b.isDisabled)?.id ?? flatButtons[0]?.id ?? null;
  }, [rovingId, flatButtons]);

  // ── Roving tabindex keyboard handler ───────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const toolbar = toolbarRef.current;
      if (!toolbar) return;

      const buttons = Array.from(
        toolbar.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
      );
      if (buttons.length === 0) return;

      const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = buttons.length - 1;
          break;
      }

      if (nextIndex !== null) {
        const nextButton = buttons[nextIndex];
        const id = nextButton.getAttribute('data-toolbar-item');
        if (id) setRovingId(id);
        nextButton.focus();
      }
    },
    [],
  );

  // ── Group items by separators ──────────────────────────────
  const groups = groupBySeparator(items);

  return (
    <div
      ref={toolbarRef}
      className="rte-toolbar"
      role="toolbar"
      aria-label="Text formatting"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
    >
      {groups.map((group, groupIndex) => (
        <ToolbarGroup key={groupIndex} label={`Formatting group ${groupIndex + 1}`}>
          {group.map((item) => (
            <ToolbarButton
              key={item.id}
              {...item}
              tabIndex={item.id === activeRovingId ? 0 : -1}
            />
          ))}
          {groupIndex < groups.length - 1 && <ToolbarSeparator />}
        </ToolbarGroup>
      ))}
    </div>
  );
}

// ── Helper: split items into groups at separator boundaries ──
function groupBySeparator(items: (ToolbarButtonConfig | '|')[]): ToolbarButtonConfig[][] {
  const groups: ToolbarButtonConfig[][] = [];
  let current: ToolbarButtonConfig[] = [];

  for (const item of items) {
    if (item === '|') {
      if (current.length > 0) {
        groups.push(current);
        current = [];
      }
    } else {
      current.push(item);
    }
  }

  if (current.length > 0) {
    groups.push(current);
  }

  return groups;
}
