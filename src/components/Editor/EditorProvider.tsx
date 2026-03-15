import { useEffect } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { useEditorStore } from '@/core/store';
import type { Theme } from '@/types';

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
  /** Called when editor gains focus */
  onFocus?: () => void;
  /** Called when editor loses focus */
  onBlur?: () => void;
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
  onFocus,
  onBlur,
  children,
}: EditorProviderProps) {
  // Initialize and manage the Tiptap editor lifecycle
  useEditor({ value, onChange, placeholder, readOnly, onFocus, onBlur });

  const setTheme = useEditorStore((s) => s.setTheme);
  const setReadOnly = useEditorStore((s) => s.setReadOnly);

  // Sync theme prop → store
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  // Sync readOnly prop → store
  useEffect(() => {
    setReadOnly(readOnly);
  }, [readOnly, setReadOnly]);

  return <>{children}</>;
}
