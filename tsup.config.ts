import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  tsconfig: 'tsconfig.build.json',
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  treeshake: true,
  splitting: false,
  minify: false, // consumers can minify; we ship readable code
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  onSuccess: 'echo "\\n✓ Library compiled successfully"',
});
