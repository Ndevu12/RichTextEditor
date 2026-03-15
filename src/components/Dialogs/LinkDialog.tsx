/**
 * Link Dialog — accessible modal for inserting/editing links.
 *
 * Features:
 * - role="dialog", aria-modal, aria-labelledby
 * - Focus trap (Tab cycles through fields and buttons)
 * - Escape to close
 * - Auto-focus URL field on open
 * - Edit mode: pre-fills URL + shows "Remove Link" button
 * - URL validation: requires protocol or relative path
 */

import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useEditorStore } from '@/core/store';
import { getActiveLinkAttrs, getSelectedText, applyLink, removeLink } from '../Plugins/LinkPlugin';

/**
 * Compute initial dialog state from the current editor selection.
 * Runs once when the dialog mounts (no effect needed).
 */
function getInitialState(editor: import('@tiptap/core').Editor | null) {
  if (!editor) return { url: '', text: '', isEditMode: false };

  const existingLink = getActiveLinkAttrs(editor);
  const selectedText = getSelectedText(editor);

  return {
    url: existingLink?.href ?? '',
    text: selectedText,
    isEditMode: !!existingLink,
  };
}

export function LinkDialog() {
  const editor = useEditorStore((s) => s.editor);
  const setOpenDialog = useEditorStore((s) => s.setOpenDialog);

  const initial = getInitialState(editor);
  const [url, setUrl] = useState(initial.url);
  const [text, setText] = useState(initial.text);
  const [error, setError] = useState('');
  const [isEditMode] = useState(initial.isEditMode);

  const urlRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Save the element that had focus before the dialog opened (for focus restoration)
  const triggerRef = useRef<Element | null>(document.activeElement);

  // ── Auto-focus URL field on mount ──────────────────────────
  useLayoutEffect(() => {
    urlRef.current?.focus();
  }, []);

  // ── URL validation ─────────────────────────────────────────
  const validateUrl = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError('URL is required');
      return false;
    }
    // Accept http(s), mailto, tel, relative paths, and anchors
    if (!/^(https?:\/\/|mailto:|tel:|\/|#)/.test(value.trim())) {
      setError('URL must start with http://, https://, mailto:, tel:, /, or #');
      return false;
    }
    setError('');
    return true;
  }, []);

  // ── Close dialog ───────────────────────────────────────────
  const close = useCallback(() => {
    setOpenDialog(null);
    // Restore focus to the element that triggered the dialog
    requestAnimationFrame(() => {
      (triggerRef.current as HTMLElement)?.focus?.();
    });
  }, [setOpenDialog]);

  // ── Insert / update link ───────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!editor || !validateUrl(url)) return;
    applyLink(editor, url.trim(), text.trim() || undefined);
    close();
  }, [editor, url, text, validateUrl, close]);

  // ── Remove link (edit mode only) ──────────────────────────
  const handleRemove = useCallback(() => {
    if (!editor) return;
    removeLink(editor);
    close();
  }, [editor, close]);

  // ── Keyboard: Escape to close, Enter to submit ─────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = dialog.querySelectorAll<HTMLElement>(
          'input, button, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [close, handleSubmit],
  );

  // ── Click overlay to close ─────────────────────────────────
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) close();
    },
    [close],
  );

  return (
    <div className="rte-dialog__overlay" onClick={handleOverlayClick} role="presentation">
      <div
        ref={dialogRef}
        className="rte-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rte-link-dialog-title"
        onKeyDown={handleKeyDown}
      >
        <h2 id="rte-link-dialog-title" className="rte-dialog__title">
          {isEditMode ? 'Edit Link' : 'Insert Link'}
        </h2>

        <div className="rte-dialog__field">
          <label htmlFor="rte-link-url" className="rte-dialog__label">
            URL
          </label>
          <input
            ref={urlRef}
            id="rte-link-url"
            className={`rte-dialog__input ${error ? 'rte-dialog__input--error' : ''}`}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="https://example.com"
            autoComplete="off"
          />
          {error && (
            <p className="rte-dialog__error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="rte-dialog__field">
          <label htmlFor="rte-link-text" className="rte-dialog__label">
            Display text
          </label>
          <input
            id="rte-link-text"
            className="rte-dialog__input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Link text (optional)"
            autoComplete="off"
          />
        </div>

        <div className="rte-dialog__actions">
          {isEditMode && (
            <button
              type="button"
              className="rte-dialog__button rte-dialog__button--danger"
              onClick={handleRemove}
            >
              Remove Link
            </button>
          )}
          <div className="rte-dialog__actions-right">
            <button
              type="button"
              className="rte-dialog__button rte-dialog__button--secondary"
              onClick={close}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rte-dialog__button rte-dialog__button--primary"
              onClick={handleSubmit}
            >
              {isEditMode ? 'Update Link' : 'Insert Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
