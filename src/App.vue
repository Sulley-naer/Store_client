<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { computed } from 'vue'
import router from '@/router'

let path = computed(() => router.currentRoute.value.path)
</script>

<template>
  <header v-show="path == '/' || path == '/about'">
    <div class="wrapper">
      <HelloWorld msg="xx商场欢迎您" />
    </div>
  </header>
  <nav v-show="path == '/' || path == '/about'">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <router-view v-slot="{ Component, route }">
    <transition name="fade">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style scoped lang='less'>
header {
  line-height: 1.5;
  max-height: 100vh;
  position: fixed;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  position: fixed;
  top: 0;
  left: 50%;
  width: max-content;
  transform: translateX(-50%);
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  .fade-enter-active,
  .fade-leave-active {
    //transition: opacity 0.5s;
    /* TODO 组件加载过度动画 */
    width: auto;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
