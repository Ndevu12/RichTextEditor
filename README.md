# RichTextEditor

> Free and open-source Rich Text Editor for React — lightweight, extensible, and ready to use as an npm package.

[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/rich-text-editor-ndevu.svg)](https://www.npmjs.com/package/rich-text-editor-ndevu)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

---

## Live Demos

| Demo | Description |
|------|-------------|
| [🎮 Playground](https://ndevu12.github.io/RichTextEditor/playground/) | Interactive sandbox — try toolbar presets, themes, and live HTML output |
| [⚛️ React Demo](https://ndevu12.github.io/RichTextEditor/react-demo/) | Blog-style integration example with a React + Vite app |
| [▲ Next.js Demo](https://ndevu12.github.io/RichTextEditor/nextjs-demo/) | Next.js 14 integration example |
| [📖 Storybook](https://ndevu12.github.io/RichTextEditor/storybook/) | Component gallery with interactive controls and accessibility checks |

---

## Table of Contents

- [Overview](#overview)
- [Live Demos](#live-demos)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Props / API](#props--api)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**RichTextEditor** is a free, open-source rich text editing component for React applications. It provides a clean, intuitive interface for formatting and editing content, making it suitable for blog platforms, content-management systems, comment sections, documentation tools, and any application where users need to write formatted text.

---

## Features

- ✏️ **Text Formatting** — Bold, italic, underline, strikethrough
- 🔤 **Headings** — H1–H6 heading levels
- 📋 **Lists** — Ordered and unordered lists
- 🔗 **Links** — Insert and edit hyperlinks
- 🖼️ **Images** — Embed images via URL or file upload
- 💬 **Blockquotes** — Styled quote blocks
- `</>` **Code Blocks** — Inline code and fenced code blocks with syntax highlighting
- ↩️ **Undo / Redo** — Full history support
- 📋 **Copy / Paste** — Preserves formatting when pasting from external sources
- 🌗 **Dark Mode** — Built-in light and dark theme support
- ♿ **Accessible** — ARIA-compliant and keyboard-navigable
- 📦 **TypeScript** — Ships with full TypeScript type definitions

---

## Installation

Install the package using your preferred package manager:

```bash
# npm
npm install rich-text-editor-ndevu

# yarn
yarn add rich-text-editor-ndevu

# pnpm
pnpm add rich-text-editor-ndevu
```

### Peer Dependencies

Make sure your project has the following peer dependencies installed:

```bash
# npm
npm install react react-dom

# yarn
yarn add react react-dom

# pnpm
pnpm add react react-dom
```

---

## Quick Start

```tsx
import React, { useState } from 'react';
import { RichTextEditor } from 'rich-text-editor-ndevu';
import 'rich-text-editor-ndevu/styles.css';

export default function App() {
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>My Editor</h1>
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Start typing..."
      />
      <pre>{content}</pre>
    </div>
  );
}
```

> **Note:** The CSS import (`rich-text-editor-ndevu/styles.css`) is required for the editor
> to render correctly. If your bundler already handles CSS side-effects, the styles are
> also auto-imported when you import the component.

---

## Usage

### Controlled component

```tsx
import React, { useState } from 'react';
import { RichTextEditor } from 'rich-text-editor-ndevu';

function ControlledExample() {
  const [html, setHtml] = useState('<p>Hello, <strong>world</strong>!</p>');

  return (
    <RichTextEditor
      value={html}
      onChange={(newValue) => setHtml(newValue)}
    />
  );
}
```

### Read-only mode

```tsx
import { RichTextEditor } from 'rich-text-editor-ndevu';

function ReadOnlyExample() {
  return (
    <RichTextEditor
      value="<p>This content is <em>read-only</em>.</p>"
      readOnly
    />
  );
}
```

### Custom toolbar

```tsx
import { RichTextEditor } from 'rich-text-editor-ndevu';

function CustomToolbarExample() {
  return (
    <RichTextEditor
      value=""
      onChange={console.log}
      toolbar={['bold', 'italic', 'underline', '|', 'link', 'image']}
    />
  );
}
```

### Dark mode

```tsx
import { RichTextEditor } from 'rich-text-editor-ndevu';

function DarkModeExample() {
  return (
    <RichTextEditor
      value=""
      onChange={console.log}
      theme="dark"
    />
  );
}
```

---

## Props / API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | HTML string representing the current editor content. |
| `onChange` | `(value: string) => void` | — | Callback fired whenever the content changes. Receives the updated HTML string. |
| `placeholder` | `string` | `'Write something...'` | Placeholder text shown when the editor is empty. |
| `readOnly` | `boolean` | `false` | When `true`, the editor is rendered in read-only mode. |
| `toolbar` | `ToolbarItem[]` | All items | Array of toolbar button identifiers. Use `'|'` as a separator. |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme of the editor. |
| `minHeight` | `string \| number` | `'200px'` | Minimum height of the editable area. |
| `maxHeight` | `string \| number` | `undefined` | Maximum height before the area becomes scrollable. |
| `className` | `string` | `undefined` | Additional CSS class applied to the editor wrapper. |
| `style` | `React.CSSProperties` | `undefined` | Inline styles applied to the editor wrapper. |
| `onFocus` | `() => void` | `undefined` | Callback fired when the editor gains focus. |
| `onBlur` | `() => void` | `undefined` | Callback fired when the editor loses focus. |
| `ariaLabel` | `string` | `'Rich text editor'` | Accessible label for the editor content area (announced by screen readers). |

### Toolbar Items

Available values for the `toolbar` prop:

| Value | Description |
|-------|-------------|
| `'bold'` | Bold text |
| `'italic'` | Italic text |
| `'underline'` | Underlined text |
| `'strike'` | Strikethrough text |
| `'heading1'` – `'heading6'` | Heading levels |
| `'bulletList'` | Unordered list |
| `'orderedList'` | Ordered list |
| `'blockquote'` | Blockquote |
| `'code'` | Inline code |
| `'codeBlock'` | Fenced code block |
| `'link'` | Insert / edit a link |
| `'image'` | Insert an image |
| `'undo'` | Undo last action |
| `'redo'` | Redo last undone action |
| `'\|'` | Visual separator |

---

## Contributing

Contributions are very welcome! Please read the steps below before opening a pull request.

### Getting started locally

```bash
# 1. Fork and clone the repository
git clone https://github.com/Ndevu12/RichTextEditor.git
cd RichTextEditor

# 2. Install dependencies
yarn install

# 3. Start the development server
yarn dev
```

### Contribution workflow

1. **Open an issue** — describe the bug or feature you would like to work on.
2. **Fork** the repository and create a new branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** — write clear, focused commits.
4. **Run tests and linting** before pushing:
   ```bash
   yarn lint
   yarn test
   ```
5. **Push** your branch and **open a Pull Request** against `main`.
6. Your PR will be reviewed by a maintainer. Please address any feedback promptly.

### Code style

- TypeScript is required for all source files.
- Follow the existing ESLint and Prettier configuration.
- Write or update tests for every change in behaviour.

### Reporting bugs

Please [open an issue](https://github.com/Ndevu12/RichTextEditor/issues/new) with:
- A clear title and description
- Steps to reproduce the problem
- The expected vs. actual behaviour
- Your environment (OS, Node.js version, browser)

---

## License

This project is licensed under the **BSD 3-Clause License** — see the [LICENSE](./LICENSE) file for details.

Copyright © 2026 Jean Paul Elisa NIYOKWIZERWA
