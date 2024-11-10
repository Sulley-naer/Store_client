<script setup lang="ts">
import { useMyDefaultStore } from '@/stores/counter'
const store = useMyDefaultStore()
import { Search, UserFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import router from '../../router'
import axios from 'axios'

const search = ref()

const User = store.getId

const avatar = ref('')

console.log('用户ID', User)

const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

console.log('图片地址', photoPath.value)

axios.post('/GetAvatar', { id: User }).then((res) => {
  if (res.data == 'none') {
    avatar.value = 'avatar'
  }
  avatar.value = photoPath.value.replace('UploadedFiles', 'avatar') + res.data
})
</script>

<template>
  <header>
    <div class="left">
      <span @click="router.push('/shop')"
        ><img src="/icon/shop.png" alt="" width="20px" /> 商城</span
      >
    </div>
    <template>
      <div class="mid">
        <el-input
          v-model="search"
          style="width: 30em"
          size="large"
          placeholder="您的主页"
          :prefix-icon="Search"
          @change="searcher()"
          disabled
        />
      </div>
    </template>
    <div class="right">
      <div @click="router.push('/space/' + store.getId)">
        <span id="User" style="margin-inline: 10px">{{ store.getUsername }}</span>
        <el-avatar :icon="UserFilled" v-if="avatar == 'none'" />
        <el-avatar v-else :src="avatar" />
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > * {
    display: inline-block;
  }

  > .mid {
    margin-inline: auto;
  }

  > .left {
    font-size: 18px;
    color: #d2d2d2;
  }
}
</style>
