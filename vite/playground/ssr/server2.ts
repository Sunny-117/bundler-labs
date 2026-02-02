import fs from 'node:fs'
// nodejs集成vite dev server
import express from 'express'
import { createServer as createViteServer } from 'vite'
const app = express()

createViteServer({
  server: {
    middlewareMode: 'ssr',
  },
}).then((vite) => {
  app.use(vite.middlewares)
  app.get('*', async (req, res) => {
    let template = fs.readFileSync('index.html', 'utf-8')
    template = await vite.transformIndexHtml(req.url, template)
    const { render } = await vite.ssrLoadModule('./server-entry.tsx')
    const html = await render(req.url)
    const responseHtml = template.replace('<!-- APP_HEML -->', html)
    res.set('content-type', 'text/html')
    res.send(responseHtml)
  })
  app.listen(4000)
})
// http://localhost:4000/ 查看网页源代码：ssr渲染内容
