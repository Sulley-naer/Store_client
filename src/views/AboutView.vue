<template>
  <div class="about">
    <el-button size="large" @click="checks($event)" ref="buttonRef">点我检测</el-button>
    <Component :is="kit" v-model:kit="kit"></Component>
  </div>
</template>

<style scoped>
.about {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
<script setup lang="ts">
import { useMyDefaultStore } from '@/stores/counter'
import { nextTick, ref, watch } from 'vue'
import Login from '@/views/Admin/Login.vue'
import router from '@/router'
import { ElNotification } from 'element-plus'

const store = useMyDefaultStore()

const kit = ref()

const buttonRef = ref(null)
const checks = (element: MouseEvent) => {
  const success = () => {
    ElNotification({
      title: '登录成功',
      message: '即将进入后台',
      type: 'success'
    })
    setTimeout(() => router.push({ path: '/admin' }), 1000)
  }

  const error = () => {
    ElNotification({
      title: '未登录',
      message: '即将进入登录',
      type: 'info'
    })
    setTimeout(() => (kit.value = Login), 1000)
  }

  store.getAdmin != '' ? success() : error()

  const target = element.target as HTMLElement

  target.style.visibility = 'hidden'

  nextTick(() => {
    if (buttonRef.value) {
      buttonRef.value.ref.style.display = 'none'
    }
  })
}

watch(kit, (val) => {
  kit.value = val
  console.log('视图更新')
})
</script>
