/**
 * Lists & Blockquote Plugin
 *
 * StarterKit already registers BulletList, OrderedList, ListItem, and Blockquote.
 * This module re-exports the canonical list nesting helpers from `@/core/commands`
 * so plugin consumers can import from either location.
 *
 * **Usage (inside a Tiptap extension or keyboard-shortcut map):**
 * ```ts
 * import { sinkListItem, liftListItem } from '@/components/Plugins';
 * ```
 */

export { sinkListItem, liftListItem } from '@/core/commands';
