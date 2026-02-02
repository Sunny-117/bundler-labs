import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import { vuePlugin } from './vite-plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vuePlugin(), inspect()],
})
