import { useRef, useCallback } from 'react';
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
 * - Implements roving tabindex: Arrow Left/Right moves focus between buttons
 * - role="toolbar" with aria-label and aria-orientation
 */
export function Toolbar({ items }: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // ── Roving tabindex keyboard handler ───────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
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
      buttons[nextIndex].focus();
    }
  }, []);

  // ── Group items by separators ──────────────────────────────
  const groups = groupBySeparator(items);

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Text formatting"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
    >
      {groups.map((group, groupIndex) => (
        <ToolbarGroup key={groupIndex} label={`Formatting group ${groupIndex + 1}`}>
          {group.map((item) => (
            <ToolbarButton key={item.id} {...item} />
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
