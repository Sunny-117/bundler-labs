# babel-plugin-dev-debug

an babel plugin that for dev debug

命名规范：前缀：`babel-plugin`

## why

Sometimes we need to write some logic in the development environment for debugging and development purposes

However, we don't want the debug code to be released to the production environment

This plugin is designed to solve this problem

## Install

```shell
npm i babel-plugin-dev-debug
```

## Usage

add babel-plugin-dev-debug plugin to babel.config.js

```js
// babel.config.js
module.exports = {
  plugins: ["dev-debug"],
};
```

in you code

```js
if (DEBUG) {
  // do something for debug
  // removed in production env
  const a = 10;
  const b = 20;
  console.log(a + b);
}
```

if you use eslint you must be add DEBUG to globals to eslint.config.js

```js
// .eslintrc.js
module.exports = {
  globals: {
    DEBUG: true,
  },
};
```

# 开发思路：
## 前置知识：AST

https://lihautan.com/babel-ast-explorer/#?eyJiYWJlbFNldHRpbmdzIjp7InZlcnNpb24iOiI3LjYuMCJ9LCJ0cmVlU2V0dGluZ3MiOnsiaGlkZUVtcHR5Ijp0cnVlLCJoaWRlTG9jYXRpb24iOnRydWUsImhpZGVUeXBlIjp0cnVlLCJoaWRlQ29tbWVudHMiOnRydWV9LCJjb2RlIjoiY29uc3QgYSA9IDE7XG5jb25zdCB2ID0gMjsifQ==

## 说明

1. 在`dev`环境下可执行

2. 到了`prod`环境下代码会被移除

打包
```shell
npm run build
```

```serve``` 命令来启动打包结果