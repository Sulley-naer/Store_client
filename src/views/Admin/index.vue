<script setup lang="ts">
import Aside from '@/views/Admin/Layout/aside.vue'
import MyView from '@/views/Admin/Layout/view.vue'
import { ref, watch } from 'vue'

const activeMenu = ref()

watch(activeMenu, (val) => {
  activeMenu.value = val
})
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100%">
      <el-header>Header</el-header>
      <el-container style="display: flex; flex-direction: row">
        <el-aside width="10%">
          <Aside v-model:active="activeMenu"></Aside>
        </el-aside>
        <el-main>
          <MyView v-model:active="activeMenu"></MyView>
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  width: 100%;
  height: 100%;
}
</style>
