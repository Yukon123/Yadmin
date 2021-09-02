<template>
  <div class="welcome">
    <el-card class="about">
      <div><h3>关于</h3></div>
      <el-divider></el-divider>
      <el-link type="primary" class="name"> Yukon-CMS </el-link>
      <span>是基于 Vue3、VueRouter、 ElementPlus 、TypeScript、Echart5 等后台系统解决方案。</span>
      <div class="git-title">
        @github仓库 :
        <el-link type="primary" href="https://github.com/Yukon123/Yadmin">https://github.com/Yukon123/Yadmin</el-link>
      </div>
    </el-card>
    <el-card class="tech-stack">
      <div>
        <h3>技术栈</h3>
        <el-divider></el-divider>
        <div class="techStack">
          <div v-for="tech in techStack" :key="tech.title">
            <div class="tech-title">{{ tech.title + '   :    ' }}</div>
            <el-link type="primary" :href="tech.link">{{ tech.desp }}</el-link>
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div><h3>项目结构</h3></div>
      <el-divider></el-divider>
      <div class="projTree"><highlightjs language="js" :code="tree" class="tree"></highlightjs></div>
    </el-card>
    <el-card class="dependency">
      <el-descriptions class="margin-top" title="生产环境依赖" :column="2" border>
        <template>
          <el-descriptions-item v-for="(itemData, index) in depData" :key="index">
            <template #label> {{ itemData.name }} </template>
            <el-tag size="small">{{ itemData.description }}</el-tag>
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { ref, shallowRef } from 'vue'
const techStack = ref([
  {
    title: '开发工具',
    desp: 'Visual Studio Code',
    link: '',
  },

  {
    title: '编程语言',
    desp: 'TypeScript 4.x + JavaScript',
    link: '',
  },

  {
    title: '构建工具',
    desp: 'Webpack5.x',
    link: '',
  },

  {
    title: '前端框架',
    desp: 'Vue 3.x',
    link: '',
  },

  {
    title: '路由工具',
    desp: 'Vue Router 4.x',
    link: '',
  },

  {
    title: 'UI 框架',
    desp: 'Element Plus',
    link: '',
  },

  {
    title: '可视化',
    desp: 'Echart5.x',
    link: '',
  },

  {
    title: '富文本',
    desp: 'vue-quill',
    link: '',
  },

  {
    title: 'CSS 预编译',
    desp: 'Less',
    link: '',
  },

  {
    title: 'HTTP 工具',
    desp: 'Axios',
    link: '',
  },

  {
    title: 'Git Hook 工具',
    desp: 'husky',
    link: '',
  },

  {
    title: '代码规范',
    desp: 'EditorConfig + Prettier + ESLint',
    link: '',
  },

  {
    title: '提交规范',
    desp: 'Commitizen + Commitlint',
    link: '',
  },
])
const highlightjs = shallowRef(hljsVuePlugin.component)
const tree = ref(
  `
src
├─ App.vue
├─ assets
│    ├─ css
│    │    ├─ base.css
│    │    ├─ eleuser.css
│    │    └─ normalize.css
│    ├─ fonts
│    │    ├─ demo.css
│    │    ├─ demo_fontclass.html
│    │    ├─ demo_symbol.html
│    │    ├─ demo_unicode.html
│    │    ├─ iconfont.css
│    │    ├─ iconfont.eot
│    │    ├─ iconfont.js
│    │    ├─ iconfont.svg
│    │    ├─ iconfont.ttf
│    │    └─ iconfont.woff
│    └─ img
│           └─ logo.png
├─ common
│    ├─ city_data2017_element.d.ts
│    ├─ city_data2017_element.js
│    ├─ regDate.d.ts
│    └─ regDate.js
├─ components
│    ├─ Home.vue
│    ├─ Login.vue
│    ├─ Welcome.vue
│    ├─ goods
│    │    ├─ AddGoods.vue
│    │    ├─ Categories.vue
│    │    ├─ Goods.vue
│    │    └─ Params.vue
│    ├─ orders
│    │    └─ Orders.vue
│    ├─ power
│    │    ├─ Rights.vue
│    │    └─ Roles.vue
│    ├─ reports
│    │    └─ Reports.vue
│    └─ user
│           └─ Users.vue
├─ main.ts
├─ router
│    └─ index.ts
└─ shims-vue.d.ts`,
)
const depData = ref([
  {
    name: 'vue',
    description: '^3.0.0',
  },
  {
    name: 'vue-router',
    description: '^4.0.0-0',
  },
  {
    name: 'vue-axios',
    description: '^3.2.5',
  },
  {
    name: 'axios',
    description: '^0.21.1',
  },
  {
    name: 'element-plus',
    description: '^1.1.0-beta.5',
  },

  {
    name: 'nprogress',
    description: '^0.2.0',
  },

  {
    name: 'lodash.merge',
    description: '^4.6.2',
  },
  {
    name: 'husky',
    description: '^7.0.2',
  },
  {
    name: 'echarts',
    description: '^5.1.2',
  },

  {
    name: '@vueup/vue-quill',
    description: '^1.0.0-beta.7',
  },
  {
    name: '@highlightjs/vue-plugin',
    description: 'github:highlightjs/vue-plugin',
  },
  {
    name: 'core-js',
    description: '^^3.6.5',
  },
])
</script>

<style lang="less" scoped>
.welcome {
  :deep(el-card) {
    padding-top: 0;
  }
  .about {
    .git-title {
      margin-top: 10px;
    }
  }

  .tech-stack {
    .tech-title {
      display: inline-block;
      width: 120px;

      height: 30px;
      line-height: 30px;
    }
  }
  .projTree {
    background-color: #f0f0f0;
    padding: 30px;
  }
  .dependency {
    margin-bottom: 20px;
    font-size: medium;
  }
}
.welcome:deep(.el-card) {
  padding-top: 0;
}
</style>
