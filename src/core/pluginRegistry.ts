import type { Extension, Mark, Node } from '@tiptap/core';
import type { PluginConfig, PluginRegistry } from '@/types/plugin.types';
import type { ToolbarItemType } from '@/types/toolbar.types';

/**
 * Create a new PluginRegistry instance.
 *
 * Accepts an optional array of plugins to pre-register, making it easy to
 * initialise the registry in a single call:
 *
 * ```ts
 * const registry = createPluginRegistry([myPlugin, anotherPlugin]);
 * ```
 *
 * Consumers can also register/unregister plugins dynamically after creation.
 */
export function createPluginRegistry(initial: PluginConfig[] = []): PluginRegistry {
  const plugins = new Map<string, PluginConfig>();

  function register(plugin: PluginConfig): void {
    if (!plugin.name) {
      throw new Error('PluginRegistry: plugin must have a non-empty "name".');
    }
    if (plugins.has(plugin.name)) {
      throw new Error(
        `PluginRegistry: a plugin named "${plugin.name}" is already registered. ` +
          'Unregister it first if you want to replace it.',
      );
    }
    plugins.set(plugin.name, plugin);
  }

  function unregister(name: string): void {
    if (!plugins.has(name)) {
      throw new Error(`PluginRegistry: no plugin named "${name}" is registered.`);
    }
    plugins.delete(name);
  }

  function getExtensions(): (Extension | Mark | Node)[] {
    const extensions: (Extension | Mark | Node)[] = [];
    for (const plugin of plugins.values()) {
      extensions.push(...plugin.extensions);
    }
    return extensions;
  }

  function getToolbarItems(): ToolbarItemType[] {
    const items: ToolbarItemType[] = [];
    for (const plugin of plugins.values()) {
      if (plugin.toolbarItems) {
        items.push(...plugin.toolbarItems);
      }
    }
    return items;
  }

  function getKeyboardShortcuts(): Record<string, () => boolean> {
    const shortcuts: Record<string, () => boolean> = {};
    for (const plugin of plugins.values()) {
      if (plugin.keyboardShortcuts) {
        Object.assign(shortcuts, plugin.keyboardShortcuts);
      }
    }
    return shortcuts;
  }

  for (const plugin of initial) {
    register(plugin);
  }

  return {
    plugins,
    register,
    unregister,
    getExtensions,
    getToolbarItems,
    getKeyboardShortcuts,
  };
}
