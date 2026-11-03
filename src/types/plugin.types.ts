import type { ToolbarItemType } from './toolbar.types';

/** Extension object registered by a plugin. */
export interface EditorExtension {
  name: string;
}

// --- Plugin Definition ---
export interface PluginConfig {
  name: string;
  extensions: EditorExtension[];
  toolbarItems?: ToolbarItemType[]; // toolbar items this plugin contributes
  keyboardShortcuts?: Record<string, () => boolean>; // additional keyboard shortcuts
}

// --- Plugin Registry ---
export interface PluginRegistry {
  plugins: Map<string, PluginConfig>;
  register: (plugin: PluginConfig) => void;
  unregister: (name: string) => void;
  getExtensions: () => EditorExtension[];
  getToolbarItems: () => ToolbarItemType[];
  getKeyboardShortcuts: () => Record<string, () => boolean>;
}
