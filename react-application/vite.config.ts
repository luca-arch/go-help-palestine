import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    proxy: {
      '/api/': {
        changeOrigin: true,
        target: 'http://127.0.0.1:10000',
      },
    },
  },
})
