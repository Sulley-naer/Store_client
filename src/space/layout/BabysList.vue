<!-- eslint-disable vue/no-v-text-v-html-on-component -->
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
            <el-tag v-if="item.refund === `待处理`" type="info"> 退款中 </el-tag>
            <el-tag
              v-else-if="item.handling_number == 2 || item.handling_number == 4"
              type="warning"
              >退款: {{ item.refund }}
            </el-tag>
            <el-tag v-else-if="item.status" type="warning">待发货</el-tag>
            <el-tag
              v-else-if="!item.status"
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
        <el-collapse accordion>
          <el-collapse-item :name="item.ID">
            <template #title>
              订单号：
              {{ item.orderNumber }}
            </template>
            <el-card
              v-for="(baby, k) in ProductList[index].id"
              :key="index"
              style="margin-top: 1em"
            >
              <el-container>
                <el-aside width="200px" style="display: flex; justify-content: space-around">
                  <img
                    style="margin-inline: auto"
                    height="200px"
                    :src="getBabyById(baby)?.photo"
                    :alt="getBabyById(baby)?.name"
                /></el-aside>
                <el-main style="position: relative">
                  <p style="margin-bottom: 1em">商品名称：{{ getBabyById(baby)?.name }}</p>
                  <p style="margin-bottom: 1em">商品城市：{{ getBabyById(baby)?.city }}</p>
                  <p style="margin-bottom: 1em">商品店铺：{{ getBabyById(baby)?.belongs }}</p>
                  <p style="margin-bottom: 1em">物流状态：{{false}}</p>
                  <p style="margin-bottom: 1em">
                    商品款式：<el-tag type="success">{{ ProductList[index].style[k] }} </el-tag>
                  </p>
                  <br />
                  <p>
                    商品数量：<el-tag>{{ ProductList[index].quantity[k] }}</el-tag>
                  </p>
                  <div style="position: absolute; top: 0; right: 2%">
                    <el-button
                      type="primary"
                      @click="router.push('/Detail/' + getBabyById(baby)?.id)"
                      v-text="'查看详情'"
                    />
                    <el-button
                      type="danger"
                      v-text="`申请退款`"
                      @click="refund(baby)"
                      v-if="false"
                    />
                  </div>
                </el-main>
              </el-container>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </template>

      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="float: right">
            订单时间：
            {{ item.time.toString().split('T')[0] }}
            {{ item.time.toString().split('T')[1].split('.')[0] }}
          </span>
          <span>
            <el-button
              v-if="item.status"
              type="danger"
              v-text="`申请退款`"
              @click="refund(item)"
              :disabled="
                item.handling_number == 1 || item.handling_number == 3 || item.refund == `成功`
              "
            />
            <el-button
              v-if="item.status"
              type="danger"
              v-text="`取消退款`"
              @click="cancelRefund(item)"
              :disabled="item.refund != `待处理`"
            />
            <el-button v-else type="war" v-text="`取消订单`" @click="cancelOrder(item)" />
          </span>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue'
import { useMyDefaultStore } from '../../stores/counter'
import axios from 'axios'
import router from '../../router'
import { ElMessage } from 'element-plus'

const store = useMyDefaultStore()

const page = defineModel('page')
const total = defineModel('total')
const activeMenu = defineModel('activeMenu')

watch(activeMenu, (val) => {
  activeMenu.value = val
  GetData()
})

interface Order {
  ID: number
  orderNumber: string
  belong: string
  baby: string
  time: string
  status: boolean
  logistics: string
  refund: ['待处理', '未开启', '成功', '失败']
  handling_number: number
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
      page: page.value,
      type: activeMenu.value
    })
    .then((res) => {
      ProductList.value = []

      Data.value = res.data.data
      total.value = res.data.total
      Data.value.forEach((item) => {
        babyRegex(item.baby, ProductList.value)
      })

      console.clear()

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
const BYSus = ref<boolean | ['wait', 'complete']>(false)

//TODO：垃圾检测，后续增加选项时失效,添加变量解决
const GetBabys = () => {
  const list = new Set(IdList.value)

  if (BYSus.value == true) {
    console.log('数据已经全部拿取完成')

    return ''
  } else {
    BYSus.value = activeMenu.value == 'All' ? true : BYSus.value

    axios
      .post('/OrderBabyList', {
        babys: [...list]
      })
      .then((res) => {
        console.log('Babys: ', res.data)
        Babys.value = res.data
        BYSus.value = BYSus.value == true ? BYSus.value : (activeMenu.value as ['wait', 'complete'])
      })
  }

  if (typeof BYSus.value != 'boolean') {
    BYSus.value = BYSus.value != activeMenu.value
  }
}

//解决通过行内Js拿取Baby值，Vue抛精度异常问题
function getBabyById(id) {
  return this.Babys.find((baby) => baby.id == id)
}

//取消订单

const cancelOrder = (order) => {
  console.log(order)
  axios
    .post('deleteOrder', {
      ID: order.ID
    })
    .then((res) => {
      console.log(res.data)
      if (res) {
        ElMessage.success('订单取消成功')
        Data.value = Data.value.filter((item) => item.ID != order.ID)
      } else {
        ElMessage.error('订单取消失败')
      }
    })
    .catch((err) => {
      ElMessage.error(err.message)
    })
}

//退款逻辑

const refund = (order) => {
  axios
    .post('/StratRefund', {
      orderNumber: order.orderNumber
    })
    .then((res) => {
      console.log(res.data)
      if (res.data) {
        ElMessage.success('申请退款成功')
      } else {
        ElMessage.error('申请退款失败')
      }
      GetData()
    })
    .catch((err) => {
      ElMessage.error(err.message)
    })
}

const cancelRefund = (order) => {
  axios
    .post('/cancelRefund', {
      orderNumber: order.orderNumber
    })
    .then((res) => {
      console.log(res.data)
      if (res.data) {
        ElMessage.success('取消退款成功')
      } else {
        ElMessage.error('取消退款失败')
      }
      GetData()
    })
    .catch((err) => {
      ElMessage.error(err.response.data.Message)
    })
}

onMounted(() => {
  GetData()
})
</script>

<style></style>
