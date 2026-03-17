import type { Extension, Mark, Node } from '@tiptap/core';
import type { ToolbarItemType } from './toolbar.types';

// --- Plugin Definition ---
export interface PluginConfig {
  name: string;
  extensions: (Extension | Mark | Node)[];
  toolbarItems?: ToolbarItemType[]; // toolbar items this plugin contributes
  keyboardShortcuts?: Record<string, () => boolean>; // additional keyboard shortcuts
}

// --- Plugin Registry ---
export interface PluginRegistry {
  plugins: Map<string, PluginConfig>;
  register: (plugin: PluginConfig) => void;
  unregister: (name: string) => void;
  getExtensions: () => (Extension | Mark | Node)[];
  getToolbarItems: () => ToolbarItemType[];
  getKeyboardShortcuts: () => Record<string, () => boolean>;
}
