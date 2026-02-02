import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

export const getDefaultPlugins = () => [
    nodeResolve(),
    commonjs(),
    // terser(),
    visualizer()
];