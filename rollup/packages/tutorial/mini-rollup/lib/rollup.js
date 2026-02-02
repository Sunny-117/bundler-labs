const Bundle = require('./bundle')
function rollup(entry, output) {
  console.log('构建开始')
  const bundle = new Bundle({ entry })
  bundle.build(output)
  console.log('构建成功')
}
module.exports = rollup
