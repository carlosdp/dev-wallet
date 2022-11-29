import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: process.env.VITEST ? 'global' : 'globalThis',
  },
  plugins: [react()],
  server: {
    proxy: {
      '/rpc': {
        target: 'http://anvil:8545/',
        rewrite: _ => '/',
      },
    },
  },
});
