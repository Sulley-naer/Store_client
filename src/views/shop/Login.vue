<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px; margin-inline: auto"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
  >
    <el-form-item label="账号" prop="user">
      <el-input v-model="ruleForm.user" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
    </el-form-item>
    <div v-show="mode == 'reg'">
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="您的性别" clearable>
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
    </div>
    <el-form-item label="年龄" prop="age" v-show="false">
      <el-form-item label="" prop="age" style="width: 100%">
        <el-select-v2 v-model="ruleForm.age" placeholder="年龄" :options="ages" />
      </el-form-item>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm(ruleFormRef)" type="danger"> 重置 </el-button>
      <el-button type="primary" @click="mode = 'reg'" v-show="mode == 'login'">
        注册模式
      </el-button>
      <el-button type="primary" @click="mode = 'login'" v-show="mode == 'reg'">
        登录模式
      </el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 登录 </el-button>
    </el-form-item>
  </el-form>

  <el-dialog v-model="centerDialogVisible" title="Tips" width="500" align-center>
    <div v-show="mode == 'login'">
      <span v-show="msg">登录成功</span>
      <span v-show="!msg">账户或密码错误</span>
    </div>
    <div v-show="mode == 'reg'">
      <span v-show="msg">注册成功</span>
      <span v-show="!msg">用户名重复</span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div v-show="mode == 'login'">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="centerDialogVisible = false" v-show="!msg">
            取消
          </el-button>
          <el-button type="primary" @click="Router.push({ name: 'home' })" v-show="msg">
            登录成功
          </el-button>
        </div>
        <div v-show="mode == 'reg'">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="centerDialogVisible = false" v-show="!msg">
            取消
          </el-button>
          <el-button type="primary" @click="centerDialogVisible = false" v-show="msg">
            注册成功
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Router from '@/router'
import { useMyDefaultStore } from '@/stores/counter'
import axios from 'axios'

const store = useMyDefaultStore()
// 将 action 作为 store 的方法进行调用

const mode = ref('login')
const centerDialogVisible = ref(false)
const msg = ref(false)
const ruleFormRef = ref<FormInstance>()

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the age'))
  }
  setTimeout(() => {
    if (!value) {
      callback(new Error('请选择年龄'))
    } else {
      if (value < 18) {
        callback(new Error('年龄必须大于18'))
      } else {
        callback()
      }
    }
  }, 1000)
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    console.log('全部：密码未通过')
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (mode.value === 'reg') {
    if (value === '' || value.length <= 6) {
      console.log('注册：二次密码未通过')
      callback(new Error('密码不符合规范'))
    } else if (value !== ruleForm.value.checkPass) {
      callback(new Error('密码不一致'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const NameCheack = (rule: any, value: any, callback: any) => {
  if (mode.value === 'reg') {
    if (value === '' || value.length < 2) {
      console.log('注册：用户名未通过')
      callback(new Error('用户名不符合规范'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const validateGender = (rule: any, value: any, callback: any) => {
  if (mode.value === 'reg') {
    if (!value) {
      callback(new Error('请选择'))
      console.log('注册：性别未选择')
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const ruleForm = ref(
  reactive({
    pass: '',
    checkPass: '',
    age: '',
    user: '',
    gender: '',
    name: ''
  })
)

const rules = reactive<FormRules<typeof ruleForm>>({
  user: [
    { required: true, message: '请输入账户', trigger: 'blur' },
    { min: 3, max: 15, message: '最低长度3,最大长度15', trigger: 'blur' }
  ],
  name: [{ validator: NameCheack, trigger: 'blur' }],
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  // age: [{ validator: checkAge, trigger: 'blur' }],
  gender: [{ validator: validateGender, trigger: 'change' }]
})

//TODO : 后续使用Token保持登录状态
function SaveStatus() {
  //创建cookie
  cookieStore
    //cookie中设置name为value，有效期为365天,path为根目录 子级可以访问
    .set('name', 'value', { expires: 365, path: '/' })
    .then(() => console.log('Cookie set successfully'))
    .catch((err) => console.error('Failed to set cookie:', err))
}

const ages = ref(
  Array.from({ length: 10000 }).map((_, idx) => ({
    value: `${idx + 1}`,
    label: `${idx + 1}`
  }))
)

const login = () => {
  axios
    .post('/login', {
      account: ruleForm.value.user,
      pwd: ruleForm.value.pass
    })
    .then((res) => {
      if (res.data != null) {
        store.setUsername(ruleForm.value.user)
        store.setPwd(ruleForm.value.pass)
        store.setId(res.data.id)
        console.log(res.data)
      }
      msg.value = res.data != null
    })
  centerDialogVisible.value = true
}

const register = () => {
  axios
    .post('/register', {
      account: ruleForm.value.user,
      pwd: ruleForm.value.pass,
      name: ruleForm.value.name,
      gender: ruleForm.value.gender
    })
    .then((res) => {
      if (res.data) {
        store.setUsername(ruleForm.value.user)
        store.setPwd(ruleForm.value.pass)
        console.log(res.data)
      }
      msg.value = res.data == true
    })
  centerDialogVisible.value = true
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      SaveStatus()
      console.log('submit!')
      mode.value == 'login' ? login() : register()
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
