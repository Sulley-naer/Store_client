<template>
  <div>
    <div style="height: 400px" v-show="!view">
      <div class="mid" style="margin-bottom: 1em; margin-inline: auto; width: max-content">
        <el-input
          style="width: 45vw; height: 3vw"
          size="large"
          placeholder="请输入关键词"
          v-model="keyWorld"
          @change="GetData()"
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
              default-first-option
            >
              <el-option label="已付款" :value="true" key="2" />
              <el-option label="未付款" :value="false" key="3" />
              <el-option label="退款中" value="待处理" key="4" />
              <el-option label="任意" :value="null" key="1" />
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
    <baby-view
      v-show="view"
      v-model:data="data"
      v-model:view="view"
      :view-object="viewObject"
      :column="active"
    ></baby-view>
  </div>
</template>

// TODO ! 订单多商品不同店家，订单不会正确的渲染到对应店家上面。
<!-- 解决方式：生成订单的时候后端解析商品，并数据库存入多个相同订单，店家不同，实际返回最初的订单. -->

<script lang="tsx" setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { type Column, ElInput, ElNotification, ElButton, ElSelectV2, ElMessage } from 'element-plus'
import { Search, Delete, Goods } from '@element-plus/icons-vue'
import { useMyDefaultStore } from '@/stores/counter' // 引入isoWeek插件

const store = useMyDefaultStore()

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 引入中文语言包
import isoWeek from 'dayjs/plugin/isoWeek'
import BabyView from '@/views/Admin/Manager/BabyView.vue'

dayjs.locale('zh-cn') // 设置为中文
dayjs.extend(isoWeek) // 启用isoWeek插件，保证周一作为每周的开始

const view = ref(false)
const viewObject = ref()
const active = ref()

//搜索
const keyWorld = ref('')
//状态
const select = ref(true)
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

const rawData = ref()

const GetData = () => {
  console.clear()
  axios
    .post('/ShopOrder', {
      page: pages.value,
      query: keyWorld.value == '' ? null : keyWorld.value,
      startTime: activeTime.value?.start ?? null,
      Time: activeTime.value?.end ?? dayjs().toDate(), // 当前时间作为默认值
      mode: select.value == null ? null : select.value,
      belongs: store.getAdmin
    })
    .then((res) => {
      console.log(res.data)
      data.value = res.data.data // 假设后端返回的数据包含分页结果在 records 中
      total.value = res.data.total
      ElNotification({
        title: 'success',
        message: '数据获取成功',
        type: 'success'
      })
      rawData.value = res.data
    })
    .catch(() => {
      ElNotification({
        title: 'error',
        message: '服务器状态异常',
        type: 'error'
      })
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
    width: 330
  },
  {
    dataKey: 'time',
    name: 'time',
    title: '时间',
    width: 220
  },
  {
    dataKey: 'baby',
    name: 'baby',
    title: '商品',
    width: 80
  },
  {
    dataKey: 'logistics',
    name: 'logistics',
    title: '物流订单',
    width: 160,
    cellRenderer: ({ rowData, column }) => {
      const flag = ref(false)
      const onChange = (value: string) => {
        flag.value = true
        rowData[column.dataKey!] = value
      }

      const onEnterEditMode = () => {
        if (rowData[column.dataKey!] == '未发货') rowData[column.dataKey!] = ''
        flag.value = false
        rowData.editing = true
      }

      const onExitEditMode = () => {
        if (rowData[column.dataKey!] == '') rowData[column.dataKey!] = '未发货'
        if (flag.value) {
          axios
            .post('/OrderDelivery', {
              ID: rowData.ID,
              logistics: rowData[column.dataKey!]
            })
            .then((res) => {
              ElNotification({
                title: 'success',
                message: '提交成功',
                type: 'success'
              })
            })
            .catch(() => {
              ElNotification({
                title: 'error',
                message: '提交无效',
                type: 'error'
              })
            })
        }
        rowData.editing = false
      }

      const input = ref()
      const setRef = (el) => {
        input.value = el
        if (el) {
          el.focus?.()
        }
      }

      return rowData.editing ? (
        <InputCell
          style={{ width: '150px' }}
          forwardRef={setRef}
          value={rowData[column.dataKey!]}
          onChange={onChange}
          onBlur={onExitEditMode}
        />
      ) : (
        <input
          style={{ width: '150px' }}
          class="table-v2-inline-editing-trigger"
          onClick={onEnterEditMode}
          style="background: transparent"
          disabled={!rowData.status}
          v-model={rowData[column.dataKey!]}
        ></input>
      )
    }
  },
  {
    dataKey: 'status',
    name: 'status',
    title: '状态',
    width: 100,
    cellRenderer: ({ rowData }) => {
      return <ElText v-text={rowData.status ? '已付款' : '未付款'}></ElText>
    }
  },
  {
    dataKey: 'refund',
    name: 'refund',
    title: '退款',
    width: 125,
    cellRenderer: ({ rowData }) => {
      const show = rowData.refund != '待处理'

      const save = () => {
        axios
          .post('/UpdateOrder', {
            ID: rowData.ID,
            status: rowData.status,
            refund: '成功'
          })
          .then(() => {
            ElMessage.success('退款设置成功')
            GetData()
          })
          .catch((error) => {
            ElMessage.error(error.message)
          })
      }

      const onChange = (val) => {
        if (val == '成功') {
          save()
        }
      }

      const options = ref([
        {
          label: '待处理',
          value: '待处理'
        },
        {
          label: '同意退款',
          value: '成功'
        }
      ])

      return (
        <>
          {show && <span>{rowData.refund}</span>}
          {!show && <ElSelectV2 options={options} v-model={rowData.refund} onChange={onChange} />}
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
        viewObject.value = rowData
        active.value = data.value.indexOf(rowData)
        view.value = true
      }

      return <ElButton size="default" onClick={onChange} icon={Goods} />
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
