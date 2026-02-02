## Mdx 基础使用

```ts
import { compile } from '@mdx-js/mdx'
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
 * 通过注释的范式告诉jsx编译器标签的代码编译成什么样
 * @jsxRuntime classic: 不希望import React
 * @jsx mdx: 指定了mdx为jsx，MDXLayout，表示React.createElement会被编译成mdx
 *      此处的mdx需要我们来import
 */

const res = await compile(code2)
console.log(res.value)

// https://github.com/mdx-js/mdx/tree/main/packages/loader
// https://github.com/mdx-js/mdx/tree/main/packages/react
```

## @mdx-js/react源码

```ts
import React from 'react'

export const MDXContext = React.createContext({})

export function withMDXComponents(Component) {
  return boundMDXComponent
  function boundMDXComponent(props) {
    const allComponents = useMDXComponents(props.components)
    return React.createElement(Component, { ...props, allComponents })
  }
}

export function useMDXComponents(components) {
  const contextComponents = React.useContext(MDXContext)

  return React.useMemo(() => {
    if (typeof components === 'function') {
      return components(contextComponents)
    }

    return { ...contextComponents, ...components }
  }, [contextComponents, components])
}

const emptyObject = {}

export function MDXProvider({ components, children, disableParentContext }) {
  let allComponents

  if (disableParentContext) {
    allComponents =
      typeof components === 'function'
        ? components({})
        : components || emptyObject
  } else {
    allComponents = useMDXComponents(components)
  }

  return React.createElement(
    MDXContext.Provider,
    { value: allComponents },
    children
  )
}
```
