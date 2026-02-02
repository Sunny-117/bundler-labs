import { type Plugin } from 'rollup'
const virtualModuleId = 'virtual-module'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

export interface VirtualModuleOptions {
  content: string
}
export default function virtualModule(options: VirtualModuleOptions): Plugin {
  const { content } = options || {}
  return {
    name: 'virtual-module',
    resolveId(source) {
      if (source === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return null
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return content || `export default "this is virtual module"`
      }
      return null
    },
  }
}
