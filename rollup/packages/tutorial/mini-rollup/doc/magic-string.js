const MagicString = require('magic-string')
const sourceCode = `export var name = 'sunny'`
const ms = new MagicString(sourceCode)
console.log(ms)

console.log(ms.snip(0, 6).toString())
console.log(ms.remove(0, 7).toString())

const bundle = new MagicString.Bundle()
bundle.addSource({
  content: `const a = 1;`,
  separator: '\n',
})

bundle.addSource({
  content: `const b = 2;`,
  separator: '\n',
})

console.log(bundle.toString())
