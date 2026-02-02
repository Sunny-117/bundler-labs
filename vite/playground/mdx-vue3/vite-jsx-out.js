import {
  createVNode as _createVNode,
  mergeProps as _mergeProps,
} from '/node_modules/.vite/deps/vue.js?v=d6bc0437'
const layoutProps = {}
const MDXLayout = 'wrapper'
export default function MDXContent({ components, ...props }) {
  return _createVNode(
    MDXLayout,
    _mergeProps(layoutProps, props, {
      components,
      mdxType: 'MDXLayout',
    }),
    {
      default: () => [
        _createVNode('h1', null, [`hello`]),
        _createVNode('p', null, [`this is a post`]),
      ],
    }
  )
}
MDXContent.isMDXComponent = true
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJsYXlvdXRQcm9wcyIsIk1EWExheW91dCIsIk1EWENvbnRlbnQiLCJjb21wb25lbnRzIiwicHJvcHMiLCJfY3JlYXRlVk5vZGUiLCJfbWVyZ2VQcm9wcyIsImRlZmF1bHQiLCJpc01EWENvbXBvbmVudCJdLCJzb3VyY2VzIjpbInRlc3QubWR4Il0sInNvdXJjZXNDb250ZW50IjpbIlxuXG5cbmNvbnN0IGxheW91dFByb3BzID0ge1xuICBcbn07XG5jb25zdCBNRFhMYXlvdXQgPSBcIndyYXBwZXJcIlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTURYQ29udGVudCh7XG4gIGNvbXBvbmVudHMsXG4gIC4uLnByb3BzXG59KSB7XG4gIHJldHVybiA8TURYTGF5b3V0IHsuLi5sYXlvdXRQcm9wc30gey4uLnByb3BzfSBjb21wb25lbnRzPXtjb21wb25lbnRzfSBtZHhUeXBlPVwiTURYTGF5b3V0XCI+XG4gICAgPGgxPntgaGVsbG9gfTwvaDE+XG4gICAgPHA+e2B0aGlzIGlzIGEgcG9zdGB9PC9wPlxuICAgIDwvTURYTGF5b3V0Pjtcbn1cbjtcbk1EWENvbnRlbnQuaXNNRFhDb21wb25lbnQgPSB0cnVlOyJdLCJtYXBwaW5ncyI6IjtBQUdBLE1BQU1BLFdBQVcsR0FBRyxDQUVwQixDQUFDO0FBQ0QsTUFBTUMsU0FBUyxHQUFHLFNBQVM7QUFDM0IsZUFBZSxTQUFTQyxVQUFVQSxDQUFDO0VBQ2pDQyxVQUFVO0VBQ1YsR0FBR0M7QUFDTCxDQUFDLEVBQUU7RUFDRCxPQUFBQyxZQUFBLENBQUFKLFNBQUEsRUFBQUssV0FBQSxDQUFzQk4sV0FBVyxFQUFNSSxLQUFLO0lBQUEsY0FBY0QsVUFBVTtJQUFBO0VBQUE7SUFBQUksT0FBQSxFQUFBQSxDQUFBLE1BQUFGLFlBQUEsY0FDNUQsT0FBTSxJQUFBQSxZQUFBLGFBQ1AsZ0JBQWU7RUFBQTtBQUV4QjtBQUNBO0FBQ0FILFVBQVUsQ0FBQ00sY0FBYyxHQUFHLElBQUkifQ==
