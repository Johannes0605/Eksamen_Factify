import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build output with default esbuild minifier
    minify: 'esbuild',
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'bootstrap-vendor': ['bootstrap']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  }
})
