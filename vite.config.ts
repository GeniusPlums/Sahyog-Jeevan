import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'a2a87056-f109-4a78-91e9-046bfd391c70-00-18gslr0rwfyef.pike.replit.dev',
      '.replit.dev',
      'hot-shanna-astrazen-ff947eb8.koyeb.app',
      '*.koyeb.app',
      'localhost',
      'ec2-*-*-*-*.*.compute.amazonaws.com', // Allow EC2 instances
      '*.amazonaws.com', // Allow all AWS domains
      '*.compute.amazonaws.com', // Allow AWS compute domains
      '*.compute-1.amazonaws.com', // Allow AWS compute domains
      '*.elasticbeanstalk.com' // Allow Elastic Beanstalk domains
    ],
  },
  resolve: {
    alias: {
      "@db": path.resolve(__dirname, "db"),
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Ensure source maps are generated for easier debugging
    sourcemap: true,
    // Ensure assets are properly handled
    assetsDir: "assets",
    // Optimize chunks for better loading performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  },
  // Base public path for assets - important for production deployment
  base: '/',
});
