<script setup lang="ts">
import { watch, ref, onActivated, Ref } from 'vue'
import { Back } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { useMyDefaultStore } from '@/stores/counter'

const store = useMyDefaultStore()

const props = defineProps<{
  viewObject: object
  column: number
}>()

const view = defineModel('view') // 假设你有一个控制显示的变量
const Data = defineModel('data') // 假设你有一个控制显示的变量

//商品信息
const babyList = ref([])
const sumList = ref([])
const style = ref([])

type res = [null | {
    active: number
    address: string
    alreadyBuy: number
    attribute: string
    belongs: number
    brand: string
    city: string
    id: number
    message: string
    name: string
    photo: string
    price: number
    selectedStyle: null|string
    time: Date
    total: number
    type: string
  }]

const result:res = ref([])

const multiplayerMode:Ref<boolean> = ref(false);

watch(view, (newValue) => {
  view.value = newValue
})

function initVar() {
  console.clear()
  console.log('________________________')
  console.log('当前行商品集合:', Data.value[props.column])
  // console.log(props.viewObject)
  console.log(props.column)

  babyList.value = []
  sumList.value = []

  console.log(Data.value)

  babyRegex(Data.value[props.column].baby)

  console.log('添加完毕', babyList.value)

  GetBaby()
}
const babyRegex = (item: string) => {
  console.log(item)

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

  babyList.value = result.map((product) => product.id)
  sumList.value = result.map((product) => product.quantity)
  style.value = result.map((product) => product.style)

  result.length > 1?multiplayerMode.value = true:null;
  multiplayerMode.value?GetLogistics():null;

  console.log('----------------------------')
}

//初始化请求
const GetBaby = () => {
  axios
    .post('/OrderBabyList', { babys: babyList.value, belongs: store.getAdmin })
    .then((res) => {
      console.log(res.data)
      result.value = res.data
      if (res.data.length > 0) {
        ElNotification({
          title: 'succeed',
          message: '成功',
          type: 'success'
        })
      } else {
        ElNotification({
          title: 'error',
          message: '失败',
          type: 'error'
        })
      }
    })
    .catch((err) => {
      ElNotification({
        title: 'error',
        message: err.response.data.Message,
        type: 'error'
      })
    })
}

type MData = [{
  baby: number
  bindOrder: number
  id: number
  logistics: string
  shop: string
}]

const MultiplayerData = ref()<MData>
const GetLogistics = () => {
  axios.post("/multiplayerMode",{id:Data.value[props.column].ID,belongs:store.getAdmin})
    .then((res) => {
      ElMessage.success(res.data?"获取物流成功":"暂未发货")
      MultiplayerData.value = res.data
      console.log("物流数据：" , MultiplayerData.value)
    }).catch((err) => {
    ElMessage.error(err.response.data.Message)
    throw err
  })
}

watch(
  () => view.value,
  (newValue) => {
    if (newValue) {
      initVar()
    }
  }
)

onActivated(() => {
  initVar()
})

//图床
const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

console.log('图片地址', photoPath.value)

const delivery = (e:InputEvent,order)=>{
  const Dom = e.target as HTMLInputElement
  order.logistics = Dom.value
  console.log(order)
  axios.post("ShippedDelivery",{id:order.id,logistics:order.logistics}).then((res) => {
    ElMessage.success(res.data?"修改成功":"没有变化")
  }).catch((err) => {
    ElMessage.error(err.response.data.Message)
  })
}
</script>

<template>
  <div>
    <el-main>
      <el-scrollbar
        height="70vh"
        style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap"
      >
        <el-card
          style="max-width: 30vw; display: inline-block; margin-inline: 1em; max-height: 50vh"
          v-for="(item, key) in result"
          :key="key"
          :body-style="'overflow: hidden'"
        >
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <el-badge class="item" :value="sumList[key]">
                <el-text>{{ item.name }}</el-text>
              </el-badge>
              <div>
                <input type='text' :value='MultiplayerData[key].logistics=="暂未发货"?`多订单发货填写,普通订单无效`:MultiplayerData[key].logistics'
                       @focus='(e)=>{e.target.value == `多订单发货填写,普通订单无效`?e.target.value=``:null}'
                       @blur='(e)=>{e.target.value == ``?e.target.value=`多订单发货填写,普通订单无效`:null}'
                       @change='(e)=>{delivery(e,MultiplayerData[key])}'/>
              </div>
              <div>
                <el-tag type="info" v-if="style[key] == 'default'">{{
                  style[key] == 'default' ? '未选择款式' : style[key]
                }}</el-tag>
                <el-tag type="success" v-else>{{ style[key] }}</el-tag>
              </div>
            </div>
          </template>
          <img :src="photoPath + item.photo" style="width: 100%; min-width: 13vw; height: 350px" alt='商品宣传图'/>
        </el-card>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <el-button circle type="primary" size="large" :icon="Back" id="Back" @click="view = !view" />
    </el-footer>
  </div>
</template>

<style lang="less" scoped>
#Back {
  position: fixed;
  bottom: 10vh;
  right: 3vw;
  transform: scale(1.5);
}

input[type=text]{
  border: 1px solid #3f3d3d;
  padding: 7px;
  outline: none;
  border-radius: 7px;
}
</style>
