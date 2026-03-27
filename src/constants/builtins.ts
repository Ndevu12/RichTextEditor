import type { ToolbarItemType } from '@/types';
import { TOOLBAR_ICONS } from '@/components/Toolbar/icons';
import type { BuiltinToolbarRegistryItem } from '@/types';

interface ToolbarItemMeta {
  label: string;
  shortcut?: string;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const mod = isMac ? '⌘' : 'Ctrl+';

export const TOOLBAR_META: Record<ToolbarItemType, ToolbarItemMeta> = {
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

export const BUILTIN_TOOLBAR_REGISTRY: Record<ToolbarItemType, BuiltinToolbarRegistryItem> = {
  bold: { label: TOOLBAR_META.bold.label, shortcut: TOOLBAR_META.bold.shortcut, icon: TOOLBAR_ICONS.bold ?? null },
  italic: {
    label: TOOLBAR_META.italic.label,
    shortcut: TOOLBAR_META.italic.shortcut,
    icon: TOOLBAR_ICONS.italic ?? null,
  },
  underline: {
    label: TOOLBAR_META.underline.label,
    shortcut: TOOLBAR_META.underline.shortcut,
    icon: TOOLBAR_ICONS.underline ?? null,
  },
  strike: {
    label: TOOLBAR_META.strike.label,
    shortcut: TOOLBAR_META.strike.shortcut,
    icon: TOOLBAR_ICONS.strike ?? null,
  },
  heading1: { label: TOOLBAR_META.heading1.label, icon: TOOLBAR_ICONS.heading1 ?? null },
  heading2: { label: TOOLBAR_META.heading2.label, icon: TOOLBAR_ICONS.heading2 ?? null },
  heading3: { label: TOOLBAR_META.heading3.label, icon: TOOLBAR_ICONS.heading3 ?? null },
  heading4: { label: TOOLBAR_META.heading4.label, icon: TOOLBAR_ICONS.heading4 ?? null },
  heading5: { label: TOOLBAR_META.heading5.label, icon: TOOLBAR_ICONS.heading5 ?? null },
  heading6: { label: TOOLBAR_META.heading6.label, icon: TOOLBAR_ICONS.heading6 ?? null },
  bulletList: { label: TOOLBAR_META.bulletList.label, icon: TOOLBAR_ICONS.bulletList ?? null },
  orderedList: { label: TOOLBAR_META.orderedList.label, icon: TOOLBAR_ICONS.orderedList ?? null },
  blockquote: { label: TOOLBAR_META.blockquote.label, icon: TOOLBAR_ICONS.blockquote ?? null },
  code: { label: TOOLBAR_META.code.label, icon: TOOLBAR_ICONS.code ?? null },
  codeBlock: { label: TOOLBAR_META.codeBlock.label, icon: TOOLBAR_ICONS.codeBlock ?? null },
  link: { label: TOOLBAR_META.link.label, icon: TOOLBAR_ICONS.link ?? null },
  image: { label: TOOLBAR_META.image.label, icon: TOOLBAR_ICONS.image ?? null },
  undo: {
    label: TOOLBAR_META.undo.label,
    shortcut: TOOLBAR_META.undo.shortcut,
    icon: TOOLBAR_ICONS.undo ?? null,
  },
  redo: {
    label: TOOLBAR_META.redo.label,
    shortcut: TOOLBAR_META.redo.shortcut,
    icon: TOOLBAR_ICONS.redo ?? null,
  },
};

export function isToolbarItemType(value: string): value is ToolbarItemType {
  return value in BUILTIN_TOOLBAR_REGISTRY;
}
