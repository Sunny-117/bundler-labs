const MagicString = require('magic-string')
const { parse } = require('acorn')
const analyse = require('./ast/analyse')
const { hasOwnProperty } = require('./utils')

const SYSTEM_VARS = ['console', 'log']

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code)
    this.path = path
    this.bundle = bundle
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    })
    // 本模块内导入了哪些变量
    this.imports = {}
    // 本模块内导出了哪些变量
    this.exports = {}
    // 存放变量修改语句
    this.modifications = {}
    // 存放本模块顶级变量的定义语句是哪条
    this.definitions = {}
    // 重命名的变量
    this.canonicalNames = {}
    analyse(this.ast, this.code, this);
    console.log('this.imports', this.imports)
    console.log('this.definitions', this.definitions)
  }
  expandAllStatements() {
    let allStatements = []
    this.ast.body.forEach(statement => {
      /**
       * 忽略import声明
       */
      if (statement.type === 'ImportDeclaration') {
        return
      }
      /**
       * 忽略所有变量声明语句
       */
      if (statement.type === 'VariableDeclaration') {
        return
      }
      let statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }
  /**
   * 找到此语句时用到的变量，把这些变量的定义语句取出来，放到result中
   * @param {*} statement 
   * @returns 
   */
  expandStatement(statement) {
    statement._included = true
    let result = []
    const _dependsOn = Object.keys(statement._dependsOn)
    _dependsOn.forEach(name => {
      let definitions = this.define(name)
      result.push(...definitions)
    })
    result.push(statement)
    console.log('result->', result)
    // 还要找到此语句定义的变量，把此变量对应的修改语句也包括进来
    const defines = Object.keys(statement._defines)
    defines.forEach(name => {
      const modifications = hasOwnProperty(this.modifications, name) && this.modifications[name]
      if (modifications) {
        modifications.forEach(modification => {
          if (!modification._included) {
            let statement = this.expandStatement(modification)
            result.push(...statement)
          }
        })
      }
    })

    return result
  }
  define(name) {
    // 区分此变量是函数内自己声明的还是外部导入的
    if (hasOwnProperty(this.imports, name)) {
      // 外部导入的
      const { source, importName } = this.imports[name]
      console.log('------>', { source, path: this.path })
      const importedModule = this.bundle.fetchModule(source, this.path)
      const { localName } = importedModule.exports[importName]
      return importedModule.define(localName)
    } else {
      // 函数内自己声明的
      const statement = this.definitions[name] // 此变量的定义语句
      if (statement) {
        if (statement._included) { // 防止重复导入
          return []
        } else {
          return this.expandStatement(statement)
        }
      } else {
        if (SYSTEM_VARS.includes(name)) {
          return []
        } else {
          throw new Error(`变量${name}既没有从外部导入，也没有被定义`)
        }
      }
    }
  }
  rename(name, replacement) {
    this.canonicalNames[name] = replacement
  }
  getCanonicalName(name) {
    return this.canonicalNames[name] || name;
  }
}
module.exports = Module
