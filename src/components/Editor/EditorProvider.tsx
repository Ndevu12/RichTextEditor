import { useEffect } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { useEditorStore } from '@/core/store';
import type { CompiledDocument } from '@/compile/types';
import type { Theme } from '@/types';
import type { PluginRegistry } from '@/types/plugin.types';

export interface EditorProviderProps {
  /** Controlled HTML content */
  value?: string;
  /** Called when content changes */
  onChange?: (value: string) => void;
  /** Disable editing */
  readOnly?: boolean;
  /** Theme: 'light' or 'dark' */
  theme?: Theme;
  /** Placeholder text */
  placeholder?: string;
  /** Accessible label for the editor content area */
  ariaLabel?: string;
  /** Plugin registry for dynamic extension loading */
  pluginRegistry?: PluginRegistry;
  /** Called when editor gains focus */
  onFocus?: () => void;
  /** Called when editor loses focus */
  onBlur?: () => void;
  /** Compile Markdown or plain text in `value` into HTML. */
  autoCompile?: boolean;
  /** Called with the compiled document after content changes. */
  onCompile?: (document: CompiledDocument) => void;
  /** Origin used when compiling and recognizing links. */
  siteOrigin?: string;
  /** Children to render */
  children: React.ReactNode;
}

/**
 * Lifecycle component that bridges props to the Zustand store.
 *
 * Initializes the Tiptap editor via `useEditor` and syncs
 * `theme` and `readOnly` props to the store. Does NOT use
 * React Context — the Zustand store IS the context.
 */
export function EditorProvider({
  value,
  onChange,
  readOnly = false,
  theme = 'light',
  placeholder,
  ariaLabel,
  pluginRegistry,
  onFocus,
  onBlur,
  autoCompile = false,
  onCompile,
  siteOrigin = '',
  children,
}: EditorProviderProps) {
  useEditor({
    value,
    onChange,
    placeholder,
    readOnly,
    ariaLabel,
    pluginRegistry,
    onFocus,
    onBlur,
    autoCompile,
    onCompile,
    siteOrigin,
  });

  const setTheme = useEditorStore((s) => s.setTheme);
  const setReadOnly = useEditorStore((s) => s.setReadOnly);
  const setSiteOrigin = useEditorStore((s) => s.setSiteOrigin);

  // Sync theme prop → store
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  // Sync readOnly prop → store
  useEffect(() => {
    setReadOnly(readOnly);
  }, [readOnly, setReadOnly]);

  useEffect(() => {
    setSiteOrigin(siteOrigin);
  }, [siteOrigin, setSiteOrigin]);

  return <>{children}</>;
}
