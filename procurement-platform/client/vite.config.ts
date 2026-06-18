import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/@mui/') || id.includes('/@emotion/')) return 'vendor-mui';
          if (id.includes('/react-router') || id.includes('/@remix-run/')) return 'vendor-router';
          if (id.includes('/@reduxjs/') || id.includes('/react-redux/') || id.includes('/redux')) return 'vendor-redux';
          if (id.includes('/i18next') || id.includes('/react-i18next')) return 'vendor-i18n';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'vendor-react';
          if (id.includes('/axios/')) return 'vendor-http';
          if (id.includes('/recharts/') || id.includes('/d3-') || id.includes('/victory-vendor/')) return 'vendor-charts';
          return 'vendor-misc';
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@procurex/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url))
    }
  },
  server: {
    port: 5173
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    css: true
  }
});
