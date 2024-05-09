<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <router-link to="/"></router-link>
  <router-link to="/about/ban">打开弹窗</router-link>
  <router-view/>
  <router-view name="pop"/>
</template>
