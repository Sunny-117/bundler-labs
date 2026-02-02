import { defineConfig } from 'rollup'
import { bundleStats } from './plugins/rollup-plugin-bundle-stats.js'
import { uglifyPlugin } from './plugins/rollup-plugin-uglify.js'

export default defineConfig({
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name]-[hash].js',
    banner: '/* this is a banner */',
    footer: '/* this is a footer */',
  },
  plugins: [bundleStats(), uglifyPlugin()],
})
