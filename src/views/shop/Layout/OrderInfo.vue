<template>
  <el-dialog v-model="dialogVisible" title="物流信息" width="500" :before-close="handleClose">
    <span v-if="typeof data[0] == 'string'">{{ data[0] }}</span>
    <span v-else> {{ data[orderId.active].logistics }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"> 完成 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, watch } from 'vue'
import axios from 'axios'

const dialogVisible = defineModel('show', { default: false })
const OrderId = defineModel('orderId', { default: { id: 0, active: 0 } })

watch(
  () => OrderId.value.id,
  () => {
    GetLogistic()
  }
)

interface Data {
  id: number
  shop: string
  baby: number
  logistics: string
  bindOrder: number
}

const data = ref<Data[] | string>('未获取数据')

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭吗')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const GetLogistic = () => {
  axios
    .post('/GetLogistic', { ID: OrderId.value.id })
    .then((res) => {
      ElMessage.success('获取成功')
      data.value = res.data
    })
    .catch((err) => {
      ElMessage.error(err.response.data.message)
    })
}
</script>
