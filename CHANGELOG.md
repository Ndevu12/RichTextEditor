# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Security policy** — Added `SECURITY.md` with reporting guidance

### Changed

- **Examples** — Bumped `rich-text-editor-ndevu` to `v0.1.1` in Next.js and React demos
- **CI/release workflow** — Enabled manual release dispatch and improved manual-run checks
- **Dependabot config** — Added root npm ecosystem updates and refined dependency update coverage
- **Dev tools** — Bumped `@eslint/js` from `9.39.4` to `10.0.1`
- **Playground** — Bumped `brace-expansion` from `5.0.4` to `5.0.5`

### Fixed

- **Release automation** — Skipped redundant publish/tag checks for manual release runs

## [0.1.1] - 2026-03-15

### Fixed

- **Toolbar UI** — Added SVG toolbar icons and improved toolbar/editor styling

## [0.1.0] - 2026-03-15

### Added

- **Core editor** — `RichTextEditor` component with controlled HTML value
- **Text formatting** — Bold, italic, underline, strikethrough, inline code
- **Headings** — H1–H6 via toolbar or `setHeading()` command
- **Lists** — Ordered and unordered lists with indent/outdent support
- **Blockquotes** — Toggle blockquote formatting
- **Links** — Insert/edit links with accessible dialog, autolink on paste
- **Images** — Insert via URL or drag-and-drop file upload (base64), with preview
- **Code blocks** — Syntax highlighting powered by highlight.js (common bundle)
- **History** — Undo/redo with 100-step depth and 500ms group delay
- **Clipboard** — Paste handling with HTML sanitization
- **Themes** — Light and dark themes via CSS custom properties (32 tokens each)
- **Customizable toolbar** — Declarative toolbar configuration with `ToolbarItem[]`
- **Read-only mode** — `readOnly` prop hides toolbar and disables editing
- **Accessibility** — Full keyboard navigation, roving tabindex, ARIA attributes, focus trap in dialogs
- **Hooks** — `useEditor`, `useHistory`, `useToolbar` for advanced usage
- **Headless API** — `createEditor()` for non-React or custom rendering
- **TypeScript** — Full type definitions with strict mode
- **Dual format** — ESM + CJS builds with `.d.ts` declarations
- **CSS bundle** — Importable via `rich-text-editor-ndevu/styles`
