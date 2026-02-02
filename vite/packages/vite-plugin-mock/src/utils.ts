import type { Request } from './types'

const mockRouteMap: any = {}

export function matchRoute(request: Request) {
  const url = request.url
  const method = request.method.toLowerCase()
  const routeList = mockRouteMap[method]
  return routeList && routeList.find((it: any) => it.path === url)
}

export function createRoute(mockConfList: Request[]) {
  mockConfList.forEach((mockConf) => {
    const method = mockConf.type || 'get'
    const path = mockConf.url
    const handler = mockConf.response
    const route = {
      path,
      method: method.toLowerCase(),
      handler,
    }
    if (!mockRouteMap[method]) {
      mockRouteMap[method] = []
    }
    console.log('create mock api:', route.method, route.path)
    mockRouteMap[method].push(route)
  })
}
export function send(this: any, body: any) {
  let chunk: any = JSON.stringify(body)
  if (chunk) {
    chunk = Buffer.from(chunk, 'utf-8')
    this.setHeader('Content-Length', chunk.length)
  }
  this.setHeader('Content-Type', 'application/json')
  // status
  this.statusCode = 200
  this.end(chunk, 'utf8')
}
