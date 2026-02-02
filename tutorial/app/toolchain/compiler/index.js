import createBabel from './babel.js';
import createSwc from './swc.js';

export const getCompiler = (type = 'swc', userConfig = {}) => {
    const compilers = {
        babel: createBabel,
        swc: createSwc
    };

    if (!compilers[type]) {
        throw new Error(`Unsupported compiler: ${type}`);
    }

    return compilers[type](userConfig);
};