import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true, // Melhor suporte para ícones SVG
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // Permite conexões externas
    port: 5173, // Porta fixa
    strictPort: true, // Evita mudança automática de porta
    fs: {
      strict: false,
      allow: ['..'], // Permite acessar arquivos fora do root
    },
    // Opcional: Proxy para API local (ajuste conforme necessário)
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Ou seu endpoint local
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  assetsInclude: ['**/*.json'], // Tratamento de arquivos JSON
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]', // Organização dos assets
      },
    },
    // sourcemap: true // Ative se precisar debugar produção
  },
  preview: {
    port: 4173, // Porta para vite preview
    host: true, // Permite acesso externo no preview
  },
});
