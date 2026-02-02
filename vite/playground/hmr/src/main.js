// import { render } from './renderA'
import { render } from './renderF'
render()

if (import.meta.hot) {
  // 1. 热更新自己
  // import.meta.hot.accept()

  // 2. 只热更新css
  // import.meta.hot.accept(['./style.css'])

  // 3. 如果不写accept，则没有模块接受处理热更新 则刷新页面

  // 4. 只接受renderA的更新，但是没有接受main.js自己的更新，所以也不会刷新了
  // import.meta.hot.accept(['./renderA'])

  // 5. 处理情况4: 手动更新页面 实现热更新
  import.meta.hot.accept(['./renderF'], ([newA]) => {
    newA.render()
  })

  // 6. 和webpack的区别：webpack设计了一套模块代理功能（webpack模块管理基础）；vite是基于esm的加载方式的，如果也proxy，会给每个模块生成一个proxy有一定开销
  // main.js里面的老的代码版本并没有消失，如果有事情 还是正在继续做着
  // 热更新的时候，遗留的定时器依旧在执行
}

// import.meta.hot.accept  接受了热更新，页面不会刷新了，模块会自动执行
// import.meta.hot.accept((newModule) => {
//   newModule.render()
// })
