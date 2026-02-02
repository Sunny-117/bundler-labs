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

module.exports = walk
