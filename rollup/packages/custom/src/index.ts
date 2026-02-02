import path from 'node:path'
import { type Plugin } from 'rollup'

import { createFilter } from '@rollup/pluginutils'

export interface CustomPluginOptions {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
  emitFile?: boolean
}

export default function customPlugin(options: CustomPluginOptions): Plugin {
  const { include, exclude, emitFile = false } = options || {}
  const filter = createFilter(include, exclude)

  return {
    name: 'custom-plugin',
    transform(code: string, id: string) {
      if (!filter(id)) {
        return null
      }

      const parsedCode = this.parse(code)

      const source = `${code} \n\n ${JSON.stringify(parsedCode, null, 2)}`

      const fileName = path.basename(id, path.extname(id))

      console.log(fileName)

      if (emitFile) {
        this.emitFile({
          type: 'asset',
          fileName: `${fileName}.txt`,
          source,
        })
      }
    },
  }
}
