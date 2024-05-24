<template>
    <div class="container">
        <div class="login">
        <h1>Login</h1>
        <form>
            <el-input v-model="username" placeholder="账号" />
            <el-input v-model="password" placeholder="密码" />
            <el-button>立即登录</el-button>
        </form>
        </div>
    </div>
</template>

<style scoped lang="less">
.container{
    display: flex;

    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
    align-items: center;
        input{
            width: 20em;
            margin-bottom: 20px;
        }
        button{
            width: 120px;
        }
    }
}
</style>


<script>
export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: ''
        }
    }
}
</script>