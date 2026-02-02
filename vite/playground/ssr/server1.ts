// nodejs集成vite dev server
import express from 'express'
import { createServer as createViteServer } from 'vite'
const app = express()

createViteServer({
  server: {
    middlewareMode: 'html', // 相当于运行了 npm run dev
  },
}).then((vite) => {
  app.use(vite.middlewares)
  app.listen(4000)
})

// 访问：http://localhost:4000/
