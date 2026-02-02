import { compile } from '@mdx-js/mdx'
const code2 = `
# hello

> will this

<Button>click me</Button>

- first
- second

export const a = 1;
`

const res = await compile(code2)
console.log(res.value)
