const path = require('node:path')
const rollup = require('./lib/rollup.js')
const entry = path.resolve(__dirname, './src/main3.js')
const output = path.resolve(__dirname, './dist/bundle.js')

debugger
rollup(entry, output)
