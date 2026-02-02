/* @jsxRuntime classic */
/* @jsx mdx */

export const a = 1
const makeShortcode = (name) =>
  function MDXDefaultShortcode(props) {
    console.warn(
      `Component ${
        name
      } was not imported, exported, or provided by MDXProvider as global scope`
    )
    return <div {...props} />
  }
const Button = makeShortcode('Button')
const layoutProps = {
  a,
}
const MDXLayout = 'wrapper'
export default function MDXContent({ components, ...props }) {
  return (
    <MDXLayout
      {...layoutProps}
      {...props}
      components={components}
      mdxType="MDXLayout"
    >
      <h1>{`hello`}</h1>
      <blockquote>
        <p parentName="blockquote">{`will this`}</p>
      </blockquote>
      <Button mdxType="Button">click me</Button>
      <ul>
        <li parentName="ul">{`first`}</li>
        <li parentName="ul">{`second`}</li>
      </ul>
    </MDXLayout>
  )
}
MDXContent.isMDXComponent = true
