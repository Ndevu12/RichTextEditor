import { useMemo } from 'react';
import { useEditorStore } from '@/core/store';
import type { ToolbarInput, ToolbarButtonConfig } from '@/types';
import { resolveToolbarFromInput } from '@/core/toolbar';

// ── Hook ─────────────────────────────────────────────────────

export interface UseToolbarResult {
  /** Resolved toolbar button configs (separators filtered to '|' strings) */
  items: (ToolbarButtonConfig | '|')[];
}

/**
 * Maps an array of `ToolbarItem` identifiers to resolved `ToolbarButtonConfig`
 * objects with actions, active states, and labels.
 *
 * Icons are left as `null` for now — Phase 8 (Styles & Theming) or the
 * Toolbar component (Phase 7) will supply actual icon components.
 */
export function useToolbar(toolbarItems: ToolbarInput): UseToolbarResult {
  const editor = useEditorStore((s) => s.editor);
  const readOnly = useEditorStore((s) => s.readOnly);
  const activeMarks = useEditorStore((s) => s.activeMarks);
  const activeNodes = useEditorStore((s) => s.activeNodes);
  const headingLevel = useEditorStore((s) => s.headingLevel);

  const items = useMemo(() => {
    return resolveToolbarFromInput(toolbarItems, {
      editor,
      readOnly,
      activeMarks,
      activeNodes,
      headingLevel,
      id: 'toolbar',
    });
  }, [toolbarItems, editor, readOnly, activeMarks, activeNodes, headingLevel]);

  return { items };
}
