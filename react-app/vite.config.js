import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/libraryassignment/', // Base path for GitHub Pages

  server: {
    port: 3000,
    historyApiFallback: true, // For handling SPA routing (404 fallback)
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend API endpoint for local development
        changeOrigin: true, // For cross-origin requests during local development
      },
    },
  },

  build: {
    outDir: 'dist', // Output directory for GitHub Pages deployment
  },
})
