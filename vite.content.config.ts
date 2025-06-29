import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        injectGenerationContainer: 'src/injectGenerationContainer.tsx',
      },
      output: {
        entryFileNames: 'injectGenerationContainer.js',
        format: 'iife', // Bundle as IIFE for content script
        name: 'injectGenerationContainer', // Global name for IIFE
      },
    },
    outDir: 'dist',
    emptyOutDir: false, // Don't delete other build outputs
  },
})
