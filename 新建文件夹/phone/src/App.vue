<template>
    <nav>
      <router-link to="/">登录</router-link> |
      <router-link to="/about">后台</router-link>
    </nav>
    <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}

body{
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
}
</style>
