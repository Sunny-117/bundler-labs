// 如果把副作用写render里面

// let index = 1;
// export function render() {
//   setInterval(() => {
//     index++;
//     document.querySelector("#app").innerHTML = `
//     12demo${index}
//   `;
//   }, 1000);
// }

// if (import.meta.hot) {
// }

// 销毁：每次hmr后，index的状态没有保留，如何保留呢？renderE
let index = 1
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
  import.meta.hot.dispose(() => {
    if (timer) clearInterval(timer)
  })
}
