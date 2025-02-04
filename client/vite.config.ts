import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'a2a87056-f109-4a78-91e9-046bfd391c70-00-18gslr0rwfyef.pike.replit.dev',
      '.replit.dev',
      'localhost'
    ],
  },
  plugins: [react()],
})
