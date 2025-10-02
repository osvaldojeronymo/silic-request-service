import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig({
  // Necessário para GitHub Pages: define caminho base sob /silic-digital-signer/
  base: '/silic-digital-signer/',
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'SILIC Digital Signer',
        short_name: 'SILIC Signer',
        description: 'Portal de Assinatura Digital SILIC 2.0',
        theme_color: '#003875',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'assets/images/logo-caixa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/images/logo-caixa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/styles': resolve(__dirname, 'src/styles')
    }
  },
  server: {
    port: 3000,
    host: 'localhost',
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['normalize.css'],
          utils: ['./src/utils/index.ts']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Ajuste: importar partial correto (_variables.scss) usando caminho relativo alias
        additionalData: `@import "@/styles/_variables.scss";`
      }
    }
  }
});