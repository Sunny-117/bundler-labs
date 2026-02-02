import vuejsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import viteMdx from './src'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteMdx({}),
    vuejsx({
      include: /\.(mdx|jsx|tsx)/,
    }),
  ],
  resolve: {
    alias: {
      'vite-mdx': './src',
    },
  },
})
