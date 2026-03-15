# Playground

Vite-based local playground for manual testing and experimentation with the Rich Text Editor.

## Quick Start

```bash
# From the project root — build the library first
yarn build

# Then start the playground
cd playground
yarn install
yarn dev
```

The playground uses `link:../` to reference the local package. After rebuilding the library (`yarn build` in root), changes are reflected on the next HMR or page reload.

## Features

- **Full-featured editor** with all toolbar items
- **Theme toggle** — switch between light and dark themes
- **Read-only toggle** — test read-only mode
- **Toolbar presets** — select from 4 preset toolbar configurations (full, minimal, writing, code)
- **HTML output panel** — view the raw HTML output in real-time
- **Responsive layout** — works on mobile viewports
