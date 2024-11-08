<template>
  <main style="display: flex; flex-direction: column; justify-content: center; align-items: center">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px; min-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="ruleForm.name"
          type="text"
          autocomplete="off"
          placeholder="您的商品名称 > 3"
        />
      </el-form-item>
      <el-form-item label="所在城市" prop="city">
        <el-select-v2 v-model="ruleForm.city" :options="citys" placeholder="citys" />
      </el-form-item>
      <el-form-item label="商品类型" prop="type">
        <el-select-v2 v-model="ruleForm.type" :options="types" placeholder="types" />
      </el-form-item>
      <el-form-item label="商品总数" prop="total">
        <el-autocomplete v-model="ruleForm.total" :fetch-suggestions="querySearch" placeholder="nums" />
      </el-form-item>
      <el-form-item label="开始时间" prop="time" required>
        <el-date-picker
          v-model="ruleForm.time"
          type="datetime"
          placeholder="选择时间"
          :shortcuts="shortcuts"
          size="large"
        />
      </el-form-item>
      <el-form-item label="商品地址" prop="address">
        <el-input
          v-model="ruleForm.address"
          size="large"
          placeholder="请输入地址"
          :prefix-icon="Location"
        />
      </el-form-item>

      <el-form-item label="物品类型" prop="attribute">
        <el-select v-model="ruleForm.attribute" placeholder="Select" style="width: 240px">
          <el-option
            label="真实商品"
            value="really"
          />
          <el-option
            label="虚拟物品"
            value="virtual"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model="ruleForm.price" size="large" :min="1" step="10" />
      </el-form-item>
      <el-form-item label="商品图片" prop="photo" required>
        <el-upload
          class="upload-demo"
          drag
          action="api/UpLoadPhoto"
          multiple
          style="width: 100%"
          v-model="ruleForm.photo"
          ref="photo"
          :on-success="handleUploadSuccess"
          :on-remove="handleRemove"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <template #tip>
            <div class="el-upload__tip"></div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <div style="margin: auto">
          <el-button @click="resetForm(ruleFormRef)" size="large">重置</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)" size="large"> 确认 </el-button>
        </div>
      </el-form-item>
    </el-form>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Location, UploadFilled } from '@element-plus/icons-vue'
import { useMyDefaultStore } from '@/stores/counter'
const store = useMyDefaultStore()
import axios from 'axios'

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  name: '',
  city: '',
  type: '',
  time: '',
  address: '',
  total: '',
  price: '',
  photo: '',
  attribute:''
})

//?验证数据

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
  }
])

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
    label: '广州',
    value: '广州'
  },
  {
    label: '深圳',
    value: '深圳'
  }
])

const shortcuts = [
  {
    text: 'Today',
    value: new Date()
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date
    }
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date
    }
  }
]

//?价格数据
const nums = Array.from({ length: 10001 }).map((_, idx) => ({
  value: `${idx * 10}`,
  label: `${idx * 10}`
}))
const querySearch = (queryString: string, cb) => {
  const results = queryString
    ? nums.filter(createFilter(queryString))
    : nums
  // call callback function to return suggestion objects
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

//!表单验证函数
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      success()
    } else {
      console.log('error submit!')
    }
  })
}

const photo = ref(null)

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {
      type: 'string',
      required: true,
      message: '请输入合法名称',
      trigger: 'blur',
      min: 3
    }
  ],
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ],
  city: [
    {
      required: true,
      message: '请选择城市',
      trigger: 'change'
    }
  ],
  time: [
    {
      type: 'date',
      required: true,
      message: '请选择时间',
      trigger: 'change'
    }
  ],
  address: [
    {
      type: 'string',
      required: true,
      message: '请输入商品地址 需要长度 > 6',
      trigger: 'blur',
      min: 6
    }
  ],
  total: [
    {
      required: true,
      message: '请选择数量',
      trigger: 'change'
    }
  ],
  price: [
    {
      type: 'number',
      required: true,
      message: '价格错误',
      trigger: 'blur'
    }
  ],
  photo: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'change'
    }
  ],
  attribute:[
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ]
})
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleUploadSuccess = (response: string, file: any, fileList: any) => {
  console.log(response)
  if (response.includes('文件上传成功: ')) {
    ruleForm.photo = response.replace('文件上传成功: ', '')
    ElMessage({
      message: '上传成功',
      type: 'success',
      duration: 2000
    })
  } else {
    ElMessage({
      message: '上传失败',
      type: 'error',
      duration: 2000
    })
  }
}

const handleRemove = () => {
  ruleForm.photo = ''
}

const success = () => {
  axios
    .post('/addBaby', {
      name: ruleForm.name,
      city: ruleForm.city,
      type: ruleForm.type,
      time: ruleForm.time,
      address: ruleForm.address,
      total: ruleForm.total,
      price: ruleForm.price,
      photo: ruleForm.photo,
      attribute:ruleForm.attribute,
      belongs: store.getAdmin,
    })
    .then((res) => {
      ElMessage({
        message: res.data,
        type: 'success',
        plain: true
      })
    })
}
</script>
