<template>
  <div class="hello">
    <h1>{{msg}}</h1>
  </div>
  <hr>
  <router-link to="/about/ban">打开弹窗</router-link>
  <router-view/>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
  }
}
</script>
