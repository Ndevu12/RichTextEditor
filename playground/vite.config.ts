import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGHPages = process.env.DEPLOY_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGHPages ? '/RichTextEditor/playground/' : '/',
  server: {
    port: 4000,
    open: true,
  },
});
