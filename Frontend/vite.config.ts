import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import{configDefaults} from 'vitest/config';


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  optimizeDeps: {
    include: [
      '@tauri-apps/api'
    ]
  },
  base: './',
  build: {
    outDir: 'dist',
  },
  test:{
    globals: true, 
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/dist-ssr/**'],
  }
})
