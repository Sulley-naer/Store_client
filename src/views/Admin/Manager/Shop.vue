<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { useMyDefaultStore } from '@/stores/counter'
import { Check, Delete, InfoFilled,Operation } from '@element-plus/icons-vue'

const store = useMyDefaultStore()

const isChange = ref(false)

const menu = defineModel('active')

watch(menu, (val) => {
  menu.value = val
  console.log(val)
})
const GetShopManager = async () => {
  axios
    .post('/ShopManager', {
      account: store.getAdmin
    })
    .then((res) => {
      console.log(res.data)
      res.data != null ? (tableData.value = res.data) : null
      ElMessage({
        message: '获取成功',
        type: 'success',
        plain: true
      })
    })
    .catch(() => {
      ElNotification({
        title: 'Error',
        message: '请求异常',
        type: 'error'
      })
    })
}

const tableData = ref([
  {
    id: 11,
    name: '商品测试',
    city: '北京',
    time: '2024-08-27T00:00:00',
    address: '重庆市南岸区海棠溪',
    photo: '/baby/baby.webp',
    price: 80,
    type: '本地生活',
    total: 100
  }
])

const types = ref(['演出', '展览', '本地生活'])
const citys = ref(['北京', '上海', '深圳', '广州'])
const DeleteRow = (index: number, complete: Function, item: any) => {
  tableData.value.splice(index, 1)
  console.log(item.row)
  axios
    .post('/DelShop', {
      id: item.row.id
    })
    .then((res) => {
      if (res.data) {
        complete()
        ElMessage({
          message: '删除成功',
          type: 'success',
          plain: true
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: '删除失败',
        type: 'error',
        plain: true
      })
    })
}
const ChangeRow = (item: any) => {
  console.log(item.row)
  axios
    .post('/ShopChange', {
      id: item.row.id,
      name: item.row.name,
      city: item.row.city,
      time: item.row.time,
      address: item.row.address,
      photo: item.row.photo,
      price: item.row.price,
      type: item.row.type,
      total: item.row.total
    })
    .then((res) => {
      if (res.data) {
        ElMessage({
          message: '修改成功',
          type: 'success',
          plain: true
        })
      }
    })
    .catch(() => {
      ElMessage({
        message: '修改失败',
        type: 'error',
        plain: true
      })
    })
}

onMounted(async () => GetShopManager())

const handleFile = async (event: Event, item: any) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return // 确保文件已选择

  const formData = new FormData()
  // 读取文件

  for (let i = 0; i < input.files.length; i++) {
    formData.append('file', input.files[i])
  }

  try {
    const response = await axios.post('/UpLoadPhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    ElMessage({
      message: response.data,
      type: 'success',
      plain: true
    })
    item.photo = response.data.toString().replace('文件上传成功: ', '')
    ChangeRow({ row: item })
  } catch (error) {
    console.error('上传失败:', error)
  }
}

//记录商品
const id = defineModel("id")
</script>

<template>
  <div style="width: 100%; height: 100%">
    <el-table :data="tableData" style="width: 100%" max-height="750" table-layout="auto">
      <el-table-column fixed prop="id" label="ID" width="150" />
      <el-table-column prop="name" label="名称" width="120">
        <template #default="{ row }">
          <el-input v-model="row.name" size="default" v-show="isChange" />
          <span v-show="!isChange"> {{ row.name }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" width="120">
        <template #default="{ row }">
          <div v-show="isChange">
            <el-select v-model="row.city" placeholder="Select" size="large">
              <el-option v-for="item in citys" :key="item" :value="item" />
            </el-select>
          </div>
          <span v-show="!isChange"> {{ row.city }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          <div v-show="isChange">
            <el-select v-model="row.type" placeholder="Select" size="large">
              <el-option v-for="item in types" :key="item" :value="item" />
            </el-select>
          </div>
          <span v-show="!isChange"> {{ row.type }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="200">
        <template #default="{ row }">
          <el-input v-model="row.address" size="default" v-show="isChange" />
          <span v-show="!isChange"> {{ row.address }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间" width="250">
        <template #default="{ row }">
          <div v-show="isChange">
            <el-date-picker v-model="row.time" type="datetime" placeholder="Pick a Date" />
          </div>
          <span v-show="!isChange"> {{ row.time.toString().slice(0, 10) }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="120">
        <template #default="{ row }">
          <el-input v-model="row.price" size="default" v-show="isChange" />
          <span v-show="!isChange"> $ {{ row.price }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总数" width="120">
        <template #default="{ row }">
          <el-input v-model="row.total" size="default" v-show="isChange" />
          <span v-show="!isChange"> {{ row.total }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="alreadyBuy" label="已购" width="60" />
      <el-table-column prop="total" label="类型" width="120">
        <template #default="{ row }">
          <span v-show="!isChange"> {{ row.attribute=="really"?"真实商品":"虚拟物品" }} </span>
        <el-select v-model="row.attribute" placeholder="Select" style="width: 110px" v-show="isChange">
          <el-option
            label="真实商品"
            value="really"
          />
          <el-option
            label="虚拟物品"
            value="virtual"
          />
        </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="photo" label="图片" width="220">
        <template #default="{ row }">
          <input
            style="width: 200px"
            type="file"
            v-show="isChange"
            @change="handleFile($event, row)"
          />
          <span
            v-show="!isChange"
            style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          >
            {{ row.photo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="150">
        <template #default="scope">
          <el-button link type="success" :icon="Check" circle @click.prevent="ChangeRow(scope)" />
          <el-popconfirm
            width="300"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="删除后无法还原，请确实是否删除!"
          >
            <template #reference>
              <el-button link type="danger" :icon="Delete" circle />
            </template>
            <template #actions="{ confirm, cancel }">
              <el-button size="small" @click="cancel">No!</el-button>
              <el-button
                type="danger"
                size="small"
                @click="DeleteRow(scope.$index, confirm, scope)"
              >
                Yes?
              </el-button>
            </template>
          </el-popconfirm>
          <el-button link type='primary' circle :icon='Operation' @click='$emit("update",scope.row.id)' />
        </template>
      </el-table-column>

    </el-table>

    <el-button style="width: 100%; margin-left: 0" @click="GetShopManager">刷新数据</el-button>
    <el-button style="width: 100%; margin-left: 0" @click="isChange = !isChange">{{
      isChange ? '仅仅查看' : '修改商品'
    }}</el-button>
  </div>
</template>

<style scoped></style>
