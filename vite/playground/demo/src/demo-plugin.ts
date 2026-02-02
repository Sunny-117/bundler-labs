import type { Plugin } from 'vite'
// 插件执行顺序 pre post normal
export default function demoPlugin(enforce?: 'pre' | 'post'): Plugin {
  return {
    name: 'demo-plugin',
    enforce,
    buildStart() {
      // console.log('buildStart', enforce)
    },
    resolveId() {
      // console.log('解析某个文件的时候才会调用', enforce)
    },
    load(id, options) {
      // console.log('load', enforce, { id, options })
    },
    config(userConfig) {
      return {
        resolve: {
          alias: {
            '@demo': './src/App.tsx',
          },
        },
      }
    },
    configResolved(config) {
      // console.log('最终所有插件执行完毕后最终会被使用的config', config.resolve)
    },
    configureServer(server) {
      // 直接使用，会把中间件放在vite中间件之前执行
      // 返回函数：会把这个中间件放在vite中间件后面执行
      server.middlewares.use((req, res, next) => {
        if (req.url === '/test') {
          res.end('hello vite plugin')
        } else {
          next()
        }
      })
    },
    transformIndexHtml(html) {
      // return html.replace('id="root"', 'id="foo"')
    },
    handleHotUpdate(ctx) {
      console.log(ctx, 'handleHotUpdate')
      // 热更新定制化
      ctx.server.ws.send({
        type: 'custom',
        event: 'test',
        data: {
          hello: 'world',
        },
      })
    },
  }
}
