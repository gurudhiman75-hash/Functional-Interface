import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rawPort = process.env.ADMIN_PORT ?? '5174';
const port = Number(rawPort);
const rnkCp004RendererEvidence = process.env.VITE_RNK_CP004_RENDERER_E2E === 'true';

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid ADMIN_PORT value: "${rawPort}"`);
}

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: rnkCp004RendererEvidence
      ? {
          input: {
            admin: path.resolve(__dirname, 'index.html'),
            rnkCp004Renderer: path.resolve(__dirname, 'rnk-cp004-renderer.html'),
          },
        }
      : undefined,
  },
  server: {
    host: '0.0.0.0',
    port,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  preview: {
    host: '0.0.0.0',
    port,
  },
});
