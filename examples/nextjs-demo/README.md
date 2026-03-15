# Next.js Demo — SSR-Compatible Editor

A Next.js 14 (Pages Router) example demonstrating that `rich-text-editor-ndevu` works correctly in a server-rendered context.

## Key Technique

The editor uses `contentEditable`, which is browser-only. We use `next/dynamic` with `ssr: false` to avoid SSR hydration errors:

```tsx
const RichTextEditor = dynamic(
  () => import('rich-text-editor-ndevu').then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <div>Loading editor…</div> },
);
```

## Features

- **Dynamic import** with loading placeholder
- **Theme toggle** (light / dark)
- **Raw HTML** output panel
- **`transpilePackages`** configured in `next.config.js`

## Getting Started

```bash
cd examples/nextjs-demo
yarn install
yarn dev        # opens http://localhost:3001
```

## Project Structure

```
pages/
  _app.tsx             # Global CSS import
  index.tsx            # Home page with dynamic editor import
src/
  components/
    Header.tsx         # Page header with theme toggle
    HtmlOutput.tsx     # Collapsible raw HTML output
    index.ts           # Barrel export
  styles/
    app.css            # All styles (theme-aware via data-theme)
  utils/
    constants.ts       # INITIAL_CONTENT
next.config.js         # transpilePackages + eslint.ignoreDuringBuilds
```

## Notes

- **React 19 + Next.js 14**: Peer dep warnings are expected; works at runtime.
- **ESLint**: Skipped during `next build` because the root project uses ESLint 9 flat config, which is incompatible with Next.js 14's built-in ESLint integration.
