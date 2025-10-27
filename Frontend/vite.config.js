import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://college-management-system-zp8h.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
