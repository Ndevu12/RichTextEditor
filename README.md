# RichTextEditor

A free, open-source rich text editor for React. It is lightweight, extensible, and published as an npm package for production use.

[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/rich-text-editor-ndevu.svg)](https://www.npmjs.com/package/rich-text-editor-ndevu)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Live demos](#live-demos)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Usage](#usage)
- [API reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Overview

**RichTextEditor** is a React component for formatting and editing HTML content. It suits blogs, content management systems, comment threads, documentation tools, and any application where users need structured text without leaving the page.

The editor is built on [Tiptap](https://tiptap.dev/) and ProseMirror, with TypeScript types included in the package.

## Features

- **Text formatting:** bold, italic, underline, strikethrough
- **Headings:** levels H1 through H6
- **Lists:** ordered and unordered
- **Links:** insert and edit hyperlinks
- **Images:** embed via URL or file upload
- **Blockquotes:** styled quote blocks
- **Code:** inline code and fenced code blocks with syntax highlighting
- **History:** undo and redo
- **Clipboard:** paste from external sources with formatting preserved where possible
- **Theming:** light and dark modes
- **Accessibility:** ARIA attributes and keyboard navigation
- **TypeScript:** full type definitions

## Live demos

| Demo | Description |
|------|-------------|
| [Playground](https://ndevu12.github.io/RichTextEditor/playground/) | Interactive sandbox: toolbar presets, themes, and live HTML output |
| [React (Vite)](https://ndevu12.github.io/RichTextEditor/react-demo/) | Blog-style integration in a React and Vite app |
| [Next.js](https://ndevu12.github.io/RichTextEditor/nextjs-demo/) | Next.js (React 19-compatible baseline) integration example |
| [Storybook](https://ndevu12.github.io/RichTextEditor/storybook/) | Component gallery with controls and accessibility checks |

## Installation

Install the package with your preferred client:

```bash
npm install rich-text-editor-ndevu
```

```bash
yarn add rich-text-editor-ndevu
```

```bash
pnpm add rich-text-editor-ndevu
```

### Peer dependencies

React 18 or newer is required:

```bash
npm install react react-dom
```

```bash
yarn add react react-dom
```

```bash
pnpm add react react-dom
```

## Quick start

```tsx
import React, { useState } from 'react';
import { RichTextEditor } from 'rich-text-editor-ndevu';
import 'rich-text-editor-ndevu/styles.css';

export default function App() {
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>My editor</h1>
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

Import the stylesheet (`rich-text-editor-ndevu/styles.css`) so layout and toolbar render correctly. If your bundler treats CSS imports as side effects, styles may also load when you import the component alone.

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

## API reference

### Component props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | HTML string for the current content. |
| `onChange` | `(value: string) => void` | `N/A` | Called when content changes; receives the updated HTML. |
| `placeholder` | `string` | `'Write something...'` | Shown when the editor is empty. |
| `readOnly` | `boolean` | `false` | Renders the editor as read-only when `true`. |
| `toolbar` | `ToolbarItem[]` | All items | Toolbar button identifiers; use `'\|'` as a visual separator. |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme. |
| `minHeight` | `string \| number` | `'200px'` | Minimum height of the editable region. |
| `maxHeight` | `string \| number` | `undefined` | Maximum height before the region scrolls. |
| `className` | `string` | `undefined` | Extra class on the editor wrapper. |
| `style` | `React.CSSProperties` | `undefined` | Inline styles on the editor wrapper. |
| `onFocus` | `() => void` | `undefined` | Called when the editor receives focus. |
| `onBlur` | `() => void` | `undefined` | Called when the editor loses focus. |
| `ariaLabel` | `string` | `'Rich text editor'` | Accessible name for the editing surface. |

### Toolbar migration (non-breaking)

Existing toolbar arrays are still supported:

```tsx
<RichTextEditor toolbar={['bold', 'italic', '|', 'link', 'image']} />
```

You can gradually migrate to rich toolbar objects for dynamic behavior:

```tsx
import type { ToolbarInput } from 'rich-text-editor-ndevu';

const toolbar: ToolbarInput = [
  { id: 'bold' },
  { id: 'italic', label: 'Emphasis' },
  { type: 'separator' },
  {
    id: 'undo',
    isDisabled: ({ readOnly }) => readOnly,
    label: ({ readOnly }) => (readOnly ? 'Undo (read-only)' : 'Undo'),
  },
];

<RichTextEditor value="" onChange={setContent} toolbar={toolbar} />;
```

Rich entries support dynamic resolvers for:

- `label`
- `icon`
- `shortcut`
- `isVisible`
- `isDisabled`
- `isActive`

Separators can be either `'|'` or `{ type: 'separator' }`.

### Toolbar items

Values accepted by the `toolbar` prop:

| Value | Description |
|-------|-------------|
| `'bold'` | Bold |
| `'italic'` | Italic |
| `'underline'` | Underline |
| `'strike'` | Strikethrough |
| `'heading1'` to `'heading6'` | Heading levels |
| `'bulletList'` | Unordered list |
| `'orderedList'` | Ordered list |
| `'blockquote'` | Blockquote |
| `'code'` | Inline code |
| `'codeBlock'` | Fenced code block |
| `'link'` | Insert or edit a link |
| `'image'` | Insert an image |
| `'undo'` | Undo |
| `'redo'` | Redo |
| `'\|'` | Separator between groups |

## Contributing

Contributions are welcome. [CONTRIBUTING.md](./CONTRIBUTING.md) covers the code of conduct, branch workflow, coding standards, tests, and pull request expectations.

**Prerequisites:** Node.js 20 or newer and Yarn 4 (enable Corepack with `corepack enable` if needed). See CONTRIBUTING for details.

### Local development

```bash
git clone https://github.com/Ndevu12/RichTextEditor.git
cd RichTextEditor
yarn install
yarn --cwd playground install
yarn --cwd examples/react-demo install
yarn --cwd examples/nextjs-demo install
yarn dev
```

The `dev` script runs the library build in watch mode alongside the playground.
This split is intentional:

- `playground/` is the maintainer-focused local sandbox for in-repo development.
- `examples/react-demo` and `examples/nextjs-demo` are npm-consumer demos and must keep `rich-text-editor-ndevu` as a semver dependency (not `link:`/`file:`).

Before opening a pull request:

```bash
yarn lint
yarn verify:demos
yarn test
yarn --cwd playground install
yarn --cwd playground build
yarn --cwd examples/react-demo install
yarn --cwd examples/react-demo build
yarn --cwd examples/nextjs-demo install
yarn --cwd examples/nextjs-demo build
```

### Reporting issues

Open an issue on [GitHub](https://github.com/Ndevu12/RichTextEditor/issues/new). Include a clear title, steps to reproduce, expected vs. actual behavior, and your environment (OS, Node.js version, browser).

## License

This project is licensed under the [BSD 3-Clause License](./LICENSE).

Copyright (c) 2026 Jean Paul Elisa NIYOKWIZERWA
