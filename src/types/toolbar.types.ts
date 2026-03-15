import type React from 'react';

// --- Toolbar Item Identifiers ---
export type ToolbarItemType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'code'
  | 'codeBlock'
  | 'link'
  | 'image'
  | 'undo'
  | 'redo';

export type ToolbarSeparator = '|';

export type ToolbarItem = ToolbarItemType | ToolbarSeparator;

// --- Toolbar Button Configuration ---
export interface ToolbarButtonConfig {
  id: ToolbarItemType;
  label: string; // Human-readable label (for tooltip / aria-label)
  icon: React.ReactNode; // Icon element (SVG component or Unicode)
  action: () => void; // Command to execute when clicked
  isActive: boolean; // Whether this formatting is currently active at cursor
  isDisabled: boolean; // Whether the button should be disabled
  shortcut?: string; // Keyboard shortcut hint (e.g. "Ctrl+B")
}

// --- Toolbar Group Configuration ---
export interface ToolbarGroupConfig {
  id: string;
  label: string; // Group label for accessibility
  items: (ToolbarButtonConfig | ToolbarSeparator)[];
}

// --- Default toolbar item order ---
export const DEFAULT_TOOLBAR: ToolbarItem[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  '|',
  'heading1',
  'heading2',
  'heading3',
  '|',
  'bulletList',
  'orderedList',
  'blockquote',
  '|',
  'code',
  'codeBlock',
  '|',
  'link',
  'image',
  '|',
  'undo',
  'redo',
];
