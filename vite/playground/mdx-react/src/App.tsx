import Hello from './test.mdx'
// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <div>
      <h1>App</h1>
      <Hello />
    </div>
  )
}
// 正式环境是没有的，所以会被rollup删掉
if (import.meta.hot) {
  import.meta.hot.on('test', (val) => {
    console.log(val)
  })
}
