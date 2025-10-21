import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // 🚀 optional — removes the `/api` prefix if your backend doesn't have it twice
        // rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
