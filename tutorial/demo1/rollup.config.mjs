import { defineConfig } from 'rollup'
import myImage from './plugins/rollup-plugin-image.js'

export default defineConfig({
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    myImage({
      // fileSize: 1024 * 10,
      fileSize: 0,
      target: './dist/assets',
    }),
  ],
})
