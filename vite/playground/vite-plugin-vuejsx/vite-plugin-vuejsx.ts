// @ts-expect-error
import { transformSync, type TransformOptions } from '@babel/core'
// @ts-expect-error
import importMeta from '@babel/plugin-syntax-import-meta'
// 允许 Babel 解析 import.meta 语法，但不会对其进行转换或 polyfill。
// @ts-expect-error
import typescript from '@babel/plugin-transform-typescript'
import { createFilter, type FilterPattern } from '@rollup/pluginutils'
import jsx from '@vue/babel-plugin-jsx'
import hash from 'hash-sum'
import type { PluginOption } from 'vite'

interface VueJsxPluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
  babelPlugins?: any[]
  [key: string]: any
}

export function vueJsxPlugin(options: VueJsxPluginOptions = {}): PluginOption {
  let needHmr = false
  let root
  return {
    name: 'vite:vue-jsx',
    config() {
      return {
        esbuild: {
          include: /\.ts$/,
        },
        define: {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
        },
      }
    },
    configResolved(config) {
      root = config.root
      needHmr = config.command === 'serve' && !config.isProduction
    },
    transform(code: string, id: string) {
      const {
        include,
        exclude,
        babelPlugins = [],
        ...babelPluginOptions
      } = options

      const filter = createFilter(include || /\.[jt]sx$/, exclude)
      const [filepath] = id.split('?')

      if (filter(id) || filter(filepath)) {
        const plugins: TransformOptions['plugins'] = [
          importMeta,
          [jsx, babelPluginOptions],
          ...babelPlugins,
        ]

        if (id.endsWith('.tsx') || filepath.endsWith('.tsx')) {
          plugins.push([typescript, { isTSX: true, allowExtensions: true }])
        }

        const result = transformSync(code, {
          babelrc: false,
          configFile: false,
          ast: true,
          plugins,
        })

        if (!result) return null

        if (!needHmr) {
          return { code: result.code, map: result.map }
        }

        const hotComponents = []
        let hasDefault = false
        for (const node of result.ast.program.body) {
          if (
            node.type === 'ExportDefaultDeclaration' &&
            isDefineComponentCall(node.declaration)
          ) {
            hasDefault = true
            hotComponents.push({
              local: '__default__',
              exported: 'default',
              id: hash(`${id}default`),
            })
          }
        }
        if (hotComponents.length) {
          if (hasDefault && needHmr) {
            result.code = `${result.code.replaceAll(
              'export default defineComponent',
              `const __default__ = defineComponent`
            )}\nexport default __default__`
          }
          if (needHmr && !/\?vue&type=script/.test(id)) {
            let code = result.code
            let callbackCode = ``
            for (const { local, exported, id } of hotComponents) {
              code +=
                `\n${local}.__hmrId = "${id}"` +
                `\n__VUE_HMR_RUNTIME__.createRecord("${id}", ${local})`
              callbackCode += `\n__VUE_HMR_RUNTIME__.reload("${id}", __${exported})`
            }
            code += `\nimport.meta.hot.accept(({${hotComponents
              .map((c) => `${c.exported}: __${c.exported}`)
              .join(',')}}) => {${callbackCode}\n})`
            result.code = code
          }
        }
        return {
          code: result.code,
          map: result.map,
        }
      }
      return null
    },
  }
}

function isDefineComponentCall(node: any) {
  return (
    node &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'defineComponent'
  )
}
