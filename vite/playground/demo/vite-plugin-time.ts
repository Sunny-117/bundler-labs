// 写一个vite插件，统计从启动服务器到成功启动耗时和热更新的时间
// eslint-disable-next-line import/no-default-export
export default function MyVitePlugin() {
  let startTime = 0

  return {
    name: 'my-vite-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/@vite/client') {
          startTime = Date.now()
        }
        next()
      })
    },
    handleHotUpdate(ctx) {
      const hotUpdateEndTime = Date.now()
      const serverStartDuration =
        startTime > 0 ? hotUpdateEndTime - startTime : 0
      console.log(`Server started in ${serverStartDuration}ms`)
      console.log(`Hot update took ${ctx.duration}ms`)
    },
  }
}
