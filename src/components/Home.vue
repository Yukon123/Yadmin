<template>
  <el-container class="home">
    <el-header>
      <div>
        <img src="../assets/img/logo.png" alt="" class="avatar" />
        <span class="title" @click="backWelcome">Yukon-CMS</span>
      </div>
      <el-button type="danger" size="mini" @click="logout">退出</el-button>
    </el-header>
    <el-container class="content">
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="fold-aside" @click="foldAlide">
          <i class="el-icon-s-unfold" v-if="isCollapse"></i>
          <i class="el-icon-s-fold" v-else></i>
        </div>
        <el-menu
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          background-color="#0c2135"
          text-color="#b7bdc3"
          active-text-color="#0a60bd"
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
      <el-main :style="{ left: foldWidth }">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, inject, Ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import router from '../router'
const axios: any = inject('axios')
const iconList = ref(['icon-user', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'])

// 返回首页
const backWelcome = () => {
  router.push('welcome')
  activePath.value = ''
  isCollapse.value = false
}

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
const activePath = ref('')
if (window.sessionStorage.getItem('pathState')) {
  activePath.value = window.sessionStorage.getItem('pathState') as string
}
const foldAlide = () => {
  isCollapse.value = !isCollapse.value
}
const foldWidth = computed(() => {
  return isCollapse.value ? '64px' : '200px'
})

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
.el-header {
  position: fixed;
  width: 100%;
  background-color: #0c2135;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;
  align-items: center;
  padding: 0 0 0 22px;
  z-index: 10;

  div {
    display: flex;
    align-items: center;
    span {
      padding-left: 20px;
      a {
        color: white;
      }
    }
    .title {
      font-size: 16px;
      font-weight: 700;
    }
    .avatar {
      height: 40px;
      border-radius: 40px;
    }
  }
  .el-button {
    position: relative;
    right: 10px;
  }
}
.content {
  width: 100vw;
}
.el-aside {
  top: 60px;
  position: fixed;
  background-color: #0c2135;
  height: 100%;

  .fold-aside {
    color: #ffffff;
    text-align: center;
    font-size: 20px;
  }
  .el-menu {
    border-right: 0px;
  }
}
.el-main {
  padding-top: 16px;
  position: absolute;
  top: 60px;
  bottom: 0px;
  right: 0px;
  background-color: rgb(233, 237, 241);
  overflow-x: hidden;
}
.iconfont {
  padding-right: 12px;
}
</style>
