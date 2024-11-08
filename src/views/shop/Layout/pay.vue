<script setup lang="ts">
import { useMyDefaultStore } from '@/stores/counter'
import QRCode from 'qrcode'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import Router from '@/router'
import router from '@/router'

// 引入store和canvas元素
const store = useMyDefaultStore()
const order = ref(store.getOrder)
const canvas = ref<HTMLCanvasElement | null>(null)

// 可配置的二维码参数
const qrOptions = {
  width: 256,
  margin: 1,
  color: {
    dark: '#000000',  // 黑色
    light: '#FFFFFF'  // 白色
  }
}

// 生成二维码并绘制在canvas上
const generatedQR = async () => {
  if (canvas.value) {
    try {
      await QRCode.toCanvas(canvas.value, order.value.orderNumber, qrOptions)
      console.log('QR code generated successfully')
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  } else {
    console.warn('Canvas is not available yet')
  }
}

// 在组件挂载后生成二维码
onMounted(() => {
  generatedQR()
})

const cancel = () => {
  /*axios.post("/UpdateOrder",{
    ID:order.value.ID,
    status: false
  }).then(res=>{
    ElNotification({
      title: 'success',
      message: '订单已取消',
      type: 'success'
    })
    ReGetOrder()
  })*/

  axios.post('/DeleteOrder', {
    ID: order.value.ID
  }).then((res) => {
    if (res) {
        ElNotification({
          title: 'success',
          message: '订单已取消',
          type: 'success'
        })
      Router.push({name:'shop'})
    }
    ReGetOrder()
  }).catch((err) => {
    ElNotification({
      title: 'error',
      message: '订单已不存在',
      type: 'error'
    })
    Router.push({name:'shop'})
  })
}

const validation = () => {
  axios.post('/UpdateOrder', {
    ID: order.value.ID,
    status: true
  }).then(res => {
    console.log(res.data)
    ElNotification({
      title: 'success',
      message: '付款成功',
      type: 'success'
    })
    router.push({name:'shop'})
  })
}

const ReGetOrder = () => {
  axios.post('/GetOrders', {
    ID: order.value.ID,
    orderNumber: order.orderNumber
  }).then(res => {
    order.value = res.data.data[0]
  })
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main style="text-align: center">
        <el-text size="large" type="info" truncated line-clamp="1" style="font-size: 34px">
          {{ order.status ? '订单完成' : '等待付款' }}
        </el-text>
        <br />
        <br />
        <el-text size="large" truncated style="font-size: large">订单ID：{{ order.ID }}</el-text>
        <br />
        <br />
        <el-text size="large" truncated style="font-size: large"
          >订单号：{{ order.orderNumber }}</el-text
        >
        <br />
        <br />
        <div id="qrcode">
          <!-- 用于显示二维码的canvas -->
          <canvas ref="canvas">二维码加载中...</canvas>
        </div>
        <br />
        <br />
        <el-popconfirm title="确认删除订单?" width="200">
          <template #reference>
            <el-button type="danger">取消订单</el-button>
          </template>
          <template #actions="{ confirm }">
            <el-button type="danger" size="small" @click="confirm(cancel())"> Yes? </el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" @click="validation()">我已付款</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
