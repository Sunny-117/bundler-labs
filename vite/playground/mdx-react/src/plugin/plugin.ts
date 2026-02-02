import { createCompiler } from '@mdx-js/mdx'
import { createFilter, type FilterPattern } from '@rollup/pluginutils'
import type { Plugin } from 'vite'

const vue3DefaultRenderer = `
import {mdx} from 'vite-mdx/vue3'
`
const vue3DefaultPargma = `
/** @jsx mdx **/
`

const reactDefaultRender = `
  import React from'react'
  import {mdx} from '@mdx-js/react'
`

const reactDefaultPargma = `
/** @jsxRuntime classic **/
/** @jsx mdx **/
/** @jsxFrag mdx.Fragment **/
`
export enum Framework {
  React = 'react',
  Vue3 = 'vue3',
}
interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  framework?: Framework
  // 支持自定义renderer和pargma
  // import {mdx} from 'xxx'
  renderer?: string
  pargma?: string
}
const frameworkRendererPargmaMap = {
  vue3: {
    renderer: vue3DefaultRenderer,
    pargma: vue3DefaultPargma,
  },
  react: {
    renderer: reactDefaultRender,
    pargma: reactDefaultPargma,
  },
}
// eslint-disable-next-line import/no-default-export
export default function pluginMdx(options: Options = {}): Plugin {
  const framework = options.framework || 'vue3'
  if (
    (framework as any) !== Framework.React &&
    (framework as any) !== Framework.Vue3
  ) {
    throw new Error('[mdx-plugin] framework type must be react or vue3')
  }
  return {
    name: 'vite-plugin-mdx',
    enforce: framework === Framework.React ? 'pre' : undefined, // 在vite-plugin-react中enforce是pre，最高优先级，所以运行的时候会在vite的核心插件运行之前运行，此时我们的mdx仍然是中间值，比react插件后运行，
    // 所以顺序没有完全按照vite.config中的顺序执行的
    // 流程：myPlugin->reactjsx->esbuild
    config() {
      return framework === Framework.React
        ? {
            esbuild: {
              include: /\.(jsx|tsx|ts|mdx)/,
              loader: 'jsx',
            },
          }
        : {}
    },
    transform(code, id) {
      const {
        include = /\.mdx/,
        exclude,
        renderer: optionRenderer,
        pargma: optionPargma,
      } = options
      const filter = createFilter(include, exclude)
      const framework = options.framework || 'vue3'
      const { renderer: defaultRenderer, pargma: defaultPargma } =
        frameworkRendererPargmaMap[framework]
      const renderer = optionRenderer || defaultRenderer
      const pargma = optionPargma || defaultPargma
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
