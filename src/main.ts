/* eslint-disable no-undef */
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VueAxios from 'vue-axios'
import axios from 'axios'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import './assets/css/base.css'
import './assets/fonts/iconfont.css'

import '@vueup/vue-quill/dist/vue-quill.snow.css'

import App from './App.vue'
import router from './router'

axios.defaults.baseURL = 'http://39.108.224.26:5000/api/private/v1'

axios.interceptors.request.use((config) => {
  Nprogress.start()
  if (window.sessionStorage.getItem('token')) {
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }

  return config
})
axios.interceptors.response.use((res) => {
  Nprogress.done()
  return res
})
const app = createApp(App)
app
  .use(router)
  .use(ElementPlus, { size: 'small', zIndex: 3000 })
  .use(VueAxios, axios)

  .provide('axios', app.config.globalProperties.axios)
  .mount('#app')
