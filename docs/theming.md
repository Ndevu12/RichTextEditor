# Theming

Guide to using themes and creating custom themes.

---

## Theme Prop

The editor ships with two built-in themes: `light` (default) and `dark`.

```tsx
<RichTextEditor theme="light" />  {/* default */}
<RichTextEditor theme="dark" />
```

Switching the `theme` prop at runtime immediately applies the new theme — no page reload needed.

---

## How It Works

Themes use **CSS custom properties** scoped under a `data-theme` attribute:

```html
<div class="rte-editor" data-theme="dark">
  <!-- toolbar + content area -->
</div>
```

All editor styles reference `var(--rte-*)` tokens instead of hard-coded colors. The theme CSS files define these tokens under `[data-theme='light']` and `[data-theme='dark']` selectors.

---

## CSS Custom Properties

### Surface Colors

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-bg` | `#ffffff` | `#1e1e2e` | Editor background |
| `--rte-text` | `#1a1a2e` | `#cdd6f4` | Main text color |
| `--rte-text-muted` | `#6b7280` | `#a6adc8` | Muted/secondary text |
| `--rte-border` | `#e0e0e0` | `#45475a` | Border color |

### Toolbar

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-toolbar-bg` | `#f8f9fa` | `#181825` | Toolbar background |
| `--rte-toolbar-border` | `#e0e0e0` | `#313244` | Toolbar bottom border |

### Buttons

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-button-hover` | `#e9ecef` | `#313244` | Button hover background |
| `--rte-button-active` | `#dee2e6` | `#45475a` | Button active (mousedown) |
| `--rte-button-pressed` | `#d0d7de` | `#585b70` | Button pressed (toggle on) |
| `--rte-button-text` | `#374151` | `#cdd6f4` | Button icon/text color |

### Accent & Focus

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-accent` | `#0969da` | `#89b4fa` | Accent color (links, focus) |
| `--rte-placeholder` | `#9ca3af` | `#585b70` | Placeholder text color |
| `--rte-focus-ring` | `rgba(9,105,218,0.3)` | `rgba(137,180,250,0.3)` | Focus ring shadow |

### Code

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-code-bg` | `#f6f8fa` | `#313244` | Inline code background |
| `--rte-code-text` | `#1a1a2e` | `#cdd6f4` | Inline code text |
| `--rte-codeblock-bg` | `#f6f8fa` | `#1e1e2e` | Code block background |

### Blockquote

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-blockquote-border` | `#d0d7de` | `#585b70` | Blockquote left border |
| `--rte-blockquote-text` | `#57606a` | `#a6adc8` | Blockquote text color |

### Links

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-link-color` | `#0969da` | `#89b4fa` | Link text color |

### Dialogs

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-dialog-overlay` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.6)` | Dialog overlay |
| `--rte-dialog-bg` | `#ffffff` | `#1e1e2e` | Dialog background |
| `--rte-dialog-border` | `#e0e0e0` | `#45475a` | Dialog border |

### Form Inputs

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-input-bg` | `#ffffff` | `#313244` | Input background |
| `--rte-input-border` | `#d1d5db` | `#45475a` | Input border |
| `--rte-input-focus` | `#0969da` | `#89b4fa` | Input focus ring |

### Shared

| Token | Light | Dark | Description |
|-------|-------|------|-------------|
| `--rte-shadow` | `0 1px 3px rgba(0,0,0,0.12)` | `0 1px 3px rgba(0,0,0,0.4)` | Box shadow |
| `--rte-radius` | `8px` | `8px` | Border radius (large) |
| `--rte-radius-sm` | `4px` | `4px` | Border radius (small) |
| `--rte-font-family` | `system-ui, ...` | `system-ui, ...` | Body font stack |
| `--rte-font-mono` | `'Fira Code', ...` | `'Fira Code', ...` | Monospace font stack |
| `--rte-font-size` | `16px` | `16px` | Base font size |
| `--rte-line-height` | `1.6` | `1.6` | Base line height |

---

## Creating a Custom Theme

### Override CSS Variables

The simplest approach — override specific tokens in your app's CSS:

```css
/* my-custom-theme.css */
[data-theme='light'] {
  --rte-accent: #e91e63;          /* pink accent */
  --rte-focus-ring: rgba(233, 30, 99, 0.3);
  --rte-link-color: #e91e63;
  --rte-bg: #fffaf0;              /* warm background */
}
```

Import this CSS **after** the editor styles:

```tsx
import 'rich-text-editor-ndevu/styles';
import './my-custom-theme.css';
```

### Create a Third Theme

Define a new `data-theme` value and provide all tokens:

```css
/* theme-high-contrast.css */
[data-theme='high-contrast'] {
  --rte-bg: #000000;
  --rte-text: #ffffff;
  --rte-border: #ffffff;
  --rte-toolbar-bg: #111111;
  --rte-toolbar-border: #ffffff;
  --rte-button-hover: #333333;
  --rte-button-active: #444444;
  --rte-button-pressed: #555555;
  --rte-button-text: #ffffff;
  --rte-accent: #ffff00;
  --rte-placeholder: #888888;
  --rte-focus-ring: rgba(255, 255, 0, 0.5);
  /* ... define all --rte-* tokens */
}
```

Then extend the `Theme` type and pass custom value:

```tsx
<RichTextEditor theme={'high-contrast' as any} />
```

> **Note:** The TypeScript `Theme` type is `'light' | 'dark'`. A custom theme requires a type assertion. A future version may support arbitrary theme strings.

---

## Typography Customization

Prose content is styled under `.rte-content .tiptap`. Override these selectors for custom typography:

```css
/* Larger base text */
.rte-content .tiptap {
  font-size: 18px;
  line-height: 1.8;
}

/* Custom heading styles */
.rte-content .tiptap h1 {
  font-size: 2.5em;
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

---

## Code Block Theme

Code blocks use two syntax highlighting themes:
- **Light:** GitHub-inspired (in `highlight.css`)
- **Dark:** Catppuccin Mocha-inspired (in `highlight.css`)

The active theme is selected via `[data-theme='light']` and `[data-theme='dark']` selectors. To customize, override the `.hljs` classes under the appropriate `data-theme` scope.
