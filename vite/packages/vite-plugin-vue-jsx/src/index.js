// https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue-jsx/src/index.ts
// vue的jsx插件直接编译成js；而react会编译成jsx，因为vite中的esbuild原生支持jsx-react的解析
// https://github.com/vuejs/babel-plugin-jsx
// 这个插件，核心在于处理hmr，因为transform依赖的是babel
function vueJsxPlugin(options = {}) {
  let root = ''
  let needHmr = false
  let needSourceMap = true

  const { include, exclude, babelPlugins = [], ...babelPluginOptions } = options
  const filter = createFilter(include || /\.[jt]sx$/, exclude)

  return {
    name: 'vite:vue-jsx',

    config(config) {
      return {
        // only apply esbuild to ts files
        // since we are handling jsx and tsx now
        esbuild: {
          include: /\.ts$/, // 仅仅ts文件才使用esbuild编译，因为这个插件已经处理了除了ts之外的文件
          //  无法使用esbuild来编译vue jsx的文件的目的
        },
        define: {
          // 环境变量
          __VUE_OPTIONS_API__: config.define?.__VUE_OPTIONS_API__ ?? true,
          __VUE_PROD_DEVTOOLS__: config.define?.__VUE_PROD_DEVTOOLS__ ?? false,
        },
      }
    },

    configResolved(config) {
      // 开发状态，需要htr
      needHmr = config.command === 'serve' && !config.isProduction
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap
      root = config.root
    },

    resolveId(id) {
      if (id === ssrRegisterHelperId) {
        return id
      }
    },

    load(id) {
      if (id === ssrRegisterHelperId) {
        return ssrRegisterHelperCode
      }
    },

    async transform(code, id, opt) {
      const ssr = opt?.ssr === true
      const [filepath] = id.split('?')

      // use id for script blocks in Vue SFCs (e.g. `App.vue?vue&type=script&lang.jsx`)
      // use filepath for plain jsx files (e.g. App.jsx)
      // 这个文件是否要进行插件的transform
      if (filter(id) || filter(filepath)) {
        const plugins = [[jsx, babelPluginOptions], ...babelPlugins]
        if (id.endsWith('.tsx') || filepath.endsWith('.tsx')) {
          plugins.push([
            // @ts-ignore missing type
            await import('@babel/plugin-transform-typescript').then(
              (r) => r.default
            ),
            // @ts-ignore
            { isTSX: true, allowExtensions: true },
          ])
        }

        if (!ssr && !needHmr) {
          plugins.push(() => {
            return {
              visitor: {
                CallExpression: {
                  enter(_path) {
                    if (isDefineComponentCall(_path.node)) {
                      const callee = _path.node.callee
                      callee.name = `/* @__PURE__ */ ${callee.name}`
                    }
                  },
                },
              },
            }
          })
        }

        const result = babel.transformSync(code, {
          babelrc: false,
          ast: true,
          plugins,
          sourceMaps: needSourceMap,
          sourceFileName: id,
          configFile: false,
        })

        if (!ssr && !needHmr) {
          if (!result.code) return
          return {
            code: result.code,
            map: result.map,
          }
        }
        //        处理hmr
      }
    },
  }
}

// 根据AST组合hostComponents和declaredComponents

function parseComponentDecls(node) {
  const names = []
  for (const decl of node.declarations) {
    if (decl.id.type === 'Identifier' && isDefineComponentCall(decl.init)) {
      names.push(decl.id.name)
    }
  }
  return names
}
for (const node of result.ast.program.body) {
  if (node.type === 'VariableDeclaration') {
    const names = parseComponentDecls(node)
    if (names.length) {
      declaredComponents.push(...names)
    }
  }

  if (node.type === 'ExportNamedDeclaration') {
    if (node.declaration && node.declaration.type === 'VariableDeclaration') {
      hotComponents.push(
        ...parseComponentDecls(node.declaration).map((name) => ({
          local: name,
          exported: name,
          id: getHash(id + name),
        }))
      )
    } else if (node.specifiers.length) {
      for (const spec of node.specifiers) {
        if (
          spec.type === 'ExportSpecifier' &&
          spec.exported.type === 'Identifier'
        ) {
          const matched = declaredComponents.find(
            (name) => name === spec.local.name
          )
          if (matched) {
            hotComponents.push({
              local: spec.local.name,
              exported: spec.exported.name,
              id: getHash(id + spec.exported.name),
            })
          }
        }
      }
    }
  }

  if (node.type === 'ExportDefaultDeclaration') {
    if (node.declaration.type === 'Identifier') {
      const _name = node.declaration.name
      const matched = declaredComponents.find((name) => name === _name)
      if (matched) {
        hotComponents.push({
          local: _name,
          exported: 'default',
          id: getHash(`${id}default`),
        })
      }
    } else if (isDefineComponentCall(node.declaration)) {
      hasDefault = true
      hotComponents.push({
        local: '__default__',
        exported: 'default',
        id: getHash(`${id}default`),
      })
    }
  }
}
