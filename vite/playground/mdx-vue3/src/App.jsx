import { defineComponent } from 'vue'
import { MDXProvider } from 'vite-mdx/vue3'
import Hello from './test.mdx'
export const Foo = defineComponent({
  setup() {
    return () => {
      return (
        <MDXProvider
          components={{
            h1: (props, { slots }) => (
              <div data-at="h1" {...props}>
                {slots.default && slots.default()}
              </div>
            ),
          }}
        >
          <p>123</p>
          <Hello />
        </MDXProvider>
      )
    }
  },
})
