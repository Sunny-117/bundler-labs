import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-i18n',
    transform(code, id) {
      if (!/vue&type=i18n/.test(id)) {
        return
      }
      console.log(code)
      return `export default Comp => {
        Comp.i18n = ${code}
      }`
    },
  }
}
