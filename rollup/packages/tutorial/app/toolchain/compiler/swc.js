import { swc } from 'rollup-plugin-swc3';

export default (userConfig) => swc({
    jsc: {
        target: 'es5',
        parser: {
            syntax: 'ecmascript',
            jsx: true
        },
        transform: {
            react: {
                pragma: 'React.createElement'
            }
        },
        externalHelpers: true
    },
    ...userConfig
});