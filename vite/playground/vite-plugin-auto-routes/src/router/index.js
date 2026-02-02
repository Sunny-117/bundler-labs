import { createRouter, createWebHistory } from 'vue-router'

// 动态导入所有页面组件
const modules = import.meta.glob('../views/**/**/*.vue', { eager: false })
// 动态导入所有元数据文件
const metaModules = import.meta.glob('../views/**/**/*.meta.js', {
  eager: true,
})

console.log(modules, 'modules')

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

  routePath = `/${parts.join('/').toLowerCase()}`

  // 导入元数据文件
  const metaFilePath = filePath.replace('.vue', '.meta.js')
  const meta = metaModules[metaFilePath]
    ? metaModules[metaFilePath].default
    : {}

  return {
    path: routePath,
    component: modules[filePath],
    ...meta,
  }
})

console.log(routes)

// 确保有一个根路径（'/'）的路由，如果没有，则添加默认的根路径路由
if (!routes.some((route) => route.path === '/')) {
  routes.push({
    path: '/',
    component: modules['../views/Home/Home.vue'], // 设置默认首页组件
    title: 'Home', // 设置默认首页标题
    requiresAuth: false, // 默认首页不需要认证
  })
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
