import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, proxy /api to your local FastAPI backend so relative
      // fetch('/api/...') calls work without CORS setup.
      // Change the target if your backend runs on a different port.
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true
      }
    }
  }
});
