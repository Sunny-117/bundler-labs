import { describe, vi, expect, it } from 'vitest'
import customPlugin from '../src'

describe('custom plugin', () => {
  it('should include files based on include option', () => {
    const mockCode = 'console.log("Hello, World!");'
    const mockId = 'test.js'
    const mockParsedCode = {
      /* Mock parsed code object */
    }

    const pluginInstance = customPlugin({ include: /\.js$/ })

    // 使用 Jest 的 mock 来模拟 this.parse 方法的返回值
    pluginInstance.parse = vi.fn().mockReturnValue(mockParsedCode)

    const result = pluginInstance.transform(mockCode, mockId)

    // 检查返回值是否为空
    expect(result).toBeUndefined()
    // 检查是否调用了 this.parse 方法
    expect(pluginInstance.parse).toHaveBeenCalledWith(mockCode)
  })

  it('should exclude files based on exclude option', () => {
    const mockCode = 'console.log("Hello, World!");'
    const mockId = 'test.txt' // 使用被排除的文件类型
    const mockParsedCode = {
      /* Mock parsed code object */
    }

    const pluginInstance = customPlugin({ exclude: /\.txt$/ })

    // 使用 Jest 的 mock 来模拟 this.parse 方法的返回值
    pluginInstance.parse = vi.fn().mockReturnValue(mockParsedCode)

    const result = pluginInstance.transform(mockCode, mockId)

    // 检查返回值是否为空
    expect(result).toBeNull()
    // 检查是否调用了 this.parse 方法
    expect(pluginInstance.parse).not.toHaveBeenCalled()
  })

  it('should emit file if emitFile option is true', () => {
    const mockCode = 'console.log("Hello, World!");'
    const mockId = 'test.js'
    const mockParsedCode = {
      /* Mock parsed code object */
    }

    // 使用 Jest 的 mock 来模拟 this.emitFile 方法
    const emitFileMock = vi.fn()

    const pluginInstance = customPlugin({ emitFile: true })

    // 使用 Jest 的 mock 来模拟 this.parse 和 this.emitFile 方法的返回值
    pluginInstance.parse = vi.fn().mockReturnValue(mockParsedCode)
    pluginInstance.emitFile = emitFileMock

    pluginInstance.transform(mockCode, mockId)

    // 检查是否调用了 this.emitFile 方法
    expect(emitFileMock).toHaveBeenCalledWith({
      type: 'asset',
      fileName: 'test.txt',
      source: `${mockCode} \n\n ${JSON.stringify(mockParsedCode, null, 2)}`,
    })
  })
})
