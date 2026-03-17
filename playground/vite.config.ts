import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const isGHPages = process.env.DEPLOY_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGHPages ? '/RichTextEditor/playground/' : '/',
  server: {
    port: 4000,
    open: true,
    watch: {
      ignored: ['!**/node_modules/rich-text-editor-ndevu/**'],
    },
  },
  optimizeDeps: {
    exclude: ['rich-text-editor-ndevu'],
  },
  resolve: {
    alias: {
      'rich-text-editor-ndevu/styles.css': resolve(__dirname, '../dist/index.css'),
      'rich-text-editor-ndevu/styles': resolve(__dirname, '../dist/index.css'),
      'rich-text-editor-ndevu': resolve(__dirname, '../dist'),
    },
  },
});
