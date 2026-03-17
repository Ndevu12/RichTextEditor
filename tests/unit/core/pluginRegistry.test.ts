import { describe, it, expect } from 'vitest';
import { createPluginRegistry } from '@/core/pluginRegistry';
import type { PluginConfig } from '@/types/plugin.types';
import { Extension } from '@tiptap/core';

function makePlugin(name: string, overrides: Partial<PluginConfig> = {}): PluginConfig {
  return {
    name,
    extensions: [Extension.create({ name: `ext-${name}` })],
    ...overrides,
  };
}

describe('createPluginRegistry', () => {
  it('creates an empty registry by default', () => {
    const registry = createPluginRegistry();
    expect(registry.plugins.size).toBe(0);
    expect(registry.getExtensions()).toEqual([]);
  });

  it('pre-registers initial plugins', () => {
    const plugin = makePlugin('alpha');
    const registry = createPluginRegistry([plugin]);
    expect(registry.plugins.size).toBe(1);
    expect(registry.plugins.has('alpha')).toBe(true);
  });

  it('register adds a plugin', () => {
    const registry = createPluginRegistry();
    registry.register(makePlugin('beta'));
    expect(registry.plugins.size).toBe(1);
  });

  it('register throws for empty name', () => {
    const registry = createPluginRegistry();
    expect(() => registry.register(makePlugin(''))).toThrow('non-empty "name"');
  });

  it('register throws for duplicate name', () => {
    const registry = createPluginRegistry([makePlugin('dup')]);
    expect(() => registry.register(makePlugin('dup'))).toThrow('already registered');
  });

  it('unregister removes a plugin', () => {
    const registry = createPluginRegistry([makePlugin('removeme')]);
    registry.unregister('removeme');
    expect(registry.plugins.size).toBe(0);
  });

  it('unregister throws for unknown name', () => {
    const registry = createPluginRegistry();
    expect(() => registry.unregister('nope')).toThrow('no plugin named "nope"');
  });

  it('getExtensions collects extensions from all plugins', () => {
    const registry = createPluginRegistry([makePlugin('a'), makePlugin('b')]);
    expect(registry.getExtensions()).toHaveLength(2);
  });

  it('getToolbarItems collects toolbar items', () => {
    const registry = createPluginRegistry([
      makePlugin('with-items', { toolbarItems: ['bold' as never, 'italic' as never] }),
      makePlugin('no-items'),
    ]);
    expect(registry.getToolbarItems()).toHaveLength(2);
  });

  it('getToolbarItems returns empty for plugins without toolbar items', () => {
    const registry = createPluginRegistry([makePlugin('plain')]);
    expect(registry.getToolbarItems()).toEqual([]);
  });

  it('getKeyboardShortcuts merges shortcuts from all plugins', () => {
    const fn1 = () => true;
    const fn2 = () => false;
    const registry = createPluginRegistry([
      makePlugin('ks1', { keyboardShortcuts: { 'Mod-b': fn1 } }),
      makePlugin('ks2', { keyboardShortcuts: { 'Mod-i': fn2 } }),
    ]);
    const shortcuts = registry.getKeyboardShortcuts();
    expect(shortcuts['Mod-b']).toBe(fn1);
    expect(shortcuts['Mod-i']).toBe(fn2);
  });

  it('getKeyboardShortcuts returns empty when no plugins have shortcuts', () => {
    const registry = createPluginRegistry([makePlugin('noshort')]);
    expect(registry.getKeyboardShortcuts()).toEqual({});
  });
});
