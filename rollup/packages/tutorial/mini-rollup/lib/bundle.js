const path = require('node:path')
const fs = require('node:fs')
const Module = require('./module')
const MagicString = require('magic-string')
const { addSuffix, hasOwnProperty, replaceIdentifier } = require('./utils')
class Bundle {
  constructor(options) {
    // 入口文件绝对路径
    this.entryPath = path.resolve(addSuffix(options.entry))
    this.modules = new Set()
  }
  build(output) {
    // 获取入口文件对应的模块
    const entryModule = this.fetchModule(this.entryPath)
    // console.log('entryModule:', entryModule)
    this.statements = entryModule.expandAllStatements()
    // console.log('this.statements', this.statements)
    this.deconflict()
    const { code } = this.generate()
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(output, code)
  }
  deconflict() {
    const defines = {} // 定义的变量
    const conflict = {} // 变量名重复的变量
    this.statements.forEach(statement => {
      Object.keys(statement._defines).forEach(name => {
        if (hasOwnProperty(defines, name)) {
          conflict[name] = true
        } else {
          defines[name] = []
        }
        defines[name].push(statement._module)
      })
    })
    Object.keys(conflict).forEach(name => {
      const modules = defines[name]
      modules.pop() // 最后一个模块不需要重命名，可以保留原有的变量名
      modules.forEach((module, index) => {
        let replacement = `${name}${modules.length - index}`
        module.rename(name, replacement)
      })
    });

  }
  generate() {
    let bundle = new MagicString.Bundle()
    this.statements.forEach(statement => {
      let replacements = {};
      // 获取依赖的变量和定义的变量
      Object.keys(statement._dependsOn).concat(Object.keys(statement._defines)).forEach(name => {
        const canonicalName = statement._module.getCanonicalName(name)
        if (name !== canonicalName) {
          replacements[name] = canonicalName
        }
      })
      const source = statement._source.clone();
      /**
       * export const name = '123'
       * ---->
       * const name = '123'
       */
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start)
      }
      replaceIdentifier(statement, source, replacements)
      bundle.addSource({
        content: source,
        separator: '\n'
      })
    })
    return { code: bundle.toString() }
  }
  /**
   * 根据文件路径获取模块（创建模块实例）
   * @param {*} importee 此模块真实的文件路径（被引入的模块） ./msg.js 被调用者
   * @param {*} importer 导入此模块的文件路径（引入别的模块的模块） main.js 调用者
   * 从importer中引入importee
   */
  fetchModule(importee, importer) {
    let route
    if (!importer) {
      // 根路径
      route = importee
    } else {
      if (path.isAbsolute(importee)) {
        route = importee
      } else {
        route = path.resolve(path.dirname(importer), addSuffix(importee))
      }
    }
    if (route) {
      const code = fs.readFileSync(route, 'utf8')
      const module = new Module({
        code,
        path: route,
        bundle: this,
      })
      this.modules.add(module)
      return module
    }
  }
}
module.exports = Bundle
