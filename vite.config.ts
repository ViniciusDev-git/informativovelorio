import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite acesso de dispositivos externos (Smart TVs)
    port: 8080,
    cors: true, // Habilita CORS para Smart TVs
    headers: {
      // Headers para melhor compatibilidade com Smart TVs
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
    },
    hmr: {
      host: '4173-imhl0re1esabgla8dobdy-93f8c0a8.manusvm.computer',
      port: 443,
      protocol: 'wss'
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
    },
    allowedHosts: ['4173-imhl0re1esabgla8dobdy-93f8c0a8.manusvm.computer'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configurações para melhor compatibilidade com Smart TVs
  build: {
    target: 'es2015', // Compatibilidade com navegadores mais antigos
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});

