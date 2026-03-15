/**
 * Lists & Blockquote Plugin
 *
 * StarterKit already registers BulletList, OrderedList, ListItem, and Blockquote.
 * This module provides helper utilities for list nesting (sink / lift) that
 * can be wired to Tab / Shift+Tab keyboard shortcuts.
 *
 * **Usage (inside a Tiptap extension or keyboard-shortcut map):**
 * ```ts
 * import { sinkListItem, liftListItem } from '@/components/Plugins';
 * ```
 */

import type { Editor } from '@tiptap/core';

/**
 * Increase list indent — moves the current list item one level deeper.
 * Equivalent to pressing Tab inside a list.
 */
export const sinkListItem = (editor: Editor): boolean =>
  editor.chain().focus().sinkListItem('listItem').run();

/**
 * Decrease list indent — lifts the current list item one level up.
 * Equivalent to pressing Shift+Tab inside a list.
 */
export const liftListItem = (editor: Editor): boolean =>
  editor.chain().focus().liftListItem('listItem').run();
