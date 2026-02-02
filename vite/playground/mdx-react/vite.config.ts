import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import pluginMdx, { Framework } from './src/plugin/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'vite-mdx': './plugin',
    },
  },
  plugins: [
    // 注意执行顺序
    pluginMdx({
      framework: Framework.React,
      // 自定义pargma
      // pargma: `
      // /** @jsx aaa **/
      // `,
    }),
    react({
      include: /\.(mdx|jsx|tsx)/,
    }),
    inspect(),
  ],
})
