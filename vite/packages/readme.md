# vite和rollup插件的区别

build中配置rollupOptions声明plugins

vite：modulePased不会被调用，因为防止vite对整体代码执行ast的解析（速度慢），vite是用esbuild做的

rollup插件兼容vite的条件：没有使用modulePased钩子，他在打包钩子和输出钩子之间没有强耦合（代码输出如果非常依赖build阶段的插件的hook执行的话，在vite中不好用）

# vite插件执行时机

- pre
- normal
- post
