import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        background: 'src/background.ts',
        injectGenerationContainer: 'src/injectGenerationContainer.tsx',
        utils: 'src/utils.ts',
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'background') return 'background.js';
          if (chunk.name === 'injectGenerationContainer') return 'injectGenerationContainer.js';
          if (chunk.name === 'utils') return 'utils.js';
          return 'assets/[name]-[hash].js';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})

// To bundle injectGenerationContainer as IIFE, add a separate npm script:
// npx vite build --config vite.content.config.ts
// And create vite.content.config.ts for just the content script if needed.
