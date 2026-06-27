import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/pkt/' : '/',
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-gfm')) {
              return 'markdown';
            }
          },
        },
      },
    },
  };
});
