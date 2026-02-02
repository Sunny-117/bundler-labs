import { describe, expect, it } from 'vitest'
import json from '../src'

describe('json plugin transform method', () => {
  it('should parse valid JSON files', () => {
    const mockCode = '{"foo": "bar"}'
    const mockId = 'test.json'

    const result = json({
      include: [/\.json$/],
    }).transform!.handler(mockCode, mockId)
    // expect(result).toEqual(expected)
    expect(result).toMatchInlineSnapshot(`
      {
        "code": "export var foo = \\"bar\\";
      export default {
      	foo: foo
      };
      ",
        "map": {
          "mappings": "",
        },
      }
    `)
  })

  it('should ignore non-JSON files', () => {
    const mockCode = 'console.log("Hello, World!");'
    const mockId = 'test.js'

    const result = json().transform!.handler(mockCode, mockId)

    // 检查返回值是否为空
    expect(result).toBeNull()
  })

  it('should ignore files excluded by filter', () => {
    const mockCode = '{"foo": "bar"}'
    const mockId = 'test.json'

    // 使用 include 和 exclude 选项来构建过滤器，这里测试排除匹配
    const pluginInstance = json({ exclude: /test\.json$/ })

    const result = pluginInstance.transform!.handler(mockCode, mockId)

    // 检查返回值是否为空
    expect(result).toBeNull()
  })

  it('should handle files included by filter', () => {
    const mockCode = '{"foo": "bar"}'
    const mockId = 'test.json'

    // 使用 include 和 exclude 选项来构建过滤器，这里测试包含匹配
    const pluginInstance = json({ include: /test\.json$/ })

    const result = pluginInstance.transform.handler(mockCode, mockId)

    // 检查返回值是否不为空
    expect(result).not.toBeNull()
  })
})
