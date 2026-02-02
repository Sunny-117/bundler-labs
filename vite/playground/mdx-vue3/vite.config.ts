import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
// import pluginMdx from 'vite-plugin-mdx'
import pluginMdx from './src/plugin/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'vite-mdx': './plugin',
    },
  },
  plugins: [
    vue(),
    pluginMdx({}),
    vueJsx({
      include: /\.(jsx|tsx|mdx)/,
    }),
    inspect(),
  ],
})
