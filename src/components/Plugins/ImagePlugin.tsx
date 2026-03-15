/**
 * Image Plugin — helpers for image insertion.
 *
 * Uses @tiptap/extension-image configured in schema.ts.
 * Provides:
 * - insertImageByUrl:  insert an image node from a URL
 * - insertImageBase64: insert an image node from a base64 data URI
 * - readFileAsBase64:  convert a File to a base64 data URI (async)
 * - openImageDialog:   convenience to open the image dialog via store
 * - MAX_IMAGE_SIZE:    soft limit for file size warnings (5 MB)
 */

import type { Editor } from '@tiptap/core';
import { useEditorStore } from '@/core/store';

/** Maximum recommended image file size in bytes (5 MB). */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Insert an image into the editor via URL.
 *
 * @param editor - Tiptap editor instance
 * @param src    - Image URL
 * @param alt    - Alt text (optional but recommended)
 * @returns true if the command ran successfully
 */
export function insertImageByUrl(editor: Editor, src: string, alt?: string): boolean {
  return editor
    .chain()
    .focus()
    .setImage({ src, alt: alt || '' })
    .run();
}

/**
 * Insert an image into the editor from a base64 data URI.
 *
 * @param editor  - Tiptap editor instance
 * @param dataUri - base64 data URI (e.g. `data:image/png;base64,...`)
 * @param alt     - Alt text (optional but recommended)
 * @returns true if the command ran successfully
 */
export function insertImageBase64(editor: Editor, dataUri: string, alt?: string): boolean {
  return editor
    .chain()
    .focus()
    .setImage({ src: dataUri, alt: alt || '' })
    .run();
}

/**
 * Read a File object and return a base64 data URI.
 *
 * @param file - File from `<input type="file">` or drag-and-drop
 * @returns Promise resolving to a data URI string
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader result is not a string'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Open the image dialog via the editor store.
 */
export function openImageDialog(): void {
  useEditorStore.getState().setOpenDialog('image');
}
