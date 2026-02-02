import { msg } from './msg.js'
// import {AClass} from './不需要babel.mjs'

// import json from './1.json'
// console.log(json)
// console.log('abc', msg)

// import '\0polyfill'
// import './polyfill'
// console.log('main')

const getName = () => {
  // console.log(AClass)
  return msg
}

console.log(getName())
