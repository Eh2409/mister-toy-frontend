import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../mister toy backend/public',
    emptyOutDir: true,
  },
  base: '/mister-toy-frontend/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
