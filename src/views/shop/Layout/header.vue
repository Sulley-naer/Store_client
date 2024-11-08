<script setup lang="ts">
import { Search, UserFilled } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useMyDefaultStore } from '@/stores/counter'
import router from '@/router'
import axios from 'axios'

const store = useMyDefaultStore()

const props = defineProps<{
  modelValue: string
  anotherProp: string
}>()

const emit = defineEmits(['update:modelValue'])
const search = ref(props.modelValue)
const Main = ref(props.anotherProp)

watch(
  () => props.anotherProp,
  (newVal) => {
    Main.value = newVal
  }
)

const searcher = () => {
  emit('update:modelValue', search.value)
}

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
  <div>
    <header>
      <div class="left">
        <span @click="router.push('/')"><img src="/icon/shop.png" alt="" width="20px" /> 商城</span>
      </div>
      <template>
        <div class="mid">
          <el-input
            v-model="search"
            style="width: 30em"
            size="large"
            placeholder="商品名称搜索 ^_^"
            :prefix-icon="Search"
            @change="searcher()"
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
  </div>
</template>

<style scoped lang="less">
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
