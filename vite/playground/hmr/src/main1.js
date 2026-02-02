// 条件刷新
import { render } from './renderA'
render()

if (import.meta.hot) {
  import.meta.hot.accept(['./renderA'], ([newA]) => {
    console.log(newA.index)
    if (newA.index > 5) {
      // 条件判断是否刷新
      import.meta.hot.invalidate() // 强制浏览器刷新页面
    } else {
      newA.render()
    }
  })
}
