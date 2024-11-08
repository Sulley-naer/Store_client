<script setup lang="ts">
import Head from '@/views/shop/Layout/header.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import { ShoppingCart, ShoppingCartFull, StarFilled } from '@element-plus/icons-vue'
import { ref, type Ref } from 'vue'
import Navbar from './Layout/Navbar.vue'
import Baby from './Layout/baby.vue'
import axios from 'axios'
import BabyCar from '@/views/shop/Layout/BabyCar.vue'
import { useMyDefaultStore } from '@/stores/counter'

const store = useMyDefaultStore()

//? 宣传头图
const modules = [Pagination, Autoplay]

const slides = ref([
  { image: '/Banner/b1.png' },
  { image: '/Banner/b2.png' },
  { image: '/Banner/b3.png' }
])

const goods = ref([
  {
    id: 1,
    name: '阿里巴巴',
    city: '重庆',
    time: '2024-08-27',
    dress: '重庆市巴南区',
    photo: '/baby/baby.webp',
    price: 60
  },
  {
    id: 2,
    name: '阿里巴巴',
    city: '重庆',
    time: '2024-08-27',
    dress: '重庆市巴南区',
    photo: '/baby/baby.webp',
    price: 60
  },
  {
    id: 3,
    name: '阿里巴巴',
    city: '重庆',
    time: '2024-08-27',
    dress: '重庆市巴南区',
    photo: '/baby/baby.webp',
    price: 60
  }
])

const ViewMode = ref('shop')

//?分页
const page = ref(1) //初始显示第一页
const pageChange = () => {
  console.log('当前页数:', page.value)
  GetDate()
}

let GetTotalBabyPages = ref(13) // 总页数初始为 10

const GetTotal = async () => {
  axios.post('/GetTotalBabyPages').then((res) => {
    GetTotalBabyPages.value = res.data
    console.log(`总页数：${res.data}`)
  })
}

//!搜索
const searchQuery = ref('')

const chosen = ref('')

const ActiveMenu = ref({
  Citys: '全国',
  types: '全部',
  times: '任意'
})

const handleCustomUpdate = (menu: Ref) => {
  ActiveMenu.value = menu.value
  console.log(ActiveMenu.value)
  GetDate()
}

const search = (query: string) => {
  searchQuery.value = query
  console.log(searchQuery.value)
  GetDate()
}

//?时间处理
const GetDateTime = () => {
  const now = new Date()
  let time = null

  switch (ActiveMenu.value.times) {
    case '本周':
      // 设置为本周开始时间
      time = new Date(now.setDate(now.getDate() - now.getDay() + 1)) // 本周一
      break
    case '本月':
      // 设置为本月开始时间
      time = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    default:
      time = null // 处理 '任意' 或不选择的情况
  }

  return time
}

//?获取商品
const GetDate = async () => {
  await axios
    .post('/GetBabyList', {
      id: page.value,
      city: ActiveMenu.value.Citys != '全国' ? ActiveMenu.value.Citys : null,
      type: ActiveMenu.value.types != '全部' ? ActiveMenu.value.types : null,
      time: ActiveMenu.value.times != '任意' ? GetDateTime() : null,
      name: searchQuery.value != '' ? searchQuery.value : null,
      username: store.getUsername
    })
    .then((res) => {
      console.log(res.data)
      if (res) goods.value = res.data
    })

  //重新获取总页数
  await GetTotal()
}

GetDate()
</script>

<template>
  <div ID="shop">
    <div class="common-layout" v-show="ViewMode == 'shop'">
      <el-container>
        <el-header>
          <Head
            v-model="searchQuery"
            :anotherProp="goods as any"
            @update:model-value="search"
          ></Head>
        </el-header>
        <el-main style="padding-inline: 15vw">
          <div class="banner">
            <Swiper
              :slides-per-view="1"
              :loop="true"
              :pagination="{
                clickable: true,
                dynamicBullets: true
              }"
              :autoplay="true"
              :modules="modules"
              style="max-height: 265px"
            >
              <SwiperSlide
                v-for="(slide, index) in slides"
                :key="index"
                :aria-label="index + 1 + ' / ' + slides.length"
              >
                <img :src="slide.image" :alt="`Slide ${index + 1}`" />
              </SwiperSlide>

              <!-- If we need pagination -->
              <template v-slot:pagination>
                <div class="swiper-pagination"></div>
              </template>
            </Swiper>
            <el-divider>
              <el-icon><star-filled /></el-icon>
            </el-divider>
          </div>
          <Navbar v-model="chosen" @custom-update="handleCustomUpdate"></Navbar>
          <baby v-model="goods"></baby>
        </el-main>
        <el-footer class="footer">
          <el-pagination
            background
            layout="prev, pager, next"
            @change="pageChange"
            :total="GetTotalBabyPages"
            :page-size="10"
            v-model:currentPage="page"
          />
        </el-footer>
      </el-container>
    </div>
    <BabyCar v-model="ViewMode as any" v-show="ViewMode == 'BabyCar'" />
    <div
      class="BabyCarBox"
      ref="CarBox"
      :style="ViewMode=='BabyCar'?{right:'10vw'}:null"
      @click="ViewMode = ViewMode == 'BabyCar' ? 'shop' : 'BabyCar'"
    >
      <div style="position: relative">
        <el-button style="height: 55px" size="large">
          <el-icon size="32">
            <shopping-cart v-show="store.getActives <= 0" />
            <shopping-cart-full v-show="store.getActives > 0" />
          </el-icon>
        </el-button>
        <span v-show="store.getActives > 0">{{ store.getActives }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
#shop {
  width: 100%;
  height: 100%;
  position: relative;

  .footer {
    display: flex;
    width: max-content;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
}

.banner {
  width: 100%;
  height: auto;
  max-height: 300px;
  background-position: center center;
  border-radius: 15px;
  overflow: hidden;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 100%;
    object-fit: cover;
  }
}

.BabyCarBox {
  position: fixed;
  right: 5vw;
  bottom: 3vw;
  display: flex;
  transition: all .3s;

  span {
    position: absolute;
    right: 3px;
    top: 3px;
    font-size: 13px;
    background: red;
    width: 20px;
    text-align: center;
    border-radius: 10px;
    transform: scale(0.7);
  }
}
</style>
