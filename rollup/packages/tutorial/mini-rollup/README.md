# 说明

## 架构

```
├── package.json
├── README.md
├── src
    ├── ast
    │   ├── analyse.js //分析AST节点的作用域和依赖项
    │   ├── Scope.js //有些语句会创建新的作用域实例
    │   └── walk.js //提供了递归遍历AST语法树的功能
    ├── Bundle//打包工具，在打包的时候会生成一个Bundle实例，并收集其它模块，最后把所有代码打包在一起输出
    │   └── index.js
    ├── Module//每个文件都是一个模块
    │   └── index.js
    ├── rollup.js //打包的入口模块
    └── utils
        ├── map-helpers.js
        ├── object.js
        └── promise.js
```

## 模块

```js
//存放本模块导入了哪些变量
this.imports = {}
// 存放本模块导出了哪些变量
this.exports = {}
//存放本模块的定义变量的语句
this.definitions = {}
//此变量存放所有的变量修改语句,key是变量名，值是一个数组
this.modifications = {} //{name:[name+='jiagou'],age:'age++'}
//记得重命名的变量{key老的变量名:value新的变量名}
this.canonicalNames = {} //{age:'age$1'}
//本模块从哪个模块导入了什么变量，在当前模块内叫什么名字
//this.imports.name = {'./msg','name'};
this.imports[localName] = { source, importName }
//本模块导出了哪个变量，对应哪个本地变量
//this.exports.name = {localName:'name'};
this.exports[exportName] = { localName }
//本顶级语句定义的变量
statement._defines[name] = true
//定义变量的语句
this.definitions[name] = statement
//本语句用到的变量
statement._dependsOn[name] = true
//从模块中获取定义变量的语句
module.define(name)
```
