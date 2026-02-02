// 作用域链是由当前执行环境与上层执行环境的一系列变量对象组成的，
// 它保证了当前执行环境对符合访问权限的变量和函数的有序访问

class Scope {
  constructor(options = {}) {
    //作用域的名称
    this.name = options.name
    //父作用域
    this.parent = options.parent
    //此作用域内定义的变量
    this.names = options.names || []
  }
  add(name) {
    this.names.push(name)
  }
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this
    } else if (this.parent) {
      return this.parent.findDefiningScope(name)
    } else {
      return null
    }
  }
}
module.exports = Scope
