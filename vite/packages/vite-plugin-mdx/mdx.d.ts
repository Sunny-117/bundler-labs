declare module '@mdx-js/mdx' {
  function createCompiler(code: string): {
    processSync: (code: string) => {
      contents: string
    }
  }
}
