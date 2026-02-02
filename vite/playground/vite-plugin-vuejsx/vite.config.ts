import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import { vueJsxPlugin } from './vite-plugin-vuejsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsxPlugin(), inspect()],
})
