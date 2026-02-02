<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">主页</router-link></li>
        <li><router-link to="/about">关于</router-link></li>
        <li><router-link to="/user">用户首页</router-link></li>
        <li><router-link to="/user/profile">用户资料</router-link></li>
        <li><router-link to="/contact">联系方式</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 添加一些基本样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  text-align: center;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav li {
  display: inline;
  margin: 0 10px;
}

nav a {
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-active {
  font-weight: bold;
}
</style>
