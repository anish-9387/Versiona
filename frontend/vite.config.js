import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/user': '16.171.27.203:3000',
      '/repository': '16.171.27.203:3000',
      '/issue': '16.171.27.203:3000',
    }
  }
})
