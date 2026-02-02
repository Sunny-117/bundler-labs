## 什么问题

平时在进行开发的时候，经常会发现**页面级组件（views or pages）**的层次结构和**路由的配置**基本上是一致的。

例如我们现在有这样的目录结构：

```
  ├── src
  │   ├── router
  │   │   └── index.js
  │   ├── views
  │   │   ├── Home.vue
  │   │   ├── About.vue
  │   │   └── User
  │   │       ├── Index.vue
  │   │       └── Profile.vue
  │   └── main.js
  └── vite.config.js
```

对应的路由结构大致如下：

```js
import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
const Home = () => import('../views/Home.vue')
const About = () => import('../views/About.vue')
const UserIndex = () => import('../views/User/Index.vue')
const UserProfile = () => import('../views/User/Profile.vue')

// 配置路由
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About, name: 'About', auth: false },
  { path: '/user', component: UserIndex },
  { path: '/user/profile', component: UserProfile }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

这是一个很**繁琐**但是又不得不做的一件事情，每次新增了页面级组件，就得去修改对应的路由配置。

其实这里可以采用一种“**约定大于配置**”的方式，自动生成路由。

>约定大于配置（Convention over Configuration）
>
>这是一种软件设计原则，旨在通过遵循约定和标准化来减少开发者需要编写的配置代码。这种方法提倡使用默认的行为和规则，以简化开发过程，使得开发人员能够专注于业务逻辑而不是配置细节。

常见的框架：

- Nuxt.js
- Next.js
- Umi.js
- ....

普通 Vite 搭建的项目并没有这个功能，这正是我们要解决的问题。

## 解决思路

1. 读取页面组件目录
2. 根据读取到的信息生成路由的数组
3. 在路由实例中使用自动生成的数组
当然这里面还有很多需要考虑的细节，例如读取目录用什么方式去读，路由额外的元数据信息如何配置等。整个自动生成路由的功能书写好了后，后期新增页面组件，就再也不用去修改路由配置文件了，这其实也从侧面遵循了设计原则中的开闭原则。
整个项目结束后，自动生成路由这一块儿的代码工作稳定，封装成 Vite 插件，这样方便后面在其他项目里面复用。

读取目录的话首先会想到使用 node.js 里面的 fs 模块来完成，但是使用 fs 模块读取文件会存在这么一些问题：
1. 不支持热模块替换功能
2. 需要手动实现按需导入和懒加载功能
3. 无法直接利用前端构建工具提供的优化功能，如代码分割和懒加载

不同的构建工具，专门提供了读取文件和目录的方法的，例如：
1. webpack 的 require.context
● 可以动态加载指定目录下的所有模块
● 支持模块热替换
2. Vite 下则是使用 import.meta.glob
● 动态导入指定目录下的所有文件
● 支持代码分割和懒加载
● 与 Vite 的 HMR 功能无缝集成
（常见的和构建工具配套的读取方案）
所以读取目录这一块儿我选择了使用 import.meta.glob，通过这个方法读取到路由信息后，对路由信息做二次处理，生成路由配置的数组方便后面使用

**1. 使用 import.meta.glob 读取文件**

首先**使用 import.meta.glob 读取 views 目录下所有的 .vue 文件**，这些文件将被用作路由组件。

使用 import.meta.glob 不使用 fs 的原因？

1. import.meta.glob 是 Vite 提供的内置功能，专门用于在前端项目中动态导入模块。它可以在开发时和构建时都正常工作，并且与 Vite 的热模块替换（HMR）功能无缝集成。fs 读取文件需要编写更多的代码来处理文件路径和模块导入，并且需要手动实现热更新等功能。
2. import.meta.glob 可以直接生成按需导入的模块映射表，支持代码分割和懒加载，从而优化前端性能。而使用 fs 读取文件后，还需要额外的逻辑来实现按需导入和懒加载。

**2. 生成路由配置**

对路由信息做**二次处理**

1. 生成对应的路由配置对象
2. 将配置对象组成路由数组

**3. 创建 Vite 插件**

**4. 发布插件**

## 解决细节

### 1. 读取文件

import.meta.glob. 这是 Vite 提供的一个功能，用于批量导入指定目录中的文件。它可以根据指定的模式动态生成导入的模块映射表。这个功能在处理静态资源和文件系统操作时非常有用，尤其是在构建自动化流程（如自动生成路由）时。

使用 import.meta.glob 来导入所有 .vue 文件：

```js
const modules = import.meta.glob('../views/**/*.vue');

console.log(modules);
// 输出如下对象
// {
//   '../views/Home.vue': () => import('../views/Home.vue'),
//   '../views/About.vue': () => import('../views/About.vue'),
//   '../views/User/Index.vue': () => import('../views/User/Index.vue'),
//   '../views/User/Profile.vue': () => import('../views/User/Profile.vue')
// }
```

**每个文件路径对应一个函数，该函数返回一个 Promise**，当调用该函数时，会动态导入相应的模块。

支持的参数：

- eager：默认情况下，import.meta.glob 返回的值是一个函数，需要手动调用以触发模块加载。如果设置 eager: true，则模块会在生成映射表时立即加载。

```js
const modules = import.meta.glob('../views/**/*.vue', { eager: true });

console.log(modules);
// 输出如下对象
// {
//   '../views/Home.vue': Module { ... },
//   '../views/About.vue': Module { ... },
//   '../views/User/Index.vue': Module { ... },
//   '../views/User/Profile.vue': Module { ... }
// }
```

- import：可以指定导入模块的特定命名导出。**默认情况下，导入整个模块对象**。如果只需要模块的特定部分，可以使用 import 选项。

```js
const modules = import.meta.glob('../views/**/*.vue', { import: 'default' });

console.log(modules);
// 输出如下对象，导入模块的特定部分，这里是导入模块的 default 部分
// {
//   '../views/Home.vue': () => import('../views/Home.vue').then(mod => mod.default),
//   '../views/About.vue': () => import('../views/About.vue').then(mod => mod.default),
//   '../views/User/Index.vue': () => import('../views/User/Index.vue').then(mod => mod.default),
//   '../views/User/Profile.vue': () => import('../views/User/Profile.vue').then(mod => mod.default)
// }
```



### 2. 生成路由配置

对读取到的内容进行一些二次处理。

要拿到路径信息，路径对应的组件，组装成对象，最终在形成数组。

```js
import { createRouter, createWebHistory } from 'vue-router'

// 动态导入所有页面组件
const modules = import.meta.glob('../views/**/*.vue', { eager: false })

// 生成路由配置
const routes = Object.keys(modules).map((path) => {
  // 生成路由路径
  const routePath = path
    .replace('../views', '')
    .replace(/\.vue$/, '')
    .toLowerCase()
    .replace(/\/index$/, '') // 移除文件名中的 index
    .replaceAll('/_', '/:') // 将文件名中的下划线转换为动态路由参数

  return {
    path: routePath || '/',
    component: modules[path]
  }
})

// 添加默认根路径路由
if (!routes.some(route => route.path === '/')) {
  routes.push({
    path: '/',
    component: modules['../views/Home.vue'] // 设置默认首页组件
  })
}

console.log(routes, '生成的路由配置')

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

如何增加额外的元数据信息？因为根据路径读取出来的信息，只能提取出来路径以及组件

为每一个页面组件配套一个 XXX.meta.js 文件。

整个目录结构如下：

```
/vue-project
  ├── src
  │   ├── router
  │   │   └── index.js
  │   ├── views
  │   │   ├── About
  │   │   │   ├── About.meta.js
  │   │   │   └── About.vue
  │   │   ├── Home
  │   │   │   ├── Home.meta.js
  │   │   │   └── Home.vue
  │   │   └── User
  │   │       ├── Index
  │   │       │   ├── Index.meta.js
  │   │       │   └── Index.vue
  │   │       ├── Profile
  │   │       │   ├── Profile.meta.js
  │   │       │   └── Profile.vue
  │   └── main.js
  └── vite.config.js
```

读取内容做二次处理时也需要一些修改：

```js
import { createRouter, createWebHistory } from 'vue-router'

// 动态导入所有页面组件
const modules = import.meta.glob('../views/**/**/*.vue', { eager: false })
// 动态导入所有元数据文件
const metaModules = import.meta.glob('../views/**/**/*.meta.js', { eager: true })

// 生成路由配置
const routes = Object.keys(modules).map((filePath) => {
  // 生成路由路径
  let routePath = filePath
    .replace('../views', '')
    .replace(/\.vue$/, '')
    .replaceAll('/_', '/:') // 将文件名中的下划线转换为动态路由参数
  // 拆分路径并处理 index 文件名
  const parts = routePath.split('/').filter(Boolean)
  // 移除重复的目录名和文件名
  if (parts.length > 1 && parts.at(-1) === parts.at(-2)) {
    parts.pop()
  }

  if (parts.length > 1 && parts.at(-1).toLowerCase() === 'index') {
    parts.pop()
  }

  routePath = `/${  parts.join('/').toLowerCase()}`

  // 导入元数据文件
  const metaFilePath = filePath.replace('.vue', '.meta.js')
  const meta = metaModules[metaFilePath] ? metaModules[metaFilePath].default : {}

  return {
    path: routePath,
    component: modules[filePath],
    ...meta
  }
})

// 确保有一个根路径（'/'）的路由，如果没有，则添加默认的根路径路由
if (!routes.some((route) => route.path === '/')) {
  routes.push({
    path: '/',
    component: modules['../views/Home/Home.vue'], // 设置默认首页组件
    title: 'Home', // 设置默认首页标题
    requiresAuth: false // 默认首页不需要认证
  })
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 3. 创建 Vite 插件

**1. 创建新的插件项目**

初始化项目

```bash
mkdir vite-plugin-auto-routes
cd vite-plugin-auto-routes
npm init -y
npm install vite
```

项目的目录结构如下：

```
/vite-plugin-auto-routes
  ├── src
  │   └── index.js
  ├── package.json
  └── README.md
```

**2. 迁移自动生成路由的逻辑**

```js
// src/index.js
const fs = require("node:fs");
const path = require("node:path");

// 生成路由数组的方法
function generateRoutes(dir, basePath) {
  const files = fs.readdirSync(dir);
  return files.flatMap((file) => {
    const fullPath = path.resolve(dir, file);
    const relativePath = path.relative(basePath, fullPath);
    if (fs.statSync(fullPath).isDirectory()) {
      return generateRoutes(fullPath, basePath);
    }
    if (file.endsWith(".vue")) {
      const routePath = relativePath
        .replaceAll('\\', "/")
        .replace(/\.vue$/, "")
        .replace(/\/index$/, "")
        .replaceAll('/_', "/:");

      const parts = routePath.split("/").filter(Boolean);
      if (
        parts.length > 1 &&
        parts.at(-1) === parts.at(-2)
      ) {
        parts.pop();
      }
      const finalPath = `/${  parts.join("/").toLowerCase()}`;

      const metaFilePath = fullPath.replace(".vue", ".meta.js");
      const meta = fs.existsSync(metaFilePath) ? require(metaFilePath) : {};

      return [
        {
          path: finalPath,
          component: fullPath,
          ...meta,
        },
      ];
    }
    return [];
  });
}

module.exports = function VitePluginAutoRoutes(options = {}) {
  const { pagesDir = "src/views", routesFile = "src/router/autoRoutes.js" } =
    options;
  return {
    name: "vite-plugin-auto-routes",
    configResolved(config) {
      const pagesPath = path.resolve(config.root, pagesDir);
      // 生成路由数组
      const routes = generateRoutes(pagesPath, pagesPath);

      const routesFileContent = `
        export const routes = ${JSON.stringify(routes, null, 2)};
      `;

      fs.writeFileSync(
        path.resolve(config.root, routesFile),
        routesFileContent
      );
    },
  };
};
```

**3. 打包和压缩**

选择使用 rollup 来进行打包和压缩。

安装依赖：

```bash
npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-json @rollup/plugin-terser
```

项目根目录下创建 rollup.config.js 文件：

主要需要配置打包时，要输出的不同格式

```javascript
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from '@rollup/plugin-terser';

export default {
  input: 'src/index.js', // 输入文件路径
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs', // CommonJS 规范
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'es', // ES Module 规范
      sourcemap: true
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    terser() // 压缩代码
  ]
};
```

**4. 更新package.json文件**

更新入口文件

```json
{
  "name": "vite-plugin-auto-routes",
  "version": "1.0.0",
  "description": "A Vite plugin to auto-generate route configurations based on directory structure.",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "scripts": {
    "build": "rollup -c"
  },
  "keywords": [
    "vite",
    "plugin",
    "routes",
    "auto",
    "vue-router"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@rollup/plugin-commonjs": "^20.0.0",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-node-resolve": "^13.0.0",
    "@rollup/plugin-terser": "^7.0.0",
    "rollup": "^2.50.0",
    "vite": "^2.0.0"
  }
}
```



### 4. 测试插件

在 vite.config.js 中引入这个插件：

```js
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import VitePluginAutoRoutes from 'vite-plugin-auto-routes';

export default defineConfig({
  plugins: [vue(), VitePluginAutoRoutes({
    pagesDir: 'src/views',
    routesFile: 'src/router/autoRoutes.js'
  })]
});
```

然后在 src/router/index.js 文件中使用插件自动生成的路由配置：

```js
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './autoRoutes';

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```



### 5. 发布 Vite 插件

整体的项目目录如下：

```
/vite-plugin-auto-routes
  ├── dist
  │   ├── index.cjs.js
  │   ├── index.cjs.js.map
  │   ├── index.esm.js
  │   ├── index.esm.js.map
  ├── src
  │   └── index.js
  ├── package.json
  ├── README.md
  ├── rollup.config.js
  ├── node_modules
  └── package-lock.json
```

需要发布的：

1. 打包后的 dist 目录
2. 必要的配置文件（package.json）

配置发布内容的两种方式：

1. 白名单：顾名思义只有白名单里面的内容才会被发布到 npm 上面

在 package.json 文件中配置 files 字段，如下所示：

```json
{
  "name": "vite-plugin-auto-routes",
  "version": "1.0.0",
  "description": "A Vite plugin to auto-generate route configurations based on directory structure.",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "scripts": {
    "build": "rollup -c"
  },
  "keywords": [
    "vite",
    "plugin",
    "routes",
    "auto",
    "vue-router"
  ],
  "author": "Your Name",
  "license": "MIT",
  "files": [
    "dist",
    "README.md"
  ],
  "devDependencies": {
    "@rollup/plugin-commonjs": "^20.0.0",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-node-resolve": "^13.0.0",
    "@rollup/plugin-terser": "^7.0.0",
    "rollup": "^2.50.0",
    "vite": "^2.0.0"
  }
}
```

只有 files 字段对应的目录和文件才会被上传至 npm

2. 黑名单

在项目根目录下创建一个 .npmignore 文件，用于**排除**不需要的文件和目录：

```
/src
/rollup.config.js
/node_modules
/package-lock.json
/.git
/.github
/tests
/examples
```
