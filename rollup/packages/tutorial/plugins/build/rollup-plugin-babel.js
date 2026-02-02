import { createFilter } from 'rollup-pluginutils'
import {pick} from 'lodash-es'
import babel from '@babel/core'

function Babel(options = {}) {
  const { exclude, include, extensions = ['.js', '.jsx'] } = options;
  const extensionRegExp = new RegExp(`(${extensions.join('|')})$`)
  const userDefinedFilter = createFilter(include, exclude);
  const filter = id => extensionRegExp.test(id) && userDefinedFilter(id);
  return {
    name: 'babel-plugin',
    /**
     * 类似webpack loader
     */
    async transform(code, id) {
      console.log('id=', id)
      // if (!filter(id)) return null; // TODO: 有点问题
      let result = await babel.transformAsync(code, pick(options, 'presets'));
      return result
    }
  }
}
export default Babel
