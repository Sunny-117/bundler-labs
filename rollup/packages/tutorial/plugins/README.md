# plugin

- Rollup 插件 是一个具有以下描述的一个或多个 属性 、 构建钩子 和 输出生成钩子 的对象，它遵循我们的约定。插件应该作为一个包分发，该包导出一个可以使用插件特定选项调用的函数并返回这样一个对象
- 插件列表: https://github.com/rollup/awesome

## 插件规范

- 插件应该有一个清晰的名称，带有 rollup-plugin-prefix
- 在package.json中包含插件关键字
- 插件应该经过测试。我们推荐mocha或ava，它们支持开箱即用的Promise
- 尽可能使用异步方法。
- 编写英文文档
- 如果合适的话，确保你的插件输出正确的 sourcemap
- 如果您的插件使用“虚拟模块”（例如，用于辅助功能），请在模块ID前面加上 \0 。这会阻止其他插件尝试处理它

## 常用插件

```
rollup-plugin-vue 看下插件源码
rollup-plugin-react
@rollup/plugin-babel
@rollup/plugin-commonjs
@rollup/plugin-node-resolve
@rollup/plugin-typescript
"rollup-plugin-clear": "^2.0.7",
"rollup-plugin-generate-html-template": "^1.7.0",
"rollup-plugin-livereload": "^2.0.5",
"rollup-plugin-postcss": "^4.0.2",
"rollup-plugin-scss": "^4.0.0",
"rollup-plugin-serve": "^2.0.2",
"rollup-plugin-visualizer": "^5.9.2",
"@rollup/plugin-alias": "^5.0.0",
"@rollup/plugin-babel": "^6.0.3",
"@rollup/plugin-commonjs": "^25.0.4",
"@rollup/plugin-image": "^3.0.2",
"@rollup/plugin-node-resolve": "^15.2.1",
"@rollup/plugin-replace": "^5.0.2",
"@rollup/plugin-terser": "^0.4.3",
"@rollup/plugin-typescript": "^11.1.3",
```

## 注意

webpack和rollup都会支持esm和commonjs，但是打包出来的结果webpack只能是commonjs

rollup可以打包出commonjs也可以打包出esm
