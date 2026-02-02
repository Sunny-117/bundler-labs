const acorn = require('acorn')
const sourceCode = `import $ from 'jquery'`

const ast = acorn.parse(sourceCode, {
  locations: true,
  ranges: true,
  sourceType: 'module',
  ecmaVersion: 8,
})

// console.log(ast)

ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      console.log(`进入${node.type}`)
    },
    leave(node) {
      console.log(`离开${node.type}`)
    },
  })
})

function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave)
}
function visit(node, parent, enter, leave) {
  if (enter) {
    enter(node, parent)
  }
  /**
   * 遍历子节点
   */
  const keys = Object.keys(node).filter((key) => typeof node[key] === 'object')
  keys.forEach((key) => {
    const value = node[key]
    if (Array.isArray(value)) {
      // 数组
      value.forEach((item) => {
        if (item.type) {
          visit(item, node, enter, leave)
        }
      })
    } else if (value && value.type) {
      // 对象
      visit(value, node, enter, leave)
    }
  })
  if (leave) {
    leave(node, parent)
  }
}

/**

ImportDeclaration进入
  ImportDefaultSpecifier进入
    Identifier进入
    Identifier离开
  ImportDefaultSpecifier离开
  Literal进入
  Literal离开
ImportDeclaration离开


 */
