const a = 1
function one() {
  const b = 1
  function two() {
    const c = 2
    console.log(a, b, c)
  }
}

const Scope = require('./scope')

const globalScope = new Scope({ name: 'global', names: ['a'], parent: null })
const oneScope = new Scope({ name: 'one', names: ['b'], parent: globalScope })
const twoScope = new Scope({ name: 'two', names: ['c'], parent: oneScope })

console.log(
  twoScope.findDefiningScope('a').name,
  twoScope.findDefiningScope('b').name,
  twoScope.findDefiningScope('c').name
)
