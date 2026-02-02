import vm from 'virtual-module'
import pkg from '../package.json'
import json from './test.json'
// import logo from './assets/react.png'
// import rollup from './assets/rollup.svg'
// console.log(rollup)
// console.log(logo)

console.log(vm(10))
console.log(json)

console.log(pkg.name)

// document.querySelector('#app').innerHTML = `
//   <div>
//     <img src="${logo}" alt="logo" />
//   </div>
// `
