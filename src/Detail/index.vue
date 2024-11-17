<!-- eslint-disable vue/valid-v-for -->
<script setup lang="ts">
import { ref, onMounted, watch, onDeactivated } from 'vue'
import { useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import { FreeMode, Pagination, Scrollbar, Mousewheel, Controller } from 'swiper/modules'
import { Shop } from '@element-plus/icons-vue'
import axios from 'axios'
import { useMyDefaultStore } from '@/stores/counter'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { ElNotification } from 'element-plus'
import Router from '@/router'

const store = useMyDefaultStore()

//图床
const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

console.log('图片地址', photoPath.value)

//商品ID
const route = useRoute()
const id = route.params.id

const firstSwiper = ref(null)
const secondSwiper = ref(null)

//获取swiper实例
const setFirstSwiper = (swiper) => {
  firstSwiper.value = swiper
}
const setSecondSwiper = (swiper) => {
  secondSwiper.value = swiper
}

// 点击切换事件
const handleSlideClick = (index) => {
  if (firstSwiper.value) {
    firstSwiper.value.slideTo(index)
  }
}

//商品信息
const type = ref('')
const num = ref(1)
const price = ref(0)
const max = ref(0)
const style = ref()

watch(type, (val) => {
  type.value = val
  price.value = Data.value.res[val].price
  max.value = Data.value.res[val].total - Data.value.res[val].buy
  style.value = Data.value.res[val].type
})

//菜单相关
const toggleMenu = (index) => {
  activeMenu.value = index
}

const menuItem = [
  { key: 1, value: '商品信息' },
  { key: 2, value: '店家留言' },
  { key: 3, value: '推荐商品' }
]
const activeMenu = ref(0)

//获取数据

const Data = ref({})

const Getdate = () => {
  axios
    .post('/GetDetail', {
      id: id
    })
    .then((res) => {
      console.log(res.data)
      Data.value = res.data
      price.value = Data.value.defaultPrice
      max.value = Data.value.defaultTotal
      res.data.res.forEach((item) => {
        console.log(item)
        shows.value = shows.value.concat(item.banner)
        if (shows.value.length < 10 && item.show.length > 0) {
          console.log(item.show)
          autoBanner(item, 10 - shows.value.length)
        }
      })
    })
    .catch((err) => {
      throw new Error('获取数据失败' + err)
    })
}

//添加购物车
const sendCar = () => {
  axios
    .post('/AddBabyCar', {
      account: store.getUsername,
      item: id,
      count: num.value,
      type: style.value ?? 'default'
    })
    .then((res) => {
      store.setActives(store.getActives + 1)
      if (res.data) {
        setTimeout(() => Router.push({ path: '/shop' }), 500)
        ElNotification({
          title: 'success',
          message: '添加成功',
          type: 'success'
        })
      }
    })
    .catch(() => {
      setTimeout(() => Router.push({ path: '/shop' }), 500)
      ElNotification({
        title: 'Warning',
        message: '商品已售空',
        type: 'warning'
      })
    })
}

//递归补充宣传图
const autoBanner = (item, Times) => {
  //防止添加空内容
  if (item.show[Times] == undefined) {
    Times--
    return autoBanner(item, Times)
  }

  shows.value.push(item.show[Times])

  Times--
  if (Times < 0) {
    console.log('扩容结果：', shows.value)
    return
  } else {
    autoBanner(item, Times)
  }
}

//展示图

const shows = ref([])

onMounted(() => {
  Getdate()
})

onDeactivated(() => {
  shows.value = []
})
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main class="el-main">
        <el-scrollbar height="80vh">
          <h1 style="text-align: center; margin-bottom: 1em">
            <el-text style="font-size: 22px; font-weight: 340; max-width: 15em" truncated>
              {{ Data.title }}
            </el-text>
          </h1>

          <div style="user-select: none">
            <Swiper
              @swiper="setFirstSwiper"
              :controller="{ control: secondSwiper }"
              :scrollbar="{ hide: true }"
              :mousewheel="true"
              :modules="[Pagination, Scrollbar, FreeMode, Mousewheel, Controller]"
              class="banner"
            >
              <el-empty description="description" v-if="shows.length == 0" />
              <SwiperSlide
                v-for="(item, index) in shows"
                :key="index"
                class="swiper-slide"
                v-else
                :ID="index"
              >
                <img :src="photoPath + item" width="100%" height="475px" alt='banner' />
              </SwiperSlide>
            </Swiper>

            <Swiper
              @swiper="setSecondSwiper"
              watch-slides-progress
              :spaceBetween="10"
              :slidesPerView="4"
              :freemode="true"
              :modules="[Pagination, Scrollbar, FreeMode, Mousewheel, Controller]"
              style="margin-block: 2em"
            >
              <el-empty description="description" v-if="shows.length == 0" />
              <SwiperSlide
                v-for="(item, index) in shows"
                :key="item"
                style="height: 150px; min-height: unset"
                v-else
                @click="handleSlideClick(index)"
              >
                <img :src="photoPath + item" width="100%" alt='banner' />
              </SwiperSlide>
            </Swiper>
          </div>

          <div class="Ifm">
            <div>
              <el-card
                shadow="Hover"
                style="width: 18em"
                body-style="padding-block:0.5em;padding-inline: 0.9em;"
              >
                <el-text>价格：</el-text>
                <el-text type="danger">￥ </el-text>
                <el-text type="danger" style="font-size: 21px">{{ price * num }}</el-text>
              </el-card>
            </div>
            <div style="margin-top: 1em">
              <el-text size="large" style="margin-right: 1em">款式：</el-text>
              <el-radio-group v-model="type">
                <el-radio
                  v-for="(item, index) in Data.res"
                  size="large"
                  border
                  :key="index"
                  :value="index"
                >
                  {{ item.type }}
                </el-radio>
              </el-radio-group>
            </div>
            <el-divider border-style="dashed" />
            <div>
              <el-space>
                <el-input-number
                  v-model="num"
                  :min="1"
                  :max="max"
                  controls-position="right"
                  size="large"
                  style="width: 7.5em"
                >
                </el-input-number>
                <el-button
                  type="danger"
                  plain
                  size="large"
                  @click="sendCar()"
                  style="margin-left: 1.5em"
                  >加入购物车</el-button
                >
              </el-space>
            </div>
            <!--商品类型-->
            <div style="margin-top: 1em; margin-bottom: 3em">
              <el-text size="large" v-if="Data.attribute == 'really'"
                >温馨提示 · 支持七天无理由退货</el-text
              >
              <el-text size="large" v-else>温馨提示 · 虚拟商品不支持退换</el-text>
            </div>
            <!--菜单-->
            <el-container style="width: 80%; margin-top: 1em">
              <el-aside style="width: 20%; margin-right: 1em">
                <el-card style="max-width: 100%; background: transparent; margin-top: 1em">
                  <template #header>
                    <div class="card-header" style="display: flex; align-items: center">
                      <span>{{ Data.merchants }}</span>
                      <el-icon size="large"><Shop /></el-icon>
                    </div>
                  </template>

                  <el-text>{{ Data.message }}</el-text>

                  <el-divider border-style="dashed" />
                  <el-button>进入店铺</el-button>
                  <el-button>关注店铺</el-button>
                </el-card>
              </el-aside>
              <el-main style="width: 70%; padding: 0; position: relative">
                <el-menu
                  mode="horizontal"
                  @select="toggleMenu"
                  :default-active="0"
                  :ellipsis="false"
                >
                  <el-menu-item v-for="(item, index) in menuItem" :index="index" :key="index"
                    >{{ item.value }}
                  </el-menu-item>
                  <el-button
                    type="danger"
                    plain
                    size="default"
                    style="margin-left: auto; margin-right: 0.5em; margin-top: 1.3em"
                    @click="sendCar()"
                    >加入购物车</el-button
                  >
                </el-menu>
                <!--商品信息-->
                <el-container v-show="activeMenu == 0">
                  <el-descriptions title=" " :column="4" size="large" direction="vertical">
                    <el-descriptions-item label="品牌" span="4">{{
                      Data.brand
                    }}</el-descriptions-item>
                    <el-descriptions-item label="商品名称" min-width="150">{{
                      Data.title
                    }}</el-descriptions-item>
                    <el-descriptions-item label="商品编号" :span="2" min-width="150">{{
                      Data.key
                    }}</el-descriptions-item>
                    <el-descriptions-item label="店铺" min-width="150">
                      <el-tag size="small">{{ Data.merchants }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="地址" min-width="300">
                      {{ Data.address }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-container>
                <!--店家留言-->
                <el-container v-show="activeMenu == 1">
                  <el-descriptions title=" " :column="4" size="large" direction="vertical">
                    <el-descriptions-item label="留言" span="4">{{
                      Data.message
                    }}</el-descriptions-item>
                  </el-descriptions>
                </el-container>
                <!--推荐商品-->
                <el-container v-show="activeMenu == 2"> </el-container>
              </el-main>
            </el-container>
          </div>
        </el-scrollbar>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>

    <router-view></router-view>
  </div>
</template>

<style scoped lang="less">
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.banner {
  width: 75%;
  max-height: 550px;
  align-self: center;
}

.el-main {
  padding-inline: 5vw;
}

.swiper-slide {
  min-height: 30vh;
  max-height: 50vh;
  text-align: center;
  > * {
    margin-inline: auto;
  }
}

.Ifm {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
