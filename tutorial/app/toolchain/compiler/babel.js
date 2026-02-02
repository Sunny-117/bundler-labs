import { babel } from '@rollup/plugin-babel';

export default (userConfig) => babel({
    babelHelpers: 'runtime',
    exclude: /node_modules/,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    configFile: userConfig.configFile || './.babelrc.json',
    ...userConfig
});