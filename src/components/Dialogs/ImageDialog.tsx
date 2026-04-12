/**
 * Image Dialog — accessible modal for inserting images.
 *
 * Features:
 * - URL input with image preview
 * - File upload via browse button or drag-and-drop
 * - Base64 conversion for uploaded files
 * - Alt text input (recommended)
 * - File size warning (> 5 MB)
 * - Same a11y patterns as LinkDialog:
 *   role="dialog", aria-modal, focus trap, Escape to close
 */

import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useEditorStore } from '@/core/store';
import {
  insertImageByUrl,
  insertImageBase64,
  readFileAsBase64,
  MAX_IMAGE_SIZE,
} from '../Plugins/ImagePlugin';

type ImageSource = 'url' | 'file';

export function ImageDialog() {
  const editor = useEditorStore((s) => s.editor);
  const setOpenDialog = useEditorStore((s) => s.setOpenDialog);

  const [source, setSource] = useState<ImageSource>('url');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [sizeWarning, setSizeWarning] = useState('');

  const urlRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
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
      setError('Image URL is required');
      return false;
    }
    if (!/^(https?:\/\/|data:image\/|\/|\.\.?\/)/.test(value.trim())) {
      setError('URL must start with http://, https://, or be a relative path');
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

  // ── Process a file (shared by browse & drag-and-drop) ──────
  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSizeWarning('');
    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setSizeWarning(`File is ${sizeMB} MB. Large images may slow down the editor.`);
    }

    try {
      const dataUri = await readFileAsBase64(file);
      setFilePreview(dataUri);
      setFileName(file.name);
      setSource('file');
      setError('');
    } catch {
      setError('Failed to read file');
    }
  }, []);

  // ── File input change ──────────────────────────────────────
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  // ── Drag-and-drop handlers ─────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  // ── Submit: insert image ───────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!editor) return;

    if (source === 'url') {
      if (!validateUrl(url)) return;
      insertImageByUrl(editor, url.trim(), alt.trim() || undefined);
    } else {
      if (!filePreview) {
        setError('Please select or drop an image file');
        return;
      }
      insertImageBase64(editor, filePreview, alt.trim() || undefined);
    }

    close();
  }, [editor, source, url, alt, filePreview, validateUrl, close]);

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

  // ── Clear file and reset to URL mode ───────────────────────
  const clearFile = useCallback(() => {
    setFilePreview(null);
    setFileName('');
    setSizeWarning('');
    setSource('url');
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  // ── Compute preview URL (either file preview or typed URL) ─
  const getSafePreviewSrc = (): string | null => {
    if (source === 'file') {
      return filePreview;
    }

    const trimmed = url.trim();
    if (!trimmed) {
      return null;
    }

    try {
      const parsed = new URL(trimmed, window.location.origin);
      const scheme = parsed.protocol.replace(':', '').toLowerCase();

      // Only allow http/https for URL-based previews. Other schemes, including
      // generic data: URLs, are rejected to avoid loading potentially unsafe content.
      if (scheme === 'http' || scheme === 'https') {
        return parsed.toString();
      }

      return null;
    } catch {
      return null;
    }
  };

  const previewSrc = getSafePreviewSrc();
  const showPreview = !!previewSrc;

  return (
    <div className="rte-dialog__overlay" onClick={handleOverlayClick} role="presentation">
      <div
        ref={dialogRef}
        className="rte-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rte-image-dialog-title"
        onKeyDown={handleKeyDown}
      >
        <h2 id="rte-image-dialog-title" className="rte-dialog__title">
          Insert Image
        </h2>

        {/* ── Drop zone / file upload ───────────────────── */}
        <div
          className={`rte-dialog__dropzone ${isDragging ? 'rte-dialog__dropzone--active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {filePreview ? (
            <div className="rte-dialog__file-info">
              <span className="rte-dialog__file-name">{fileName}</span>
              <button
                type="button"
                className="rte-dialog__file-clear"
                onClick={clearFile}
                aria-label="Remove selected file"
              >
                ×
              </button>
            </div>
          ) : (
            <p className="rte-dialog__dropzone-text">
              Drag &amp; drop an image, or{' '}
              <button
                type="button"
                className="rte-dialog__browse-button"
                onClick={() => fileRef.current?.click()}
              >
                browse
              </button>
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="rte-dialog__file-input"
            onChange={handleFileChange}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        {sizeWarning && (
          <p className="rte-dialog__warning" role="status">
            {sizeWarning}
          </p>
        )}

        {/* ── Separator ─────────────────────────────────── */}
        <div className="rte-dialog__separator">
          <span>or enter URL</span>
        </div>

        {/* ── URL input ─────────────────────────────────── */}
        <div className="rte-dialog__field">
          <label htmlFor="rte-image-url" className="rte-dialog__label">
            Image URL
          </label>
          <input
            ref={urlRef}
            id="rte-image-url"
            className={`rte-dialog__input ${error && source === 'url' ? 'rte-dialog__input--error' : ''}`}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
              if (e.target.value.trim()) setSource('url');
            }}
            placeholder="https://example.com/photo.jpg"
            autoComplete="off"
          />
        </div>

        {/* ── Alt text ──────────────────────────────────── */}
        <div className="rte-dialog__field">
          <label htmlFor="rte-image-alt" className="rte-dialog__label">
            Alt text (recommended)
          </label>
          <input
            id="rte-image-alt"
            className="rte-dialog__input"
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image"
            autoComplete="off"
          />
        </div>

        {/* ── Preview ───────────────────────────────────── */}
        {showPreview && (
          <div className="rte-dialog__preview">
            <img
              src={previewSrc!}
              alt={alt || 'Preview'}
              className="rte-dialog__preview-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.display = 'block';
              }}
            />
          </div>
        )}

        {/* ── Error ──────────────────────────────────────── */}
        {error && (
          <p className="rte-dialog__error" role="alert">
            {error}
          </p>
        )}

        {/* ── Actions ────────────────────────────────────── */}
        <div className="rte-dialog__actions">
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
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
