const walk = require("./ast/walk")

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function addSuffix(path) {
  return path.replace(/\.js$/, '') + '.js'
}


exports.hasOwnProperty = hasOwnProperty
exports.addSuffix = addSuffix

function replaceIdentifier(statement, source, replacements) {
  walk(statement, {
    enter(node) {
      if (node.type === 'Identifier') {
        if (node.name && replacements[node.name]) {
          source.overwrite(node.start, node.end, replacements[node.name])
        }
      }

    }
  })

}
exports.replaceIdentifier = replaceIdentifier;
