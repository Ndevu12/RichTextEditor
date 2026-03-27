import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/core';

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

// --- Rich toolbar input (additive, legacy-compatible) ---
/** @deprecated Use `RichToolbarInput` instead. */
export type LegacyToolbarInput = ToolbarItem[];

export interface ToolbarResolverContext {
  id: string;
  readOnly: boolean;
  activeMarks: Set<string>;
  activeNodes: Set<string>;
  headingLevel: number | null;
}

export type ToolbarValueResolver<T> = T | ((context: ToolbarResolverContext) => T);

export interface RichToolbarButtonInput {
  type?: 'button';
  /**
   * Identifier for built-in or custom commands.
   * Built-in ids map to `ToolbarItemType` values.
   */
  id: ToolbarItemType | (string & {});
  label?: ToolbarValueResolver<string>;
  icon?: ToolbarValueResolver<React.ReactNode>;
  shortcut?: ToolbarValueResolver<string | undefined>;
  isVisible?: ToolbarValueResolver<boolean>;
  isDisabled?: ToolbarValueResolver<boolean>;
  isActive?: ToolbarValueResolver<boolean>;
  onClick?: (context: ToolbarResolverContext) => void;
}

export interface RichToolbarSeparatorInput {
  type: 'separator';
  id?: string;
}

export type RichToolbarItemInput =
  | ToolbarSeparator
  | RichToolbarButtonInput
  | RichToolbarSeparatorInput;

export type RichToolbarInput = RichToolbarItemInput[];

/** Accepts either legacy `ToolbarItem[]` or richer object-based input. */
export type ToolbarInput = LegacyToolbarInput | RichToolbarInput;

// --- Normalized + resolved toolbar models ---
export interface NormalizedToolbarButtonItem {
  type: 'button';
  id: string;
  builtinId?: ToolbarItemType;
  label?: ToolbarValueResolver<string>;
  icon?: ToolbarValueResolver<React.ReactNode>;
  shortcut?: ToolbarValueResolver<string | undefined>;
  isVisible?: ToolbarValueResolver<boolean>;
  isDisabled?: ToolbarValueResolver<boolean>;
  isActive?: ToolbarValueResolver<boolean>;
  onClick?: (context: ToolbarResolverContext) => void;
}

export interface NormalizedToolbarSeparatorItem {
  type: 'separator';
  id: string;
}

export type NormalizedToolbarItem = NormalizedToolbarButtonItem | NormalizedToolbarSeparatorItem;

export interface ToolbarRenderButtonItem {
  type: 'button';
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  isVisible: boolean;
  isDisabled: boolean;
  isActive: boolean;
  hasIcon: boolean;
  onClick: () => void;
}

export interface ToolbarRenderSeparatorItem {
  type: 'separator';
  id: string;
}

export type ToolbarRenderItem = ToolbarRenderButtonItem | ToolbarRenderSeparatorItem;

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

export interface ToolbarResolveContext extends ToolbarResolverContext {
  editor: Editor | null;
}

export interface BuiltinToolbarRegistryItem {
  label: string;
  icon: ReactNode;
  shortcut?: string;
  isVisible?: ToolbarValueResolver<boolean>;
  isDisabled?: ToolbarValueResolver<boolean>;
  isActive?: ToolbarValueResolver<boolean>;
  onClick?: (context: ToolbarResolveContext) => void;
}

