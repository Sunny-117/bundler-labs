import { createCompiler } from '@mdx-js/mdx'
import { createFilter, type FilterPattern } from '@rollup/pluginutils'
import type { Plugin } from 'vite'

interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
}
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
          code: result.contents,
          options,
        }
      }
    },
  }
}
