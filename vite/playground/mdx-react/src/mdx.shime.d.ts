declare module '*.mdx' {
  import type React from 'react'
  type MDX = () => React.ReactElement
  const mdx: MDX
  export default mdx
}
