import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path resolution:
//   dev                          → '/'
//   build (default)              → '/cyanotype/'  (GitHub Pages, served at /cyanotype/)
//   build with BASE_PATH=/       → '/'            (Vercel, served at root)
const buildBase = process.env.BASE_PATH ?? '/cyanotype/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? buildBase : '/',
  plugins: [react()],
  server: {
    port: 4030,
    open: true
  }
}));
