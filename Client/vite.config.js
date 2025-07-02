import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  server:{
    // https: true,
    proxy:{
      "/api":"http://localhost:3000"
    }
  },

  plugins: [react(),tailwindcss()],
})
