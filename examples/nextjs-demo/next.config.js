const path = require('path');
const isGHPages = process.env.DEPLOY_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: ['rich-text-editor-ndevu'],
  eslint: {
    // Keep CI/build stable while the root repository uses flat config ESLint.
    ignoreDuringBuilds: true,
  },
  // Static export for GitHub Pages deployment
  ...(isGHPages && {
    output: 'export',
    basePath: '/RichTextEditor/nextjs-demo',
    images: { unoptimized: true },
  }),
};

module.exports = nextConfig;
