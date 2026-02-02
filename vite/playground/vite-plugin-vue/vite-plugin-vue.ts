import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createFilter, normalizePath } from '@rollup/pluginutils'
import hash from 'hash-sum'
import {
  compileScript,
  compileStyleAsync,
  compileTemplate,
  parse,
  rewriteDefault,
  type SFCDescriptor as VueSFCDescriptor,
} from 'vue/compiler-sfc'
import type { Plugin } from 'vite'

interface SFCDescriptor extends VueSFCDescriptor {
  id?: string
}

interface PluginOptions {
  include?: RegExp | string | (RegExp | string)[]
  exclude?: RegExp | string | (RegExp | string)[]
}

interface VueRequest {
  filename: string
  query: URLSearchParams
}

const root = process.cwd()
const descriptorCache = new Map<string, SFCDescriptor>()

export function vuePlugin(pluginOptions: PluginOptions = {}): Plugin {
  const { include = /\.vue$/, exclude } = pluginOptions
  const filter = createFilter(include, exclude)

  return {
    name: 'vite-plugin-vue',
    async load(id: string) {
      const { filename, query } = parseVueRequest(id)
      if (!filter(filename)) {
        return null
      }
      if (query.has('vue')) {
        const descriptor = await getDescriptor(filename)
        if (query.get('type') === 'style') {
          const block = descriptor.styles[Number(query.get('index'))]
          if (block) {
            return { code: block.content }
          }
        }
      }
      return null
    },
    async transform(code: string, id: string) {
      const { filename, query } = parseVueRequest(id)
      if (!filter(filename)) {
        return null
      }
      if (query.get('type') === 'style') {
        const descriptor = await getDescriptor(filename)
        const result = await transformStyle(
          code,
          descriptor,
          Number(query.get('index'))
        )
        return result
      } else {
        const result = await transformMain(code, filename)
        return result
      }
    },
  }
}

async function transformStyle(
  code: string,
  descriptor: SFCDescriptor,
  index: number
): Promise<{ code: string }> {
  const block = descriptor.styles[index]
  const result = await compileStyleAsync({
    filename: descriptor.filename,
    source: code,
    id: `data-v-${descriptor.id}`,
    scoped: block.scoped,
  })
  return {
    code: result.code,
  }
}

async function transformMain(
  source: string,
  filename: string
): Promise<{ code: string }> {
  const descriptor = await getDescriptor(filename, source)
  const scriptCode = genScriptCode(descriptor, filename)
  const templateCode = genTemplateCode(descriptor, filename)
  const stylesCode = genStyleCode(descriptor, filename)
  const resolveCode = [
    stylesCode,
    templateCode,
    scriptCode,
    `_sfc_main.render=render`,
    `export default _sfc_main`,
  ].join('\n')
  return {
    code: resolveCode,
  }
}

function genStyleCode(descriptor: SFCDescriptor, filename: string): string {
  let styleCode = ''
  if (descriptor.styles.length) {
    descriptor.styles.forEach((style, index) => {
      const query = `?vue&type=style&index=${index}&lang=css`
      const styleRequest = normalizePath(filename + query)
      styleCode += `\nimport ${JSON.stringify(styleRequest)}`
    })
  }
  return styleCode
}

function genTemplateCode(descriptor: SFCDescriptor, filename: string): string {
  if (!descriptor.template) {
    return `function render() { return null }`
  }
  const result = compileTemplate({
    source: descriptor.template!.content,
    filename,
    id: filename,
  })
  return result.code
}

function genScriptCode(descriptor: SFCDescriptor, filename: string): string {
  if (!descriptor.script && !descriptor.scriptSetup) {
    // 没有 <script>，导出一个空对象
    return `const _sfc_main = {};`
  }
  const script = compileScript(descriptor, { id: filename })
  return rewriteDefault(script.content, '_sfc_main')
}

async function getDescriptor(
  filename: string,
  source?: string
): Promise<SFCDescriptor> {
  let descriptor = descriptorCache.get(filename)
  if (descriptor) return descriptor

  const content = source ?? (await fs.promises.readFile(filename, 'utf8'))
  const result = parse(content, { filename })
  descriptor = result.descriptor
  descriptor.id = hash(path.relative(root, filename))
  descriptorCache.set(filename, descriptor)
  return descriptor
}

function parseVueRequest(id: string): VueRequest {
  const [filename, querystring = ''] = id.split('?')
  const query = new URLSearchParams(querystring)
  return {
    filename,
    query,
  }
}
