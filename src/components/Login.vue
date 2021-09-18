<template>
  <div class="login-container">
    <div class="login-item">
      <div class="item-image">
        <a href="https://github.com/Yukon123" target="__blank">
          <img src="../assets/img/logo.jpg" alt="" class="img" />
        </a>
      </div>
      <el-form label-width="0px" class="login-form" :model="form" :rules="rules" ref="loginRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <div class="form-button">
          <el-button type="info" class="button-info right" @click="resetForm">重置</el-button>
          <el-button type="primary" class="right" @click="loginCheck">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import { ElMessage } from 'element-plus'
import router from '../router'
const axios: any = inject('axios')
const loginRef: any = ref(null)
const form = ref({ username: 'admin', password: '123456' })
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
  ],
})

const resetForm = () => {
  loginRef.value.resetFields()
}
const loginCheck = () => {
  loginRef.value.validate(async (valid: any) => {
    if (!valid) return loginRef.value.resetFields()
    const { data: res } = await axios.post('login', form.value).catch((err: any) => err)
    if (res.meta.status !== 200) {
      ElMessage.error('该用户不存在')
      loginRef.value.resetFields()
      return
    } else ElMessage.success('登录成功')
    window.sessionStorage.setItem('token', res.data.token)
    router.push({ name: 'home' })
  })
}
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-item {
    position: relative;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid #eee;
    .item-image {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      box-shadow: 0 0 10px #ddd;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      .img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login-form {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    bottom: 0px;
    padding: 15px;
    .button-info {
      margin: 0 0 0 15px;
    }
  }
}
</style>
