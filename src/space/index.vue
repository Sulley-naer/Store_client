<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import Header from '@/space/layout/header.vue'
import Aside from '@/space/layout/aside.vue'
import Form from '@/space/layout/form.vue'
import PersonOrder from '@/space/layout/PersonOrder.vue'

const route = useRoute()
const id = route.params.id

onMounted(() => {})
</script>

<template>
  <div style="width: 100%; height: 100%">
    <el-container style="display: flex; justify-content: space-between; align-items: center">
      <el-header style="width: 80vw"><Header></Header></el-header>
      <el-container style="width: 80vw">
        <el-aside style="width: 300px">
          <Aside />
        </el-aside>
        <el-main>
          <el-scrollbar height="80vh">
            <Form />
            <PersonOrder />
          </el-scrollbar>
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped></style>
