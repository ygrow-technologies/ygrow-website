import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js is lazy-loaded as a separate hero-effect chunk.
    chunkSizeWarningLimit: 550,
  },
  server: {
    host: '127.0.0.1',
    port: 3001,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 3001,
    strictPort: true,
  },
})
