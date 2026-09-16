import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the built app works on Vercel, Netlify, GitHub Pages, or a static host.
  base: './',
  build: {
    rollupOptions: {
      output: {
        // Split the chart library into its own chunk so the initial JS is smaller.
        manualChunks: {
          recharts: ['recharts'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
