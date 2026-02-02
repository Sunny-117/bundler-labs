## babel-plugin-await-add-trycatch

Babel plugin helps automatically add try catch when async await

### Install

```shell
npm install --save-dev todo
```

### Usage

babel.config.js

```javascript
module.exports = {
  plugins: [
    [
      require('babel-plugin-await-add-trycatch'),
      {
        exclude: ['build'], // default value ['node_modules']
        include: ['main.js'], // default value []
        customLog: 'My customLog' // default value 'Error'
      }
    ]
  ]
};
```

### demo

#### Oirgin code:

```javascript
async function fn() {
  await new Promise((resolve, reject) => reject('报错'));
  await new Promise((resolve) => resolve(1));
  console.log('do something...');
}
fn();
```

#### After:

```javascript
async function fn() {
  try {
    await new Promise((resolve, reject) => reject('报错'));
    await new Promise((resolve) => resolve(1));
    console.log('do something...');
  } catch (e) {
    console.log('\nfilePath: E:\\myapp\\src\\main.js\nfuncName: fn\nError:', e);
  }
}
fn();
```