import { defineConfig } from "rollup";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

// import alias from "@rollup/plugin-alias";
import alias from "./plugins/my-alias.ts";
const mode = process.env.MODE;
const isLocal = mode === "local";

// export default defineConfig({
//   input: "index.js",
//   output: {
//     file: "dist.js",
//     format: isLocal ? "es" : "umd",
//     name: "Index",
//   },
// });

const commonConfig = {
  input: "index.js",
  plugins: [
    resolve(),
    alias({
      entries: {
        a: "./a",
      },
    }),
    commonjs(),
    json(),
  ],
  external: ["react"],
};
/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    ...commonConfig,
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "Index",
      banner: "/** this is a banner **/",
    },
  },
  {
    ...commonConfig,
    output: {
      file: "dist/index.es.js",
      format: "es",
      // 代码编译做完了之后才会执行的plugins
      plugins: [terser()],
    },
  },
];

// 打包react到打包结果，插件：@rollup/plugin-node-resolve
// 支持使用cjs插件：@rollup/plugin-commonjs
// 用了这些插件后，有些包又不想要打包进来，可以通过external:['react']
// https://github.com/rollup/plugins
