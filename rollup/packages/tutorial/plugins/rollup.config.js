import { defineConfig } from 'rollup'
import build from './core/rollup-plugin-build.js'
import buildStart from './build/plugin-buildStart.js'
import injectPolyfillPlugin from './build/plugin-polyfill-core.js'
import Babel from './build/rollup-plugin-babel.js'
import generation from './output/rollup-plugin-generation.js'
import dynamicImportPolyfillPlugin from './output/rollup-plugin-renderDynamicImport.js'
import resolveFileUrl from './output/rollup-plugin-resolveFileUrl.js'
import html from './output/rollup-plugin-html.js'
// import resolve from '@rollup/plugin-node-resolve'
import resolve from './core/rollup-plugin-node-resolve.js'
// import commonjs from '@rollup/plugin-commonjs'
// import commonjs from './core/rollup-plugin-commonjs.js
import alias from './core/rollup-plugin-alias.js';

export default defineConfig({
  input: './src/index6.js',
  output: {
    dir: 'dist',
  },
  plugins: [
    // build()
    // buildStart()
    // injectPolyfillPlugin()
    // Babel({
    //   include: './src',
    //   extensions: ['.js', '.jsx'],
    //   presets: [
    //     "@babel/preset-env"
    //   ]
    // })
    // generation()
    // dynamicImportPolyfillPlugin()
    // resolveFileUrl()
    // html()
    // commonjs()
    // resolve()
    alias({
      entries: [
        { find: './xx.js', replacement: 'check-is-array' }
      ]
    }),
  ],
  watch: {
    clearScreen: false
  }
})
