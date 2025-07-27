import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    fs: {
      // Permite servir arquivos da pasta src
      strict: false,
      allow: ['..'],
    },
  },
  // Garante que JSON seja tratado corretamente
  assetsInclude: ['**/*.json'],
  build: {
    //assetsInlineLimit: 0, // Garante que os JSONs não sejam embutidos
  },
});
