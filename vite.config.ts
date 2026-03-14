import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['pwa-192x192.png', 'pwa-512x512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Apartment Manager',
        short_name: 'Apt Manager',
        description: 'Installable apartment and room management app',
        id: '/',
        start_url: '/dashboard',
        theme_color: '#09637E',
        background_color: '#EBF4F6',
        display: 'standalone',
        scope: '/',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Rooms',
            short_name: 'Rooms',
            url: '/rooms',
          },
          {
            name: 'Contracts',
            short_name: 'Contracts',
            url: '/contracts',
          },
          {
            name: 'Reports',
            short_name: 'Reports',
            url: '/reports',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest,woff2}'],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
    }),
  ],
});
