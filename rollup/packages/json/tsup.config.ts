import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src'],
  format: ['cjs', 'esm'],
  target: 'esnext',
  cjsInterop: true,
  clean: true,
  platform: 'node',
  dts: true,
})
