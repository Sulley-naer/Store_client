<template>
  <div style="height: 550px">
    <div class="mid" style='margin-bottom: 1em;margin-inline: auto;width: max-content;'>
      <el-input
        style="width: 50vw;height: 2.3vw"
        size="large"
        placeholder="请输入关键词"
        v-model='query'
        @change="searcher()"
        @keydown='searcher()'
      >
        <template #prepend>
          <el-select v-model="selector" placeholder="type" style="width: 115px;background: transparent" size='large'>
            <el-option label="城市" value="city" />
            <el-option label="类型" value="type" />
            <el-option label="商家" value="belong" />
            <el-option label="名称" value="name" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" size='large' @click='searcher()'/>
        </template>
      </el-input>
    </div>
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed />
      </template>
    </el-auto-resizer>
    <footer style='width: max-content;margin-inline: auto;margin-top: 2em;'>
      <el-pagination layout="prev, pager, next" :total="total" v-model:current-page='page' @change='query===""?GetBaby():searcher()'/>
    </footer>
  </div>
</template>

<script lang="tsx" setup>
import { type FunctionalComponent, onMounted, ref, watch } from 'vue'
import {
  type Column,
  ElIcon,
  ElInput,
  ElMessage,
  ElSelectV2,
  ElTooltip,
  type InputInstance
} from 'element-plus'
import { Search, Timer } from '@element-plus/icons-vue'
import axios from 'axios'
import dayjs from 'dayjs'

type SelectionCellProps = {
  value: string
  intermediate?: boolean
  onChange: (value: string) => void
  onBlur: () => void
  onKeydownEnter: () => void
  forwardRef: (el: InputInstance) => void
}

//更新数据
const update = (item: any) => {
  console.log(item)
  axios
    .post('/ShopChange', {
      id: item.id,
      name: item.name,
      time: item.time,
      price: item.price,
      total: item.total,
      address: item.address,
      type: item.type,
      city: item.city,
      photo: item.photo,
      attribute:item.attribute
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

//搜索

const query = ref()

const selector = ref("name")

const searcher = () => {
  console.log(query.value)
  axios.post("/GetBabyList",{
    city: selector.value=="city"?query.value:null,
    type: selector.value=="type"?query.value:null,
    belongs: selector.value=="belong"?query.value:null,
    name: selector.value=="name"?query.value:null,
    mode: "search",
    page: page.value
  }).then(res=>{
    data.value = res.data
    console.log(res.data)
    GetTotal()
  })
}

//分页

const page = ref(1)
const total = ref(10)

const GetTotal = ()=>{
  axios.post('/GetTotalBabyPages').then((res)=>{
    total.value=res.data
    console.log(res.data)
  })
}

// 可编辑的输入组件
const InputCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  onChange,
  onBlur,
  onKeydownEnter,
  forwardRef
}) => {
  return (
    <ElInput
      ref={forwardRef}
      onInput={onChange}
      onBlur={onBlur}
      onKeydown={onKeydownEnter}
      modelValue={value}
    />
  )
}

// 生成表格列
const columns: Column<any>[] = [
  {
    key: 'id',
    dataKey: 'id',
    title: 'ID',
    width: 100,
    cellRenderer: ({ cellData }) => <span>{cellData}</span>
  },
  {
    key: 'name',
    dataKey: 'name',
    title: '商品名称',
    width: 200,
    cellRenderer: ({ rowData, column }) => {
      let flag = ref(false)
      const onChange = (value) => {
        rowData[column.dataKey] = value
        flag.value = true
      }
      const onEnterEditMode = () => (rowData.editing = true)
      const onExitEditMode = () => {
        flag.value ? update(rowData) : null
        flag.value = false
        rowData.editing = false
      }
      const input = ref(null)

      return rowData.editing ? (
        <InputCell
          forwardRef={(el) => {
            input.value = el
            el?.focus?.()
          }}
          value={rowData[column.dataKey]}
          onChange={onChange}
          onBlur={onExitEditMode}
        />
      ) : (
        <div class="table-v2-inline-editing-trigger" onClick={onEnterEditMode}>
          {rowData[column.dataKey]}
        </div>
      )
    }
  },
  {
    key: 'city',
    dataKey: 'city',
    title: '城市',
    width: 150,
    cellRenderer: ({ rowData, column }) => {
      const onChange = (value) => {
        rowData[column.dataKey] = value
        update(rowData) // 保存修改后的城市
      }
      const citys = ref([
        {
          label: '北京',
          value: '北京'
        },
        {
          label: '上海',
          value: '上海'
        },
        {
          label: '深圳',
          value: '深圳'
        },
        {
          label: '广州',
          value: '广州'
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
    key: 'type',
    dataKey: 'type',
    title: '类型',
    width: 120,
    cellRenderer: ({ rowData, column }) => {
      const onChange = (value) => {
        rowData[column.dataKey] = value
        update(rowData) // 保存修改后的城市
      }
      const types = ref([
        {
          label: '演出',
          value: '演出'
        },
        {
          label: '展览',
          value: '展览'
        },
        {
          label: '本地生活',
          value: '本地生活'
        },
      ])

      return (
        <ElSelectV2
          modelValue={rowData[column.dataKey]}
          onChange={onChange}
          placeholder="选择类型"
          style="width: 100%"
          options={types}
        ></ElSelectV2>
      )
    }
  },
  {
    key: 'attribute',
    dataKey: 'attribute',
    title: '类型',
    width: 120,
    cellRenderer: ({ rowData, column }) => {
      const onChange = (value) => {
        rowData[column.dataKey] = value
        update(rowData) // 保存修改后的城市
      }
      const attributes = ref([
        {
          label: '真实商品',
          value: 'really'
        },
        {
          label: '虚拟物品',
          value: 'virtual'
        },
      ])

      return (
        <ElSelectV2
          modelValue={rowData[column.dataKey]}
          onChange={onChange}
          placeholder="选择类型"
          style="width: 100%"
          options={attributes}
        ></ElSelectV2>
      )
    }
  },
  {
    key: 'time',
    dataKey: 'time',
    title: '时间',
    width: 180,
    cellRenderer: ({ cellData: date }) => (
      <ElTooltip content={dayjs(date).format('YYYY/MM/DD')}>
        <span class="flex items-center">
          <ElIcon class="mr-3">
            <Timer />
          </ElIcon>
          {dayjs(date).format('YYYY/MM/DD')}
        </span>
      </ElTooltip>
    )
  },
  {
    key: 'address',
    dataKey: 'address',
    title: '地址',
    width: 300,
    cellRenderer: ({ cellData }) => <span>{cellData}</span>
  },
  {
    key: 'price',
    dataKey: 'price',
    title: '价格',
    width: 100,
    cellRenderer: ({ cellData }) => <span>¥{cellData}</span>
  },
  {
    key: 'belongs',
    dataKey: 'belongs',
    title: '商家',
    width: 150,
    cellRenderer: ({ cellData }) => <span>{cellData}</span>
  }
]

// 示例数据
const data = ref([
  {
    id: 6,
    name: '商品测试2',
    city: '广州',
    time: '2024-08-27T00:00:00',
    address: '重庆市南岸区海棠溪',
    price: 80,
    type: '演出',
    belongs: '123456',
  }
])

// 获取数据
const GetBaby = () => {
  axios.post('/CustomerBaby',{
    page:page.value
  }).then((res) => {
    data.value = res.data
    console.log(res.data)
  })
  GetTotal()
}

onMounted(() => GetBaby())
</script>

<style>
.table-v2-inline-editing-trigger {
  border: 1px transparent dotted;
  padding: 4px;
}

.table-v2-inline-editing-trigger:hover {
  border-color: var(--el-color-primary);
}
</style>
