/**
 * Utils barrel — re-exports DOM and string helpers.
 */
export {
  sanitizeHTML,
  getSelectionRect,
  focusFirstFocusable,
  trapFocus,
  isElementVisible,
} from './dom';
export { isValidURL, escapeHTML, truncate, isMac, formatShortcut } from './string';
