export function render() {
  document.querySelector('#app').innerHTML = `
      demo121
    `
}
let index = 1
setInterval(() => {
  console.log(index++)
}, 1000)
