import fs from 'node:fs'
// 生产环境
import express from 'express'
import { render } from './dist/server/server-entry'

const app = express()
const template = fs.readFileSync('dist/client/index.html', 'utf-8')

app.use(express.static('dist/client'))

app.get('*', async (req, res) => {
  const context: any = {}
  const html = await render(req.url, context)
  if (context.url) {
    res.redirect(301, context.url)
    return
  }
  const responseHtml = template.replace('<!-- APP_HEML -->', html)
  res.set('content-type', 'text/html')
  res.send(responseHtml)
})

app.listen(4000)
