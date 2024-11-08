<script setup lang="ts">
import { watch, ref, onActivated } from 'vue'

import { Back } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { set } from 'js-cookie'

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

const result = ref([])


watch(view, (newValue) => {
  view.value = newValue
})

function initVar() {
  console.log('________________________')
  console.log('当前行商品集合:', Data.value[props.column])
  // console.log(props.viewObject)
  console.log(props.column)

  babyList.value = []
  sumList.value = []

  console.log(Data.value)

  babyRegex(Data.value[props.column].baby)

  console.log("添加完毕",babyList.value)

  GetBaby()
}

const babyRegex = (item:string)=>{
  console.log(item)

  const regex = /(\d+)\+(\d+):([^\s;]+)/g;
  const result = [];
  let match;

// 循环匹配所有组
  while ((match = regex.exec(item)) !== null) {
    result.push({
      id: match[1],      // 商品ID
      quantity: match[2], // 数量
      style: match[3]     // 款式
    });
  }

  babyList.value = result.map(product => product.id);
  sumList.value = result.map(product => product.quantity);
  style.value = result.map(product => product.style);

  console.log('----------------------------')
}
const GetBaby = () => {
  axios
    .post('/OrderBabyList', { babys:babyList.value } )
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
        message: '服务器异常',
        type: 'error'
      })
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

onActivated(()=>{
  initVar()
})

//图床
const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

console.log('图片地址', photoPath.value)
</script>

<template>
  <div>
    <el-main>
      <el-scrollbar height="70vh" style='display: flex; align-items: center;justify-content: center'>
        <el-card style="max-width: 25vw;display: inline-block;margin-inline: 1em;max-height: 50vh " v-for='(item,key) in result'
        :body-style='"overflow: hidden"'
        >
          <template #header>
          <el-badge class="item" :value='sumList[key]'>
            <el-text>{{item.name}}</el-text>
          </el-badge>
            <div style='float: right'>
              <el-tag type="info" v-if='style[key]=="default"'>{{style[key]=="default"?"未选择款式":style[key]}}</el-tag>
              <el-tag type="success" v-else >{{style[key]}}</el-tag>
            </div>
          </template>
          <img
            :src="photoPath + item.photo"
            style="width: 100%;min-width: 13vw;height: 350px"
          />
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
</style>
