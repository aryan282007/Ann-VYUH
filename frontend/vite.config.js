import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ann-VYUH Smart Procurement',
        short_name: 'Ann-VYUH',
        description: 'Smart procurement system for farmers.',
        theme_color: '#2E7D32',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
});
