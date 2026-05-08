import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // dev → '/'  (clean localhost paths)
  // build → '/cyanotype/'  (served from github.com/nonsenseblue/cyanotype on Pages)
  base: command === 'build' ? '/cyanotype/' : '/',
  plugins: [react()],
  server: {
    port: 4030,
    open: true
  }
}));
