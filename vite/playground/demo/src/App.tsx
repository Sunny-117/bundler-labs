export default function App() {
  return <div>App</div>
}
// 正式环境是没有的，所以会被rollup删掉
if (import.meta.hot) {
  import.meta.hot.on('test', (val) => {
    console.log(val)
  })
}
