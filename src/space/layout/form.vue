<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, FormRules, UploadProps } from 'element-plus'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance, UploadFile } from 'element-plus'
import axios from 'axios'
import router from '../../router'
import { fi } from 'element-plus/es/locale'
import { log } from 'console'

const id = router.currentRoute.value.params.id

const form = ref<FormInstance>()

interface RuleForm {
  name: string
  phone: number
  gender: '男' | '女' | null
  email: string
  birthday: Date
  hobbies: string
  income: number
  DeliveryAddress: string
}

const formData = ref<RuleForm>({
  name: null,
  phone: null,
  gender: null,
  email: null,
  birthday: new Date(),
  hobbies: null,
  income: 0,
  DeliveryAddress: null
})

//邮箱补全
const links = ref([
  { value: '@qq.com', link: '' },
  { value: '@gmail.com', link: '' },
  { value: '@163.com', link: '' },
  { value: '@126.com', link: '' }
])

const rules = reactive<FormRules<RuleForm>>({
  phone: [
    { required: false, message: '请输入手机号码', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确号码', trigger: 'blur' },
    { pattern: /^\d{11}$/, message: '验证无效', trigger: 'blur' }
  ]
})
const querySearch = (queryString: string, cb) => {
  // Check if queryString contains '@'
  if (queryString.includes('@')) {
    cb([])
  } else {
    const results = links.value.map((link) => ({
      value: queryString + link.value,
      link: link.link
    }))
    cb(results)
  }
}

//头像上传
const uploadRef = ref<any>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const fileList = ref([])

//移除头像
const handleRemove = (file: UploadFile) => {
  console.log(fileList.value)
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
  console.log('Removed file:', file)
}

//预览头像
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

//下载头像
const handleDownload = (file: UploadFile) => {
  console.log(file)
}

//检查头像
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('头像图片必须是 JPG 格式！')
    return false
  }

  // 检查文件大小
  else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }

  // 防止默认的上传行为
  return false
}

//上传头像
const submitUpload = () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择文件进行上传！')
    return
  }

  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('file', file.raw)
    formData.append('id', id)
  })

  // 发送请求
  axios
    .post('/UploadAvatar', formData)
    .then((response) => {
      console.log(response.data)
      ElMessage.success('上传成功')
    })
    .catch((error) => {
      console.error(error)
      ElMessage.error('上传失败')
    })
}

const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

//获取头像
const GetAvatar = () => {
  axios
    .post('/GetAvatar', { id: id })
    .then((res) => {
      // 假设 res.data 返回的是头像文件名
      const avatarFileName = res.data // 根据实际返回的数据结构调整
      const avatarUrl = photoPath.value.replace('UploadedFiles', 'avatar') + res.data
      fileList.value.push({
        name: avatarFileName,
        url: avatarUrl,
        uid: avatarFileName, // uid 用于唯一标识
        status: 'success' // 状态设置为成功
      } as UploadFile)
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('获取头像失败')
    })
}

//获取数据
const GetData = () => {
  axios
    .post('/GetSpace', { id: id })
    .then((res) => {
      formData.value = res.data
      ElMessage.success('获取成功')
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('获取失败')
    })
}

//保存数据
const SaveData = () => {
  submitUpload()
  console.log(formData.value)
  axios
    .post('/UpdateSpace', {
      id: id,
      name: formData.value.name,
      phone: formData.value.phone,
      gender: formData.value.gender,
      email: formData.value.email,
      birthday: formData.value.birthday,
      hobbies: formData.value.hobbies,
      income: formData.value.income,
      DeliveryAddress: formData.value.DeliveryAddress
    })
    .then((res) => {
      console.log(res.data)
      ElMessage.success('保存成功')
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('保存失败')
    })
}

// 节流函数
function throttle(fn: Function, delay: number) {
  let lastTime = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      return fn.apply(this, args)
    }
  }
}

// 重置表单
const resetForm = throttle(() => {
  GetData()
}, 10000)

onMounted(() => {
  resetForm()
  GetAvatar()
})

</script>

<template>
  <el-container>
    <el-form
      :inline="false"
      :model="formData"
      label-position="right"
      label-width="100px"
      :rules
      ref="form"
    >
      <el-form-item label="姓名" prop="name" id="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="gender" id="gender">
        <el-select v-model="formData.gender" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
          <el-option label="保密" :value="null" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="phone"
        id="telephone"
        @input="(event) => (formData.phone = event.target.value.replace(/[^0-9]/g, ''))"
      >
        <el-input v-model="formData.phone" :maxlength="11" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email" id="email">
        <el-autocomplete
          :fetch-suggestions="querySearch"
          v-model="formData.email"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday" id="birthday">
        <el-date-picker v-model="formData.birthday" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="工资收入" prop="income" id="income">
        <el-input-number v-model="formData.income" :min="1000" :step="1000" :max="1000000">
          <template #suffix>
            <span>RMB</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="显示头像">
        <el-upload
          ref="uploadRef"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          v-model:file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :disabled="fileList.length >= 1"
        >
          <el-icon><Plus /></el-icon>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span
                  v-if="disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon><Download /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="兴趣爱好" prop="hobbies" id="hobbies"> 正在制作中... </el-form-item>

      <el-form-item label="" prop="hobbies" id="hobbies">
        <el-button type="default" @click="resetForm(form)" size="large" round> 重置 </el-button>
        <el-button type="primary" @click="SaveData" size="large" round> 保存 </el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
