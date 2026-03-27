import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const isGHPages = process.env.DEPLOY_PAGES === 'true';
const localPackageName = 'rich-text-editor-ndevu';
const localDistPath = resolve(__dirname, '../dist');
const localStylesPath = resolve(__dirname, '../dist/index.css');

export default defineConfig({
  plugins: [react()],
  base: isGHPages ? '/RichTextEditor/playground/' : '/',
  optimizeDeps: {
    // Keep the linked package out of prebundling so local dist/source updates are picked up in dev.
    exclude: [localPackageName],
  },
  server: {
    port: 4000,
    open: true,
    watch: {
      ignored: [`!**/node_modules/${localPackageName}/**`],
    },
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      [`${localPackageName}/styles`]: localStylesPath,
      [`${localPackageName}/styles.css`]: localStylesPath,
      [localPackageName]: localDistPath,
    },
  },
});
