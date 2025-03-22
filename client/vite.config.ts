import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    cors: {
      origin: ['http://localhost:5173', 'https://colorful-norene-sahyog-e2eebb57.koyeb.app']
    },
    allowedHosts: [
      'hot-shanna-astrazen-ff947eb8.koyeb.app', 
      '*.koyeb.app',
      'localhost',
      'ec2-*-*-*-*.*.compute.amazonaws.com', // Allow EC2 instances
      '*.amazonaws.com', // Allow all AWS domains
      '*.compute.amazonaws.com', // Allow AWS compute domains
      '*.compute-1.amazonaws.com', // Allow AWS compute domains
      '*.elasticbeanstalk.com' // Allow Elastic Beanstalk domains
    ]
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
