import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import demoPlugin from './src/demo-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  // 声明了enforce后，执行顺序不按照数组顺序执行了
  plugins: [react(), demoPlugin('post'), demoPlugin(), demoPlugin('pre')],
  resolve: {
    alias: {
      '@foo': './src/main.tsx',
    },
  },
})

// buildStart pre
// buildStart undefined
// buildStart post
