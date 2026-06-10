import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/user': { target: 'http://16.171.27.203:3000', changeOrigin: true },
      '/repository': { target: 'http://16.171.27.203:3000', changeOrigin: true },
      '/issue': { target: 'http://16.171.27.203:3000', changeOrigin: true },
    }
  }
})
