import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: '192.168.0.42',
    },
    proxy: {
      '/json': {
        target: 'http://miraup.test', // Usando o domínio local do Local WP
        changeOrigin: true,
        secure: false, // Importante para certificado autoassinado
        rewrite: (path) => path.replace(/^\/json/, '/json'),
      },
    },
  },
  assetsInclude: ['**/*.json'],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  preview: {
    port: 4173,
    host: true,
  },
});
