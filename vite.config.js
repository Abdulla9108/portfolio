import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/portfolio/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});
