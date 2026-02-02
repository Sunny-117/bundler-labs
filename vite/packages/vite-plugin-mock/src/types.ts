import type * as http from 'node:http'

export interface Options {
  entry?: string
}

export interface Request {
  url: string
  method: string
  type: 'get' | 'post'
  response: string
}

export interface MockPluginMiddleWareResType extends http.ServerResponse {
  send?: (this: any, body: any) => void
}
