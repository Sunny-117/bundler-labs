import { beforeEach, describe, expect, it } from 'vitest'
import { type Plugin } from 'rollup'
import virtualModule from '../src'

describe('virtualModule plugin', () => {
  let plugin: Plugin
  const content = `export default function fib(n) {return n <= 1 ? n : fib(n - 1) + fib(n - 2)}`
  beforeEach(() => {
    plugin = virtualModule({ content })
  })

  it('resolveId should resolve virtualModuleId to resolvedVirtualModuleId', () => {
    const result = plugin.resolveId('virtual-module')
    expect(result).toBe('\0virtual-module')
  })

  it('resolveId should return null for other ids', () => {
    const result = plugin.resolveId('other-module')
    expect(result).toBeNull()
  })

  it('load should load content for resolvedVirtualModuleId', () => {
    const result = plugin.load('\0virtual-module')
    expect(result).toBe(content)
  })

  it('load should return null for other ids', () => {
    const result = plugin.load('other-module')
    expect(result).toBeNull()
  })
})
