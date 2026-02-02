declare module '@mdx-js/mdx' {
  type createCompilerType = (...args: any) => any
  interface MDX {
    (...args: any): any
    sync: (...args: any) => any
  }
  const mdx: MDX
  export default mdx
  export const createCompiler: createCompilerType
}
