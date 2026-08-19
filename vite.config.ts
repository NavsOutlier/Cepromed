import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    target: 'es2022',
    // Os frames do hero são muitos arquivos pequenos: não vale inlinear nenhum.
    assetsInlineLimit: 0,
  },
  server: {
    port: 3000,
    host: true,
    // O AI Studio desliga o HMR para não piscar durante edições do agente.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
