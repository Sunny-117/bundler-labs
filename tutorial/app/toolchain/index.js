import { getCompiler } from './compiler/index.js';
import { getDefaultPlugins } from './plugins.js';

export const createConfig = (userOptions = {}) => {
    const {
        compiler = 'swc',
        compilerOptions = {},
        plugins = [],
        ...rollupConfig
    } = userOptions;

    return {
        input: 'src/main.js',
        output: {
            dir: 'dist',
            format: 'esm'
        },
        plugins: [
            ...getDefaultPlugins(),
            getCompiler(compiler, compilerOptions),
            ...plugins
        ],
        ...rollupConfig
    };
};