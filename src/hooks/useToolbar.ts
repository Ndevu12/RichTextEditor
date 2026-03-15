import { useMemo } from 'react';
import type { Editor } from '@tiptap/core';
import { useEditorStore } from '@/core/store';
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  setHeading,
  toggleBulletList,
  toggleOrderedList,
  toggleBlockquote,
  toggleCode,
  toggleCodeBlock,
  undo as undoCmd,
  redo as redoCmd,
} from '@/core/commands';
import type { ToolbarItem, ToolbarItemType, ToolbarButtonConfig } from '@/types';

// ── Platform detection for keyboard shortcut hints ──────────
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const mod = isMac ? '⌘' : 'Ctrl+';

// ── Toolbar item metadata (static, no editor dependency) ────
interface ToolbarItemMeta {
  label: string;
  shortcut?: string;
}

const TOOLBAR_META: Record<ToolbarItemType, ToolbarItemMeta> = {
  bold: { label: 'Bold', shortcut: `${mod}B` },
  italic: { label: 'Italic', shortcut: `${mod}I` },
  underline: { label: 'Underline', shortcut: `${mod}U` },
  strike: { label: 'Strikethrough', shortcut: `${mod}Shift+S` },
  heading1: { label: 'Heading 1' },
  heading2: { label: 'Heading 2' },
  heading3: { label: 'Heading 3' },
  heading4: { label: 'Heading 4' },
  heading5: { label: 'Heading 5' },
  heading6: { label: 'Heading 6' },
  bulletList: { label: 'Bullet List' },
  orderedList: { label: 'Ordered List' },
  blockquote: { label: 'Blockquote' },
  code: { label: 'Inline Code' },
  codeBlock: { label: 'Code Block' },
  link: { label: 'Link' },
  image: { label: 'Image' },
  undo: { label: 'Undo', shortcut: `${mod}Z` },
  redo: { label: 'Redo', shortcut: isMac ? '⌘Shift+Z' : 'Ctrl+Y' },
};

// ── Action dispatcher ────────────────────────────────────────
function getAction(id: ToolbarItemType, editor: Editor): () => void {
  switch (id) {
    case 'bold':
      return () => toggleBold(editor);
    case 'italic':
      return () => toggleItalic(editor);
    case 'underline':
      return () => toggleUnderline(editor);
    case 'strike':
      return () => toggleStrike(editor);
    case 'heading1':
      return () => setHeading(editor, 1);
    case 'heading2':
      return () => setHeading(editor, 2);
    case 'heading3':
      return () => setHeading(editor, 3);
    case 'heading4':
      return () => setHeading(editor, 4);
    case 'heading5':
      return () => setHeading(editor, 5);
    case 'heading6':
      return () => setHeading(editor, 6);
    case 'bulletList':
      return () => toggleBulletList(editor);
    case 'orderedList':
      return () => toggleOrderedList(editor);
    case 'blockquote':
      return () => toggleBlockquote(editor);
    case 'code':
      return () => toggleCode(editor);
    case 'codeBlock':
      return () => toggleCodeBlock(editor);
    case 'link':
      // Link/image open their respective dialogs (Phase 11/12)
      return () => useEditorStore.getState().setOpenDialog('link');
    case 'image':
      return () => useEditorStore.getState().setOpenDialog('image');
    case 'undo':
      return () => undoCmd(editor);
    case 'redo':
      return () => redoCmd(editor);
  }
}

// ── Active state resolver ────────────────────────────────────
function isItemActive(
  id: ToolbarItemType,
  activeMarks: Set<string>,
  activeNodes: Set<string>,
  headingLevel: number | null,
): boolean {
  switch (id) {
    case 'bold':
    case 'italic':
    case 'underline':
    case 'strike':
    case 'code':
    case 'link':
      return activeMarks.has(id);
    case 'heading1':
      return headingLevel === 1;
    case 'heading2':
      return headingLevel === 2;
    case 'heading3':
      return headingLevel === 3;
    case 'heading4':
      return headingLevel === 4;
    case 'heading5':
      return headingLevel === 5;
    case 'heading6':
      return headingLevel === 6;
    case 'bulletList':
    case 'orderedList':
    case 'blockquote':
    case 'codeBlock':
      return activeNodes.has(id);
    default:
      return false;
  }
}

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
export function useToolbar(toolbarItems: ToolbarItem[]): UseToolbarResult {
  const editor = useEditorStore((s) => s.editor);
  const readOnly = useEditorStore((s) => s.readOnly);
  const activeMarks = useEditorStore((s) => s.activeMarks);
  const activeNodes = useEditorStore((s) => s.activeNodes);
  const headingLevel = useEditorStore((s) => s.headingLevel);

  const items = useMemo(() => {
    return toolbarItems.map((item): ToolbarButtonConfig | '|' => {
      if (item === '|') return '|';

      const meta = TOOLBAR_META[item];
      const baseDisabled = readOnly || !editor;

      // Phase 14: undo/redo buttons are disabled based on history state
      let isDisabled = baseDisabled;
      if (!baseDisabled && editor) {
        if (item === 'undo') isDisabled = !editor.can().undo();
        if (item === 'redo') isDisabled = !editor.can().redo();
      }

      return {
        id: item,
        label: meta.label,
        icon: null, // Icons will be provided by Toolbar component (Phase 7)
        action: editor ? getAction(item, editor) : () => {},
        isActive: isItemActive(item, activeMarks, activeNodes, headingLevel),
        isDisabled,
        shortcut: meta.shortcut,
      };
    });
  }, [toolbarItems, editor, readOnly, activeMarks, activeNodes, headingLevel]);

  return { items };
}
