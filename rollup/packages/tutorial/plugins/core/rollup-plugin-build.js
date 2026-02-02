/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import fs from 'node:fs'

function build() {
  return {
    name: 'build',
    async watchChange(id, change) {
      console.log('watchChange', id, change)
    },
    async closeWatcher() {
      console.log('closeWatcher')
    },
    async options(inputOptions) {
      console.log('options')
      //inputOptions.input = './src/main.js';
    },
    async buildStart(inputOptions) {
      console.log('buildStart')
    },
    async resolveId(source, importer) {
      console.log('resolveId被执行了')
      if (source === 'virtual') {
        console.log('resolveId', source)
        //如果resolveId钩子有返回值了，那么就会跳过后面的查找逻辑，以此返回值作为最终的模块ID
        return source
      }
    },
    //加载此模块ID对应的内容
    async load(id) {
      if (id === 'virtual') {
        console.log('load', id)
        return `export default "virtual"`
      }
    },
    async shouldTransformCachedModule({ id, code, ast }) {
      console.log('shouldTransformCachedModule') // 需要通过热更新测试
      //不使用缓存，再次进行转换
      return true
    },
    async transform(code, id) {
      console.log('transform')
    },
    async moduleParsed(moduleInfo) {
      console.log('moduleParsed')
    },
    async resolveDynamicImport(specifier, importer) {
      console.log('resolveDynamicImport', specifier, importer)
      // 如果返回了id，则不会执行resolveId钩子
      // return {id: '/Users/fuzhiqiang/Desktop/rollup-core-plugins/tutorial/plugins/src/msg.js'}
    },
    async buildEnd() {
      console.log('buildEnd')
    },
  }
}
export default build
