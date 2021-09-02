<template>
  <div class="add-goods">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps :space="200" :active="+activeIndex" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addGoodForm" :rules="addGoodRules" ref="addGoodFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabsLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addGoodForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addGoodForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addGoodForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat_arr">
              <el-cascader
                :options="casCateList"
                :props="casCartListProps"
                clearable
                v-model="addGoodForm.goods_cat_arr"
                @change="hasSelected"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyParamsList" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals_arr" border>
                <el-checkbox v-for="(value, index) in item.checkName" :key="index" :label="value" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyAttrList" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="imgPreview"
              :on-remove="imgRemove"
              :on-success="imgSuccess"
              :headers="loadHeader"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip><div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div></template>
            </el-upload>
            <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <template #tip><div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div></template>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodForm.goods_introduce" scrollingContainer="xx" />
            <el-button type="primary" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="预览图片" v-model="priviewShow" width="40%" @close="closePreview">
      <img :src="priviewURL" alt="" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router/index'
import { ref, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const axios: any = inject('axios')

//当前活跃的tab页面
const activeIndex = ref('0')

// 获取级联分类列表
const casCartListProps = ref({
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
})
const casCateList = ref([])
const getCateList = async () => {
  let { data: res } = await axios.get('categories').catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取分类数据失败')
  }
  casCateList.value = res.data
}
getCateList()

// 选择分类获取商品参数
const addGoodForm = ref({
  goods_name: '',
  goods_cat_arr: [],
  goods_price: 0,
  goods_number: 0,
  goods_weight: 0,
  goods_introduce: '',
  pics: [{ pic: '1' }],
  attrs: [{ a: '1' }],
  goods_cat: '',
})
const attrID = ref(0)
const manyParamsList: any = ref([])
const onlyAttrList: any = ref([])
const hasSelected = () => {
  if (addGoodForm.value.goods_cat_arr.length !== 3) {
    addGoodForm.value.goods_cat_arr.length = 0
  } else {
    attrID.value = addGoodForm.value.goods_cat_arr[addGoodForm.value.goods_cat_arr.length - 1]
    getGoodParams('many', manyParamsList.value)
    getGoodParams('only', onlyAttrList.value)
  }
}
const getGoodParams = async (type: any, typeList: any) => {
  let { data: res } = await axios
    .get(`categories/${attrID.value}/attributes`, { params: { sel: type } })
    .catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取商品参数失败')
  }

  res.data.forEach((item: any) => {
    if (item.attr_vals.length === 0) {
      item.attr_vals_arr = []
      item.checkName = []
      return
    } else {
      item.attr_vals_arr = item.attr_vals.split(',')
      item.checkName = item.attr_vals.split(',')
    }
  })
  typeList.length = 0
  typeList.push(...res.data)
}
const beforeTabsLeave = (newTab: any, oldTab: any) => {
  if (oldTab == '0' && addGoodForm.value.goods_cat_arr.length === 0) {
    ElMessage.error('请选择分类')
    return false
  }
}

// 图片预览 上传图片
const uploadURL = ref('http://39.108.224.26:5000/api/private/v1/upload')
const loadHeader = ref({ Authorization: window.sessionStorage.getItem('token') })
const priviewShow = ref(false)
const priviewURL = ref('')
const imgPreview = (file: any) => {
  priviewURL.value = file.response.data.url
  priviewShow.value = true
}
const closePreview = () => {
  priviewShow.value = false
  priviewURL.value = ''
}
const imgRemove = (file: any) => {
  const i = addGoodForm.value.pics.findIndex((item: any) => item.pic === file.response.data.tmp_path)
  addGoodForm.value.pics.splice(i, 1)
}
const imgSuccess = (res: any) => {
  let foo = { pic: res.data.tmp_path }
  addGoodForm.value.pics.push(foo)
}

// 添加商品
const addGoodFormRef: any = ref(null)
const addGoodRules = ref({
  goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goods_price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
  goods_weight: [{ required: true, message: '重量不能为空', trigger: 'blur' }],
  goods_number: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  goods_cat_arr: [{ required: true, message: '请选择分类', trigger: 'blur' }],
})
const addGood = () => {
  addGoodFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return ElMessage.error('请填写必要的表单项')
    } else {
      addGoodForm.value.goods_cat = addGoodForm.value.goods_cat_arr.join(',')
      addGoodForm.value.attrs.push(...onlyAttrList.value)
      addGoodForm.value.attrs.push(...manyParamsList.value)
      await axios.post('goods', addGoodForm.value).catch((err: any) => err)
      ElMessage.success('添加商品成功')
      router.push('/goods')
    }
  })
}
</script>
<style lang="less" scoped>
.add-goods :deep(.el-checkbox) {
  margin: 0 10px 0 0 !important;
}
.add-goods :deep(.el-dialog) {
  img {
    width: 100%;
  }
}

.add-goods :deep(.ql-container) {
  height: 300px;
}

.add-goods :deep(.el-button) {
  margin-top: 20px;
}
</style>
