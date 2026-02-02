module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      require('../../packages/babel-plugin-await-add-trycatch/src/index.js'),
      {
        // exclude: ['build'], // default value ['node_modules']
        // include: ['main.js'], // default value []
        // customLog: 'My customLog' // default value 'Error'
      }
    ]
  ]
};
