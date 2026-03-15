const isGHPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['rich-text-editor-ndevu'],
  eslint: {
    // The root project uses ESLint 9 flat config which is incompatible
    // with Next.js 14's built-in ESLint integration. Skip during build.
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
