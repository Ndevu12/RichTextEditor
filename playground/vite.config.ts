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
    dedupe: ['react', 'react-dom'],
    alias: [
      // The linked dist resolves react from the repo root, a second copy.
      { find: /^react$/, replacement: resolve(__dirname, 'node_modules/react') },
      {
        find: /^react\/jsx-runtime$/,
        replacement: resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
      },
      { find: /^react-dom$/, replacement: resolve(__dirname, 'node_modules/react-dom') },
      {
        find: /^react-dom\/client$/,
        replacement: resolve(__dirname, 'node_modules/react-dom/client.js'),
      },
      { find: `${localPackageName}/styles`, replacement: localStylesPath },
      { find: `${localPackageName}/styles.css`, replacement: localStylesPath },
      { find: localPackageName, replacement: localDistPath },
    ],
  },
});
