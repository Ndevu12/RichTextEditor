# Playground

Vite-based maintainer sandbox for manual testing and fast local iteration on the in-repo editor source.

## Role in this repository

- `playground/` is **local-first** and intended for maintainers/contributors working on this codebase.
- `examples/` are **npm-consumer** demos and should stay aligned with how external users install the package.

## Quick Start

```bash
# From the project root
yarn --cwd playground install

# Run library watch + playground dev server together
yarn dev
```

## Maintainer Validation (local-first playground)

Run these when validating the local development loop:

```bash
yarn --cwd playground install
yarn dev
yarn --cwd playground build
```

## Consumer Validation (npm demos)

Run these to validate the npm-consumer example apps:

```bash
yarn verify:demos
yarn --cwd examples/react-demo install
yarn --cwd examples/react-demo build
yarn --cwd examples/nextjs-demo install
yarn --cwd examples/nextjs-demo build
```

## Features

- **Full-featured editor** with all toolbar items
- **Theme toggle** — switch between light and dark themes
- **Read-only toggle** — test read-only mode
- **Toolbar presets** — select from 4 preset toolbar configurations (full, minimal, writing, code)
- **HTML output panel** — view the raw HTML output in real-time
- **Responsive layout** — works on mobile viewports
