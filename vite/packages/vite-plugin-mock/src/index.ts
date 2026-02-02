import path from 'node:path'
import { createRoute, matchRoute, send } from './utils'
import type { MockPluginMiddleWareResType, Options } from './types'
import type { Plugin } from 'vite'

export default (options: Options): Plugin => {
  options.entry = options.entry || './mock/index.js'
  if (!path.isAbsolute(options.entry)) {
    options.entry = path.resolve(process.cwd(), options.entry)
  }
  return {
    name: 'vite-plugin-mock',
    async configureServer({ middlewares }) {
      const mockObj = (await import(options.entry)).default
      createRoute(mockObj)
      const middleware = (
        req: any,
        res: MockPluginMiddleWareResType,
        next: any
      ) => {
        const route = matchRoute(req)
        if (route) {
          console.log('mock request', route.method, route.path)
          res.send = send
          route.handler(req, res)
        } else {
          next()
        }
      }
      middlewares.use(middleware)
    },
  }
}
