import parser from '@babel/parser'
import t from '@babel/traverse'
import g from '@babel/generator'
const traverse = t.default;
const generator = g.default;

// let -> var
const code = `
let a = 1
let b = 2
`
const ast = parser.parse(code)
traverse(ast, {
  enter(path) {
    if (path.isVariableDeclaration({ kind: 'let' })) {
      path.node.kind = 'var'
    }
  }
})
const output = generator(ast, {}, code)
console.log(output.code)
