<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
  >
    <el-form-item label="账号" prop="pass">
      <el-input v-model="ruleForm.account" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="密码" prop="checkPass">
      <el-input v-model="ruleForm.pwd" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item :style="'width: max-content;margin:auto'">
      <el-button @click="resetForm(ruleFormRef)" type="danger">重置</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 登录 </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="less"></style>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios'
import router from '@/router'
import { useMyDefaultStore } from '@/stores/counter'

const store = useMyDefaultStore()

const ruleFormRef = ref<FormInstance>()

const kit = defineModel('kit')

console.log(kit.value)
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.pwd !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  account: '',
  pwd: ''
})

const rules = reactive<FormRules<typeof ruleForm>>({
  account: [{ validator: validatePass, trigger: 'blur' }],
  pwd: [{ validator: validatePass2, trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      login()
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const login = () => {
  axios
    .post('/AdminLogin', {
      account: ruleForm.account,
      pwd: ruleForm.pwd
    })
    .then((res) => {
      console.log(res.data)
      if (res.data != 0) {
        ElNotification({
          title: '登录成功',
          message: '即将进入后台',
          type: 'success'
        })
        setTimeout(() => {
          store.setAdmin(ruleForm.account)
          store.setAdChunk(res.data)
          router.push({ path: '/admin' })
        }, 1000)
      } else {
        ElNotification({
          title: '登录失败',
          message: '账号或密码错误',
          type: 'error'
        })
      }
    })
    .catch(() => {
      ElNotification({
        title: 'Error',
        message: '服务器未响应',
        type: 'error'
      })
    })
}
</script>
