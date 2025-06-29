import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'manifest.json',
    //       dest: '' // copies to dist root
    //     }
    //   ]
    // })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        background: 'src/background.ts',
        injectGenerationContainer: 'src/injectGenerationContainer.tsx',
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'background') return 'background.js';
          if (chunk.name === 'injectGenerationContainer') return 'injectGenerationContainer.js';
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
