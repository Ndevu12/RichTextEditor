# React Demo — Blog Post Editor

A Vite + React example showing `rich-text-editor-ndevu` in a realistic blog-post editing scenario.

## Features

- **Title input** + rich text body editor
- **Theme toggle** (light / dark)
- **Live preview** — render the HTML output as a formatted article
- **Save button** — logs the payload to the console
- **Raw HTML** — collapsible `<details>` showing the editor's HTML

## Getting Started

```bash
cd examples/react-demo
yarn install
yarn dev        # opens http://localhost:5174
```

## Project Structure

```
src/
  components/
    Header.tsx         # Top bar with theme/preview/save buttons
    Preview.tsx        # Read-only HTML preview panel
    HtmlOutput.tsx     # Collapsible raw HTML output
    index.ts           # Barrel export
  styles/
    app.css            # All styles (theme-aware via data-theme)
  utils/
    constants.ts       # INITIAL_CONTENT
  App.tsx              # Root composition (state only, no inline styles)
  main.tsx             # React 19 entry point
```
