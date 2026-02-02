import {
  createVNode,
  defineComponent,
  Fragment,
  type PropType,
  type SetupContext,
  type VNodeTypes,
} from 'vue'
import { useMDXComponents, type PropsComponents } from './context'

const TYPE_PROP_NAME = 'mdxType'

const DEFAULTS = {
  inlineCode: 'code',
  wrapper: (props: any, { slots }: SetupContext) =>
    createVNode(Fragment, {}, slots.default && slots.default()),
}
const MDXCreateComponent = defineComponent({
  name: 'MDXCreateComponent',
  props: {
    components: {
      type: Object as PropType<PropsComponents>,
      default: () => ({}),
    },
    originalType: String,
    mdxType: String,
    parentName: String,
  },
  setup(props, { slots }) {
    const componentsRef = useMDXComponents(() => props.components)

    return () => {
      const components: any = componentsRef.value
      const { parentName, originalType, mdxType: type, ...etc } = props
      const Component =
        components[`${parentName}.${type}`] ||
        components[type!] ||
        DEFAULTS[type] ||
        originalType
      return createVNode(
        Component,
        {
          ...etc,
        },
        slots.default && slots.default()
      )
    }
  },
})
// eslint-disable-next-line import/no-default-export
export default function mdx(
  type: VNodeTypes,
  props: any,
  children: unknown,
  patchFlag?: number,
  dynamicProps?: string[] | null,
  isBlockNode?: boolean
) {
  let component = type
  let newProps = props
  const mdxType = props && props.mdxType
  if (typeof type === 'string' || mdxType) {
    component = MDXCreateComponent
    newProps = {}
    // eslint-disable-next-line no-restricted-syntax
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        newProps[key] = props[key]
      }
    }
    newProps.originalType = type
    newProps[TYPE_PROP_NAME] = typeof type === 'string' ? type : mdxType
  }
  return createVNode(
    component,
    newProps,
    children,
    patchFlag,
    dynamicProps,
    isBlockNode
  )
}
