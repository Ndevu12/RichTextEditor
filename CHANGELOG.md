# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Release** — GitHub publishes through npm's trusted publisher. The token that skips two-factor authentication is no longer sent.

## [0.2.2] - 2026-11-03

### Added

- **SEO panel** — The editor can show a score, capture a title, description, and slug, and point out headings, image descriptions, and links. Internal links stay on the page. External links open in a new tab and are not followed.
- **Text compilation** — Markdown and plain text can be turned into editor HTML as you edit. `compileDocument` returns HTML, Markdown, plain text, and the SEO report together.
- **TypeScript** — `import 'rich-text-editor-ndevu/styles.css'` typechecks from the package. Public types resolve with React and do not ask you to install Tiptap, Zustand, or the highlighter.
- **Toolbar** — Buttons and icons shrink with the editor width. On a narrow card, marks, headings, and lists stay on the first line, and code, link, image, and history stay on the second.
- **Preview** — Editor, HTML, and MD sit in the playground header. The editor shows the preview panel only when a host turns `preview` on and places the switch.
- **Security policy** — Added `SECURITY.md` with reporting guidance

### Changed

- **Development** — CI, release, and GitHub Pages run on Node.js 26.
- **Development tools** — Storybook, Vite, and Vitest are on the releases that close the open development advisories. Dependabot now watches the playground and both examples as well as the package root.
- **Examples** — Bumped `rich-text-editor-ndevu` to `v0.1.1` in Next.js and React demos
- **CI/release workflow** — Enabled manual release dispatch and improved manual-run checks
- **Dependabot config** — Added root npm ecosystem updates and refined dependency update coverage
- **Dev tools** — Bumped `@eslint/js` from `9.39.4` to `10.0.1`
- **Playground** — Bumped `brace-expansion` from `5.0.4` to `5.0.5`

### Fixed

- **Playground** — GitHub Pages builds again. The playground stays on Vite 6, with a React plugin that Vite 6 can load.
- **Vite** — Storybook's Vite requirement no longer stays on 8.2.0. The six remaining Vite advisories were for that second copy.
- **Dependencies** — The editor is on Tiptap and ProseMirror releases that close the paste script-injection and Markdown denial-of-service advisories.
- **Next.js example** — The demo is on the Next.js and image-library releases that close the image-optimization remote code execution advisories.
- **Compilation and SEO** — Reading a document for plain text or the SEO score no longer stalls on a long unclosed tag.
- **Release automation** — Skipped redundant publish/tag checks for manual release runs
- **Release** — A tag that does not match the package version fails. `v0.2.0` did not publish because the package was still `0.1.1`.

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
