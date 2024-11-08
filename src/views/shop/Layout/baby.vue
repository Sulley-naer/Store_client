<script setup lang="ts">
import { defineProps, nextTick, onMounted, ref, watch } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
import axios from 'axios'
import { useMyDefaultStore } from '@/stores/counter'
import { ElNotification } from 'element-plus'
import router from '@/router'
const store = useMyDefaultStore()

let data = ref()
const allLoad = ref(false)

onMounted(() => {
  nextTick(() => {
    allLoad.value = false
  })
})

interface Data {
  id: string
  name: string
  city: string
  time: string
  address: string
  photo: string
  price: number
}

const props = defineProps<{ modelValue: any }>()

data.value = props.modelValue

watch(
  () => props.modelValue,
  (newValue) => {
    data.value = newValue
  },
  { immediate: true }
)

//废弃快速添加商品
const sendCar = (id: string, total: number) => {
  axios
    .post('/AddBabyCar', {
      account: store.getUsername,
      item: id,
      count: total
    })
    .then((res) => {
      store.setActives(store.getActives + 1)
      console.log(res.data)
    })
    .catch(() => {
      ElNotification({
        title: 'Warning',
        message: '已达最大购买数',
        type: 'warning'
      })
    })
}

//废弃快速添加商品
const RemoveCar = (id: string, total: number) => {
  total < 2
    ? axios
        .post('/DelBabyCar', {
          account: store.getUsername,
          item: id
        })
        .then((res) => {
          store.setActives(store.getActives - 1)
          console.log(res.data)
        })
    : store.setActives(store.getActives - 1)
}

//获取图床
const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

console.log('图片地址', photoPath.value)
</script>

<template>
  <main>
    <el-card
      style="max-width: 480px"
      shadow="hover"
      class="card"
      v-for="item in data"
      :key="item.id"
      @click="router.push('/Detail/' + item.id)"
    >
      <div class="common-layout">
        <el-container>
          <el-aside width="40%" style="max-height: 20rem; overflow: hidden !important">
            <img
              :src="photoPath + item.photo"
              width="100%"
              style="border-radius: 4px"
              alt="banner"
            />
          </el-aside>
          <el-container
            :style="{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }"
          >
            <el-header style="height: 3em"
              ><h3>{{ item.city }} · {{ item.name }}</h3></el-header
            >
            <el-main
              style="
                flex-direction: column;
                align-items: baseline;
                color: #757a81;
                vertical-align: center;
              "
              ><div>
                <img src="/icon/date.png" height="15px" style="margin-right: 0.2em" />
                {{ item.time.toString().slice(0, 10) }}
              </div>
              <div>
                <img src="/icon/pointer.png" height="15px" style="margin-right: 0.2em" />
                {{ item.address }} …
              </div>
            </el-main>
            <el-footer>
              <div style="position: relative">
                <span style="color: #eb4225; margin-right: 0.5em; font-size: large">$</span>
                <span style="color: #e92d4e; font-size: 24px; margin-right: 0.5em">{{
                  item.price
                }}</span>
                <span style="font-size: small; color: #757a81">起</span>
                <!--      ?废弃快速添加商品          -->
                <!--                <span id="add">-->
                <!--                  <el-button-->
                <!--                    :icon="Plus"-->
                <!--                    circle-->
                <!--                    :loading="allLoad"-->
                <!--                    @click="item.active++, sendCar(item.id, item.active)"-->
                <!--                  />-->
                <!--                </span>-->
                <!--                <span id="add" style="right: 20px">-->
                <!--                  <el-button-->
                <!--                    :icon="Minus"-->
                <!--                    circle-->
                <!--                    :loading="allLoad"-->
                <!--                    @click="item.active&#45;&#45;, RemoveCar(item.id, item.active)"-->
                <!--                    v-show="item.active > 0"-->
                <!--                  />-->
                <!--                </span>-->
              </div>
            </el-footer>
          </el-container>
        </el-container>
      </div>
      <el-button v-text="item.active" type="primary" circle v-show="item.active > 0" id="Badge" />
    </el-card>
  </main>
</template>

<style scoped>
*::-webkit-scrollbar {
  display: none;
}

main {
  width: 100%;
  height: max-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  > .card {
    margin-top: 1em;
    width: calc(calc(100% / 3) - 15px);
    margin-inline: 5px;
    position: relative;
  }

  #Badge {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 6px;
    height: 6px;
    font-size: 9px;
    vertical-align: middle;
  }
}

#add {
  position: absolute;
  right: -20px;
  top: 55%;
  transform: translateY(-40%);
}
</style>
