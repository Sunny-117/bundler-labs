// vitepress
// build的时候
// 静态站生成器
// ssr实现静态站点导出
import fs from 'node:fs'
import { render } from './dist/server/server-entry'
const template = fs.readFileSync('dist/client/index.html', 'utf-8')

const routesToRender = fs
  .readdirSync('src/pages')
  .map((file) => file.replace('.jsx', '').toLowerCase())

for (const route of routesToRender) {
  const context = {}
  const html = render(route, context)
  const responseHtml = template.replace('<!-- APP_HEML -->', html)
  const filePath = `dist/static/${route}.html`
  fs.writeFile(filePath, responseHtml, 'utf-8', () => {
    console.log('success')
  })
}
