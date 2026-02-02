function two() {
  var twoValue = 'twoValue'
  return twoValue
}
function two2() {
  var twoValue = 'twoValue'
  return twoValue
}
function one() {
  var twoValue = two()
  var twoValue2 = two2()
  console.log(twoValue, twoValue2)
}

one()

// 面临变量重复定义问题
// rollup源码会将重复的变量重命名
