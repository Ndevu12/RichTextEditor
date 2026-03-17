import { useEffect, useRef, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import { createEditor } from '@/core/engine';
import { useEditorStore } from '@/core/store';
import type { PluginRegistry } from '@/types/plugin.types';

export interface UseEditorOptions {
  /** Initial / controlled HTML content */
  value?: string;
  /** Called when editor content changes */
  onChange?: (html: string) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Disable editing */
  readOnly?: boolean;
  /** Accessible label for the editor content area */
  ariaLabel?: string;
  /** Plugin registry whose extensions are merged into the editor */
  pluginRegistry?: PluginRegistry;
  /** Called when editor gains focus */
  onFocus?: () => void;
  /** Called when editor loses focus */
  onBlur?: () => void;
}

/**
 * Primary hook — manages the Tiptap editor lifecycle and bridges
 * it with the Zustand store.
 *
 * Responsibilities:
 * - Create editor on mount, destroy on unmount
 * - Sync `value` prop → Tiptap content (controlled component)
 * - Forward Tiptap events → Zustand store + prop callbacks
 * - Handle `readOnly` changes
 */
export function useEditor(options: UseEditorOptions = {}): Editor | null {
  const {
    value = '',
    onChange,
    placeholder,
    readOnly = false,
    ariaLabel,
    pluginRegistry,
    onFocus,
    onBlur,
  } = options;

  const editorRef = useRef<Editor | null>(null);
  const isInternalUpdate = useRef(false);

  const { setEditor, setContent, setFocused, updateActiveState } = useEditorStore.getState();

  // ── Refresh active marks/nodes from editor state ──────────
  const refreshActiveState = useCallback(
    (editor: Editor) => {
      const marks = new Set<string>();
      const nodes = new Set<string>();
      let headingLevel: number | null = null;

      // Collect active marks
      for (const mark of ['bold', 'italic', 'underline', 'strike', 'code', 'link']) {
        if (editor.isActive(mark)) {
          marks.add(mark);
        }
      }

      // Collect active nodes
      for (const node of ['bulletList', 'orderedList', 'blockquote', 'codeBlock']) {
        if (editor.isActive(node)) {
          nodes.add(node);
        }
      }

      // Check headings (1–6)
      for (let level = 1; level <= 6; level++) {
        if (editor.isActive('heading', { level })) {
          nodes.add('heading');
          headingLevel = level;
          break;
        }
      }

      updateActiveState(marks, nodes, headingLevel);
    },
    [updateActiveState],
  );

  // ── Create editor on mount ────────────────────────────────
  useEffect(() => {
    const editor = createEditor({
      content: value,
      editable: !readOnly,
      placeholder,
      ariaLabel,
      pluginRegistry,
      onUpdate: (html) => {
        isInternalUpdate.current = true;
        setContent(html);
        onChange?.(html);
        // Refresh active state after content change
        if (editorRef.current) {
          refreshActiveState(editorRef.current);
        }
        isInternalUpdate.current = false;
      },
      onSelectionUpdate: () => {
        if (editorRef.current) {
          refreshActiveState(editorRef.current);
        }
      },
      onFocus: () => {
        setFocused(true);
        onFocus?.();
      },
      onBlur: () => {
        setFocused(false);
        onBlur?.();
      },
    });

    editorRef.current = editor;
    setEditor(editor);

    return () => {
      editor.destroy();
      editorRef.current = null;
      setEditor(null);
    };
    // Only run on mount/unmount — props are synced via separate effects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync controlled `value` prop → Tiptap ─────────────────
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || isInternalUpdate.current) return;

    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value]);

  // ── Sync `readOnly` prop ───────────────────────────────────
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.setEditable(!readOnly);
    useEditorStore.getState().setReadOnly(readOnly);

    // Keep aria-readonly in sync with the readOnly prop
    const el = editor.view?.dom;
    if (el) {
      if (readOnly) {
        el.setAttribute('aria-readonly', 'true');
      } else {
        el.removeAttribute('aria-readonly');
      }
    }
  }, [readOnly]);

  return useEditorStore((s) => s.editor);
}
