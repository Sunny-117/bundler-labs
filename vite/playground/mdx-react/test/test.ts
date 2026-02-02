import compile from '@mdx-js/mdx'
const code1 = `# hello`
const code2 = `
# hello

> will this

<Button>click me</Button>

- first
- second

export const a = 1;
`

/**
 * 关于mdx输出
 *
 * 通过注释的范式告诉jsx编译器标签的代码编译成什么样,是为了告诉babel编译器
 * https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx
 * @jsxRuntime classic: 不希望import React
 * @jsx mdx: 指定了mdx为jsx，MDXLayout，表示React.createElement会被编译成mdx
 *      此处的mdx需要我们来import
 * loader: https://github.com/mdx-js/mdx/tree/main/packages/loader
 */

const res = await compile.default(code2)
console.log(res)
