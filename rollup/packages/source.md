# alias

```ts
export default function alias(options) {
  const entries = getEntries(options)

  if (entries.length === 0) {
    return {
      name: 'alias',
      resolveId: () => null,
    }
  }

  return {
    name: 'alias',
    /**
     * 读取rollup相关配置进行操作
     */
    async buildStart(inputOptions) {
      // inputOptions: rollup 整体的配置
      await Promise.all(
        [
          ...(Array.isArray(options.entries) ? options.entries : []),
          options,
        ].map(
          ({ customResolver }) =>
            customResolver &&
            getHookFunction(customResolver.buildStart)?.call(this, inputOptions)
        )
      )
    },
    /**
     * 路径处理
     * @param importee import的什么东西
     * @param importer 从哪一个文件import了东西
     * @param resolveOptions
     * @returns
     */
    resolveId(importee, importer, resolveOptions) {
      // First match is supposed to be the correct one
      const matchedEntry = entries.find((entry) =>
        matches(entry.find, importee)
      )
      if (!matchedEntry) {
        return null
      }

      const updatedId = importee.replace(
        matchedEntry.find,
        matchedEntry.replacement
      )

      if (matchedEntry.resolverFunction) {
        return matchedEntry.resolverFunction.call(
          this,
          updatedId,
          importer,
          resolveOptions
        )
      }

      return this.resolve(
        updatedId,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions)
      ).then((resolved) => resolved || { id: updatedId })
    },
  }
}
```

# babel

https://github.com/rollup/plugins/blob/master/packages/babel/src/index.js

```ts
function createBabelInputPluginFactory(customCallback = returnObject) {
  const overrides = customCallback(babel)

  return (pluginOptions) => {
    const { customOptions, pluginOptionsWithOverrides } =
      getOptionsWithOverrides(pluginOptions, overrides)

    let babelHelpers
    let babelOptions
    let filter
    let skipPreflightCheck
    return {
      name: 'babel',
      /**
       * options hook是所有rollup hook中第一个执行的hook
       * 配置的预处理
       * 和buildStart区别：options各做各的，每个插件各自管自己的，拿到的配置项是自己的
       */
      options() {
        let exclude
        let include
        let extensions
        let customFilter
        ;({
          exclude,
          extensions,
          babelHelpers,
          include,
          filter: customFilter,
          skipPreflightCheck,
          ...babelOptions
        } = unpackInputPluginOptions(
          pluginOptionsWithOverrides,
          this.meta.rollupVersion
        ))

        const extensionRegExp = new RegExp(
          `(${extensions.map(escapeRegExpCharacters).join('|')})$`
        )
        const userDefinedFilter =
          typeof customFilter === 'function'
            ? customFilter
            : createFilter(include, exclude)
        filter = (id) =>
          extensionRegExp.test(stripQuery(id).bareId) && userDefinedFilter(id)

        return null
      },

      resolveId(id) {
        if (id !== HELPERS) {
          return null
        }
        return id
      },

      load(id) {
        if (id !== HELPERS) {
          return null
        }
        return babel.buildExternalHelpers(null, 'module')
      },

      transform(code, filename) {
        if (!filter(filename)) return null
        if (filename === HELPERS) return null

        return transformCode(
          code,
          { ...babelOptions, filename },
          overrides,
          customOptions,
          this,
          async (transformOptions) => {
            if (!skipPreflightCheck) {
              await preflightCheck(this, babelHelpers, transformOptions)
            }

            return babelHelpers === BUNDLED
              ? addBabelPlugin(transformOptions, bundledHelpersPlugin)
              : transformOptions
          }
        )
      },
    }
  }
}

export const getBabelInputPlugin = createBabelInputPluginFactory()
// output阶段的插件，执行的hook有：renderStart和renderChunk
// 注意: output阶段之外的hook 不能在output之外使用
export const getBabelOutputPlugin = createBabelOutputPluginFactory()
```

# replace

https://github.com/rollup/plugins/tree/master/packages/replace

```ts
export default function replace(options = {}) {
  return {
    name: 'replace',

    renderChunk(code, chunk) {
      const id = chunk.fileName
      if (!keys.length) return null
      if (!filter(id)) return null
      return executeReplacement(code, id)
    },

    transform(code, id) {
      if (!keys.length) return null
      if (!filter(id)) return null
      return executeReplacement(code, id)
    },
  }

  function executeReplacement(code, id) {
    const magicString = new MagicString(code)
    if (!codeHasReplacements(code, id, magicString)) {
      return null
    }

    const result = { code: magicString.toString() }
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true })
    }
    return result
  }

  function codeHasReplacements(code, id, magicString) {
    let result = false
    let match

    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(code))) {
      result = true

      const start = match.index
      const end = start + match[0].length
      const replacement = String(functionValues[match[1]](id))
      magicString.overwrite(start, end, replacement)
    }
    return result
  }

  function isSourceMapEnabled() {
    return options.sourceMap !== false && options.sourcemap !== false
  }
}
```

# ts

babel编译ts语法，不做类型校验
tsc校验+编译

# @rollup/plugin-eslint

build过程中生效对eslint的检查

# @rollup/plugin-image

解析图片

# @rollup/plugin-strip（不推荐）

删除全局作用域的所有的console.log和仅console.log的变量

# @rollup/plugin-wasm
