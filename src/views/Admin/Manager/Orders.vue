<template>
  <div style="height: 400px">
    <div class="mid" style="margin-bottom: 1em; margin-inline: auto; width: max-content">
      <el-input
        style="width: 45vw; height: 3vw"
        size="large"
        placeholder="请输入关键词"
        v-model="keyWorld"
        @blur="GetData()"
        @keyup.enter="GetData()"
      >
        <template #append>
          <el-button :icon="Search" size="large" @click="GetData()" />
        </template>
        <template #prepend>
          <el-select
            v-model="select"
            placeholder="任意"
            size="large"
            style="width: 115px; height: 100%"
            @change="GetData()"
          >
            <el-option label="任意" :value="null" key="1" />
            <el-option label="已完成" value="true" key="2" />
            <el-option label="等待" value="false" key="3" />
            <el-option label="退款中" value="待处理" key="4" />
          </el-select>
        </template>
      </el-input>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        style="display: flex; justify-content: center; margin-top: 1em"
        default-active="5"
      >
        <el-menu-item index="1">本日</el-menu-item>
        <el-menu-item index="2">本周</el-menu-item>
        <el-menu-item index="3">本月</el-menu-item>
        <el-menu-item index="4">本年</el-menu-item>
        <el-menu-item index="5">所有</el-menu-item>
      </el-menu>
    </div>
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="data" :width="width" :height="550" fixed />
        <footer style="width: max-content; margin-inline: auto; margin-top: 2em">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            v-model:current-page="pages"
            @current-change="keyWorld === '' ? GetData() : null"
          />
        </footer>
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="tsx" setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { type Column, ElInput, ElNotification, ElSelectV2, ElButton, ElMessage } from 'element-plus'
import { Search, Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 引入中文语言包
import isoWeek from 'dayjs/plugin/isoWeek' // 引入isoWeek插件

dayjs.locale('zh-cn') // 设置为中文
dayjs.extend(isoWeek) // 启用isoWeek插件，保证周一作为每周的开始

//搜索
const keyWorld = ref('')
//状态
const select = ref('待处理')

//时间处理
const activeTime = ref()
const handleSelect = (index: string) => {
  switch (index) {
    case '1':
      activeTime.value = {
        start: dayjs().startOf('day').toDate(),
        end: dayjs().endOf('day').toDate()
      } // 本日，Date 对象
      break
    case '2':
      console.log(dayjs().startOf('week').toDate() + ' ~ ' + dayjs().endOf('week').toDate())
      activeTime.value = {
        start: dayjs().startOf('week').toDate(),
        end: dayjs().endOf('week').toDate()
      } // 本周，Date 对象
      break
    case '3':
      console.log(dayjs().startOf('month').toDate() + ' ~ ' + dayjs().endOf('month').toDate()) // 本月
      activeTime.value = {
        start: dayjs().startOf('month').toDate(),
        end: dayjs().endOf('month').toDate()
      } // 本月，Date 对象区间
      break
    case '4':
      console.log(dayjs().startOf('year').toDate() + ' ~ ' + dayjs().endOf('year').toDate()) // 本年
      activeTime.value = {
        start: dayjs().startOf('year').toDate(),
        end: dayjs().endOf('year').toDate()
      } // 本年，Date 对象区间
      break
    case '5':
      console.log(dayjs().toDate())
      activeTime.value = {
        start: null,
        end: dayjs().toDate()
      }
      break
    default:
      activeTime.value = null
  }
  GetData()
}

// 分页
const pages = ref(1)
const total = ref(1)

// 获取数据
const data = ref<any[]>([])
const GetData = () => {
  axios
    .post('/GetOrders', {
      page: pages.value,
      query: keyWorld.value == '' ? null : keyWorld.value,
      startTime: activeTime.value?.start ?? null,
      Time: activeTime.value?.end ?? dayjs().toDate(), // 当前时间作为默认值
      mode: select.value == null ? null : select.value
    })
    .then((res) => {
      data.value = res.data.data // 假设后端返回的数据包含分页结果在 records 中
      console.log(res.data)
      total.value = res.data.total
      ElNotification({
        title: 'success',
        message: '数据获取成功',
        type: 'success'
      })
    })
    .catch(() => {
      ElNotification({
        title: 'error',
        message: '服务器状态异常',
        type: 'error'
      })
    })
}
//更新状态
const update = (item) => {
  console.log(item)
  axios
    .post('/UpdateOrder', {
      ID: item.ID,
      status: item.status
    })
    .then((res) => {
      ElNotification({
        title: 'msg',
        message: res.data ? '修改成功' : '修改失败',
        type: 'info'
      })
      GetData()
    })
}
//删除订单
const del = (item) => {
  console.log(item)
  axios
    .post('/deleteOrder', {
      ID: item.ID
    })
    .then((res) => {
      console.log(res.data)
      ElNotification({
        title: 'msg',
        message: res.data ? '删除成功' : '删除失败',
        type: 'info'
      })
      GetData()
    })
}

onMounted(() => GetData())

// 可编辑的输入组件
const InputCell = ({ value, onChange, onBlur, onKeydownEnter, forwardRef }) => {
  return (
    <ElInput
      ref={forwardRef}
      onInput={onChange}
      onBlur={onBlur}
      onKeydown={onKeydownEnter}
      modelValue={value}
      type="password" // 确保密码以密文形式输入
    />
  )
}

const columns = [
  {
    dataKey: 'ID',
    name: 'ID',
    title: 'Index',
    width: 100
  },
  {
    dataKey: 'orderNumber',
    name: 'orderNumber',
    title: '订单号',
    width: 500
  },
  {
    dataKey: 'belong',
    name: 'belong',
    title: '所属用户',
    width: 100
  },
  {
    dataKey: 'baby',
    name: 'baby',
    title: '商品',
    width: 200
  },
  {
    dataKey: 'time',
    name: 'time',
    title: '时间',
    width: 220
  },
  {
    dataKey: 'status',
    name: 'status',
    title: '状态',
    width: 110,
    cellRenderer: ({ rowData, column }) => {
      const onChange = (value) => {
        rowData[column.dataKey] = value
        update(rowData) // 保存修改后的城市
      }

      const citys = ref([
        {
          label: '完成',
          value: true
        },
        {
          label: '等待',
          value: false
        }
      ])

      return (
        <ElSelectV2
          modelValue={rowData[column.dataKey]}
          onChange={onChange}
          placeholder="选择城市"
          style="width: 100%"
          options={citys}
        ></ElSelectV2>
      )
    }
  },
  {
    dataKey: 'refund',
    name: 'refund',
    title: '退款状态',
    width: 125,
    cellRenderer: ({ rowData, column }) => {
      const original = rowData[column.dataKey]

      const onChange = (value) => {
        rowData[column.dataKey] = value
        if (value != original) {
          save()
        }
      }

      const save = () => {
        axios
          .post('/UpdateOrder', {
            ID: rowData.ID,
            status: rowData.status,
            refund: rowData.refund
          })
          .then(() => {
            ElMessage.success('退款设置成功')
            GetData()
          })
          .catch((error) => {
            ElMessage.error(error.message)
          })
      }

      const show = ref(rowData[column.dataKey] == '未开启')

      const option = ref([
        {
          label: '同意退款',
          value: '成功'
        },
        {
          label: '拒绝退款',
          value: '失败'
        },
        {
          label: '关闭退款',
          value: '未开启'
        }
      ])

      return (
        <>
          {show.value && <span>未开启</span>}

          {!show.value && (
            <ElSelectV2
              modelValue={rowData[column.dataKey]}
              onChange={onChange}
              placeholder="选择城市"
              style="width: 100%"
              disabled={rowData.handling_number == 0 || rowData.handling_number == 2}
              options={option}
            ></ElSelectV2>
          )}
        </>
      )
    }
  },
  {
    dataKey: '操作',
    name: '操作',
    title: '操作',
    cellRenderer: ({ rowData, column }) => {
      const onChange = (value) => {
        del(rowData) // 保存修改后的城市
      }

      return <ElButton size="default" onClick={onChange} icon={Delete} />
    },
    width: 150,
    align: 'center'
  }
]
</script>

<style>
.el-select__wrapper {
  height: 100%;
}
</style>
