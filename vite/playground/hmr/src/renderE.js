// cache

let index = import.meta.hot.data?.cache?.getIndex
  ? import.meta.hot.data.cache?.getIndex()
  : 0
let timer
export function render() {
  timer = setInterval(() => {
    index++
    document.querySelector('#app').innerHTML = `
    12demo${index}
  `
  }, 1000)
}

if (import.meta.hot) {
  /**
   * 需是引用类型，不能原始类型
   */
  import.meta.hot.data.cache = {
    getIndex() {
      return index
    },
  }
  import.meta.hot.dispose(() => {
    if (timer) clearInterval(timer)
  })
}

// 注意： import.meta.hot.data 是每一个模块独有的

// 强制刷新页面
// import.meta.hot.decline();
// decline的优先级比accept要低，如果对模块进行了accept，decline会失效
