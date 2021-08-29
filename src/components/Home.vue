<template>
  <el-container class="home">
    <el-header>
      <div>
        <img src="../assets/img/logo.png" alt="" class="avatar" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="fold-aside" @click="foldAlide">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffca28"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-sub-menu :index="item.id + ''" v-for="(item, indey) in menuList" :key="item.id">
            <template #title>
              <i class="iconfont" :class="iconList[indey]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, inject, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import router from '../router'
const axios: any = inject('axios')
const iconList = ref(['icon-user', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'])
//获取菜单项
const menuList: Ref<any[]> = ref([])
const getMenuList = async () => {
  const { data: res } = await axios.get('menus').catch((err: any) => err)
  if (res.meta.status !== 200) ElMessage.error(res.meta.msg)
  else menuList.value = res.data
}
getMenuList()
//默认点亮的标签
let isCollapse = ref(false)
const activePath = ref('/users')
if (window.sessionStorage.getItem('pathState')) {
  activePath.value = window.sessionStorage.getItem('pathState') as string
}
const foldAlide = () => {
  isCollapse.value = !isCollapse.value
}
const saveNavState = (path: string) => {
  window.sessionStorage.setItem('pathState', path)
  activePath.value = path
}
//退出登录
const logout = () => {
  window.sessionStorage.clear()
  ElMessage.error('退出登录')
  router.push('/login')
}
</script>

<style scoped lang="less">
.home {
  height: 100%;
}
.avatar {
  height: 60px;
}
.el-header {
  background-color: rgb(54, 61, 64);
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;
  align-items: center;
  padding: 0;

  div {
    padding-left: 0;
    display: flex;
    align-items: center;
    span {
      padding-left: 20px;
    }
  }
  .el-button {
    position: relative;
    right: 20px;
    // margin-right: 20px;
  }
}
.el-aside {
  background-color: rgb(49, 55, 67);
  .fold-aside {
    background-color: #4a5064;
    letter-spacing: 0.2em;
    text-align: center;
    color: #fff;
    line-height: 24px;
    cursor: pointer;
    font-size: 10px;
  }
  .el-menu {
    border-right: 0px;
  }
}
.el-main {
  background-color: rgb(233, 237, 241);
}
.iconfont {
  padding-right: 12px;
}
</style>
