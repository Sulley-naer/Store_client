<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useMyDefaultStore } from '@/stores/counter'
import Router from '@/router'

const store = useMyDefaultStore()

let state = ref(false)
let dialogVisible = ref(false)

function verify() {
  cookieStore
    .get('name')
    .then((cookie) => {
      console.log('Cookie value:', cookie.value)
      state = true
    })
    .catch((err) => {
      console.error('Failed to get cookie:', err)
      state = false
    })
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

onMounted(() => {
  //验证
  verify()
})
</script>

<template>
  <main style="display: flex; justify-content: center; flex-direction: column; align-items: center">
    <h1>主页</h1>
    <el-button plain @click="dialogVisible = true" style="width: max-content; margin-top: 15px">
      点击检测
    </el-button>
  </main>
  <el-dialog v-model="dialogVisible" title="Tips" width="500" :before-close="handleClose">
    <span v-if="state">验证通过</span>
    <span v-else-if="!state">验证失败</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          ><span @click="Router.push({ name: 'login' })" v-if="!state">登录</span
          ><span v-if="state" @click="Router.push({ name: 'shop' })">进入网站</span>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
h1 {
  width: max-content;
  margin: auto;
}
</style>
