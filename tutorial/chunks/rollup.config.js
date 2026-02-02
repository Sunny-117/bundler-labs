import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    manualChunks: (id) => {
      if (
        id.includes('bar')
        || id.includes('foo')
      ) {
        return 'foo-bar'
      }
      return null;
    }
  },

})
