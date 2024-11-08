<template>
  <div style="height: 400px">
    <div class="mid" style='margin-bottom: 1em;margin-inline: auto;width: max-content;'>
      <el-input
        style="width: 45vw;height: 3vw"
        size="large"
        placeholder="请输入关键词"
        v-model='keyWorld'
        @blur="GetData()"
        @keyup.enter='GetData()'
      >
        <template #append>
          <el-button :icon="Search" size='large' @click='GetData()'/>
        </template>
      </el-input>
    </div>
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
        />
      </template>
    </el-auto-resizer>
    <footer style="width: max-content; margin-inline: auto; margin-top: 2em;">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="pages"
        @current-change="keyWorld === '' ? GetData():null"
      />
    </footer>
  </div>
</template>

<script lang="tsx" setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { type Column, ElInput, ElNotification } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const keyWorld = ref('')

// 分页
const pages = ref(1)
const total = ref(1)

// 获取数据
const data = ref<any[]>([])

const GetData = () => {
  axios.post("/ShopUser", {
    page: pages.value,
    query:keyWorld.value==""?null:keyWorld.value
  }).then((res) => {
    data.value = res.data.res // 假设后端返回的数据包含分页结果在 records 中
    total.value = res.data.total
    ElNotification({
      title: 'success',
      message: '数据获取成功',
      type: 'success'
    })
  }).catch(()=>{
    ElNotification({
      title: 'error',
      message: '服务器状态异常',
      type: 'error'
    })
  })
}

//更新密码
const update = (item)=>{
  console.log(item)
  axios.post("/ShopUser",{
    id:item.Id,
    pwd:item.pwd,
  }).then(res=>{
    ElNotification({
      title: 'success',
      message: res.data,
      type: 'success'
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
      type="password"  // 确保密码以密文形式输入
    />
  )
}


const columns = [
  {
    dataKey: 'Id',
    name: 'Id',
    title:"Index",
    width:100
  },
  {
    dataKey: 'account',
    name: 'account',
    title: "用户",
    width:100
  },
  {
    dataKey: 'pwd',
    name: 'pwd',
    title: '密码',
    width: 100,
    cellRenderer: ({ rowData, column }) => {
      const onChange = (value) => {
        rowData[column.dataKey] = value
        flag.value = true
      }
      const flag = ref(false)
      const onEnterEditMode = () => rowData.editing = true
      const onExitEditMode = () => {
        rowData.editing = false
        flag.value?update(rowData):null  // 在修改后保存整行数据
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
          ****  {/* 密码用星号显示 */}
        </div>
      )
    },
  },
  {
    dataKey:"authority",
    name:'authority',
    title: "账户类型",
    width:100,
    cellRenderer: ({ cellData }) => <span>{cellData=="3"?"商家":"管理员"}</span>,
  }
]

</script>
