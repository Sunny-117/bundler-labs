// 副作用处理，进行销毁
export function render() {
  document.querySelector('#app').innerHTML = `
      demo1
    `
}
let index = 1
const timer = setInterval(() => {
  console.log(index++)
}, 1000)

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (timer) clearInterval(timer)
  })
}
