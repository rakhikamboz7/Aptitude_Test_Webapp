import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    
  ],
   resolve: {
    alias: {
      '@': '/src', // This tells Vite that @ maps to the src directory
    },
  },
})
