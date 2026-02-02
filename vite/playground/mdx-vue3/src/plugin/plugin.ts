import { createCompiler } from '@mdx-js/mdx'
import { createFilter, type FilterPattern } from '@rollup/pluginutils'
import type { Plugin } from 'vite'

const renderer = `
import {mdx} from 'vite-mdx/vue3'
`
const pargma = `
/** @jsx mdx **/
`

interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
}
// eslint-disable-next-line import/no-default-export
export default function pluginMdx(options: Options = {}): Plugin {
  return {
    name: 'vite-plugin-mdx',
    transform(code, id) {
      const { include = /\.mdx/, exclude } = options
      const filter = createFilter(include, exclude)
      if (filter(id)) {
        const compiler = createCompiler(code)
        const result = compiler.processSync(code)
        return {
          id,
          code: `${renderer}${pargma}${result.contents}`,
          options,
        }
      }
    },
  }
}
