<template>
  <div>
    <el-card
      style="min-width: 100%; margin-bottom: 1em"
      :key="item.ID"
      v-for="(item, index) in Data"
    >
      <template #header>
        <div class="card-header">
          <span v-if="Data.length == 1">店铺：{{ item.belong }}</span>
          <span v-else> 商场Logo </span>
          <span style="float: right">
            <el-tag v-if="item.status" type="success">已付款</el-tag>
            <el-tag
              v-if="!item.status"
              type="danger"
              @click="
                () => {
                  store.setOrder(item)
                  router.push('/pay')
                }
              "
              >前往付款</el-tag
            >
          </span>
        </div>
      </template>

      <template #default>
        <el-card v-for="(item, k) in ProductList[index].id" :key="index" style="margin-top: 1em">
          <el-container>
            <el-aside width="200px" style="display: flex; justify-content: space-around">
              <img
                style="margin-inline: auto"
                height="200px"
                :src="getBabyById(item)?.photo"
                :alt="getBabyById(item)?.name"
            /></el-aside>
            <el-main style="position: relative">
              <p style="margin-bottom: 1em">商品名称：{{ getBabyById(item)?.name }}</p>
              <p style="margin-bottom: 1em">商品城市：{{ getBabyById(item)?.city }}</p>
              <p style="margin-bottom: 1em">商品店铺：{{ getBabyById(item)?.belongs }}</p>
              <br />
              <p>
                商品数量：<el-tag>{{ ProductList[index].quantity[k] }}</el-tag>
              </p>
              <div style="position: absolute; top: 0; right: 2%">
                <el-button type="primary" @click="router.push('/Detail/' + getBabyById(item)?.id)"
                  >查看详情</el-button
                >
              </div>
            </el-main>
          </el-container>
        </el-card>
      </template>

      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="margin-right: 1px">
            订单号：
            {{ item.orderNumber }}
          </span>
          <span style="float: right">
            订单时间：
            {{ item.time.toString().split('T')[0] }}
            {{ item.time.toString().split('T')[1].split('.')[0] }}
          </span>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import { useMyDefaultStore } from '../../stores/counter'
import axios from 'axios'
import router from '../../router'

const store = useMyDefaultStore()

const page = defineModel('page')
const total = defineModel('total')

interface Order {
  ID: number
  orderNumber: string
  belong: string
  baby: string
  time: string
  status: boolean
  logistics: string
}

const Data = ref([]) as any as Ref<Order[]>

interface Product {
  id: number[]
  quantity: number[]
  style: string[]
}

const ProductList = ref<Product[]>([]) // 确保这里定义为 Product[]

//获取订单数据
const GetData = () => {
  axios
    .post('/GetOrderHistory', {
      username: store.getUsername,
      page: page.value
    })
    .then((res) => {
      Data.value = res.data.data
      total.value = res.data.total
      Data.value.forEach((item) => {
        babyRegex(item.baby, ProductList.value)
      })
      console.log('Data:', Data.value)
      console.log('ProductList:', ProductList.value)
      GetBabys()
    })
}

const IdList = ref<number[]>([])

//正则提取商品集合
const babyRegex = (item: string, list: Product[]) => {
  // console.log(item)

  const regex = /(\d+)\+(\d+):([^\s;]+)/g
  const result = []
  let match

  // 循环匹配所有组
  while ((match = regex.exec(item)) !== null) {
    result.push({
      id: match[1], // 商品ID
      quantity: match[2], // 数量
      style: match[3] // 款式
    })
  }
  //TODO: 这里正则匹配的时候多循环了，性能浪费后续优化
  const res = {
    id: result.map((product) => product.id),
    quantity: result.map((product) => product.quantity),
    style: result.map((product) => product.style)
  }

  IdList.value = IdList.value.concat(res.id)

  list.push(res)

  console.log('----------------------------')
}

//获取商品集合

interface BabyObj {
  id: number
  active: number
  address: string
  alreadyBuy: number
  attribut: ['really', 'virtual']
  belongs: string
  brand: string
  city: ['北京', '上海', '广州', '深圳']
  message: string
  name: string
  photo: string
  price: number
  selectedStyle: string
  time: Date
  total: number
  type: string
}

const Babys = ref<BabyObj[]>([])

const GetBabys = () => {
  const list = new Set(IdList.value)
  axios
    .post('/OrderBabyList', {
      babys: [...list]
    })
    .then((res) => {
      console.log('Babys: ', res.data)
      Babys.value = res.data
    })
}

//解决通过行内Js拿取Baby值，Vue抛精度异常问题
function getBabyById(id) {
  return this.Babys.find((baby) => baby.id == id)
}

onMounted(() => {
  GetData()
})
</script>

<style></style>
