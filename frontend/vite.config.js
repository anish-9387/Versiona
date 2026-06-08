import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/user': 'http://localhost:3000',
      '/repository': 'http://localhost:3000',
      '/issue': 'http://localhost:3000',
    }
  }
})
