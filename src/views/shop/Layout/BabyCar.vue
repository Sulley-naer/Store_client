<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Delete, Search, ShoppingBag } from '@element-plus/icons-vue'
import axios from 'axios'
import { useMyDefaultStore } from '@/stores/counter'
import { ElNotification } from 'element-plus'
import Router from '@/router'
import router from '@/router'

const store = useMyDefaultStore()
//获取当前视图
let data = defineModel()
//视图变化重新获取数据
watch(data, (val) => {
  console.log(val)
  val == 'BabyCar' ? GetData() : void 0
})

let UserCar = ref()
//请求数据
const GetData = () => {
  axios
    .post('/GetUserCar', {
      account: store.getUsername
    })
    .then((res) => {
      console.log('购物车数据\n', res.data)
      UserCar.value = res.data
      beforData.value = res.data
      store.setActives(res.data.length)
    })
}
//?添加商品废弃 api
const sendCar = (id: string, total: number) => {
  if(total>0){
    axios
    .post('/AddBabyCar', {
      account: store.getUsername,
      item: id,
      count: total
    })
    .then((res) => {
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
  else{
    RemoveCar(id, total)
  }
}
//删除商品
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

onMounted(() => GetData())

const search = ref('')

const beforData = ref(null)
//本地搜索功能
const onChangeSearch = () => {
  beforData.value.forEach((element) => {
    element.name.includes(search.value) ? (element.show = true) : (element.show = false)
    element.show
      ? true
      : element.city.includes(search.value)
        ? (element.show = true)
        : (element.show = false)
    element.show
      ? true
      : element.type.toString().includes(search.value)
        ? (element.show = true)
        : (element.show = false)
    element.show
      ? true
      : element.price.toString().includes(search.value)
        ? (element.show = true)
        : (element.show = false)
    element.show
      ? true
      : element.address.toString().includes(search.value)
        ? (element.show = true)
        : (element.show = false)
    element.show
      ? true
      : element.time.toString().slice(0, 10).includes(search.value)
        ? (element.show = true)
        : (element.show = false)
  })
}

//图床
const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

//下单
const placeAnOrder = () => {
  const baby = ref('')

  UserCar.value.forEach((element: any) => {
    let res = `${element.id}+${element.active}:${element.selectedStyle};`
    baby.value += res
  })

  console.log(baby.value)

  axios
    .post('/addOrder', {
      belong: store.getUsername,
      baby: baby.value
    })
    .then((res) => {
      if (res.data!=null) {
        ElNotification({
          title: 'success',
          message: '订单生成',
          type: 'success'
        })
        store.setOrder(ref(res.data));
        Router.push({name:'pay'})
      } else {
        ElNotification({
          title: 'error',
          message: '请再一分钟后尝试',
          type: 'error'
        })
      }
    })
}
</script>

<template>
  <div class="common-layout flex" id="BabyCar">
    <el-container class="container flex">
      <el-header style="margin-top: 2em; height: max-content">
        <h1 style="text-align: center">个人订单</h1>
        <br />
        <el-input
          v-model="search"
          style="width: 460px; height: 45px"
          placeholder="搜索您的订单 ……"
          :suffix-icon="Search"
          size="large"
          @change="onChangeSearch"
        />
      </el-header>
      <el-scrollbar>
        <el-main>
          <el-card
            style="max-width: 480px;min-width: 25vw;z-index: 5"
            shadow="hover"
            class="card"
            v-for="item in UserCar"
            :key="item.id"
            v-show="item.show == null ? true : item.show"
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
                <el-container :style="{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }" >
                  <el-header @click.stop style="height: 3em"
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
                  <el-footer @click.stop>
                    <div style="position: relative">
                      <span style="color: #eb4225; margin-right: 0.5em; font-size: large">$</span>
                      <span style="color: #e92d4e; font-size: 24px; margin-right: 0.5em">{{
                        item.price
                      }}</span>
                      <span style="font-size: small; color: #757a81">起</span>
                      <span id="add">
                        <el-button
                          type="danger"
                          :icon="Delete"
                          circle
                          @click.stop="item.active=0, RemoveCar(item.id, item.active)"
                          v-show="item.active > 0"
                        />
                      </span>
                      <span id="add" style="right: unset;left: 6em">
                        <el-tag type="info" v-if='item.selectedStyle=="default"'>{{item.selectedStyle=="default"?"默认":item.selectedStyle}}</el-tag>
                        <el-tag type="success" v-else >{{item.selectedStyle}}</el-tag>
                      </span>
                    </div>
                  </el-footer>
                </el-container>
              </el-container>
            </div>
            <el-button
              v-text="item.active"
              type="primary"
              circle
              v-show="item.active > 0"
              id="Badge"
            />
          </el-card>
        </el-main>
      </el-scrollbar>
      <el-footer>
        <el-button id="buy" size="large" type="warning" @click="placeAnOrder()">
          <el-icon size="30"><ShoppingBag /></el-icon>
        </el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
#BabyCar {
  width: 100%;
  height: 100%;
  position: relative;

  .container {
    height: 100%;
    width: 80%;
    flex-direction: column;
  }
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
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

#buy {
  position: fixed;
  right: 5vw;
  bottom: 5.5vh;
  height: 55px;
}
</style>
