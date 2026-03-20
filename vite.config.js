import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import adminPlugin from './src/scripts/adminPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminPlugin()],
  base: '/',
  build: {
    // Let Vite handle file names with hashes for better caching
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true // Enable source maps for debugging
  }
})
