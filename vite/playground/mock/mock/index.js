export default [
  {
    url: '/api/users',
    type: 'get',
    response(req, res) {
      return res.send([
        { username: 'tom', age: 18 },
        { username: 'ajvk', age: 20 },
      ])
    },
  },
]
