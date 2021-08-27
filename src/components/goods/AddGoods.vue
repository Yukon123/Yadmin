<template>
  <div class="add-goods">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addGoodForm" :rules="addGoodRules" ref="addGoodFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabsLeave" @tab-click="changeTabs">
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
              <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
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
              <div #"tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" #"tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodForm.goods_introduce" />
            <el-button type="primary" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="预览图片" v-model:visible="priviewShow" width="50%" @close="closePreview">
      <img :src="priviewURL" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'AddGoods',
  components: {},
  props: {},
  data() {
    return {
      activeIndex: '0',
      addGoodForm: {
        goods_name: '',
        goods_cat_arr: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
        goods_cat: '',
      },
      addGoodRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '重量不能为空', trigger: 'blur' }],
        goods_number: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        goods_cat_arr: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      },
      casCateList: [],
      casCartListProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedKey: [],
      attrID: 0,
      manyParamsList: [],
      onlyAttrList: [],
      manyCheckName: [],
      onlyCheckName: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      loadHeader: { Authorization: window.sessionStorage.getItem('token') },
      priviewShow: false,
      priviewURL: '',
    }
  },
  watch: {},
  computed: {},
  methods: {
    changeTabs() {
      // switch (activeIndex) {
      //   case '1':
      //     getGoodParams('many', manyParamsList)
      //     console.log('1111')
      //     break
      //   case '2':
      //     getGoodParams('only', onlyAttrList)
      //     console.log('2222')
      //     break
      // }
    },
    onlyChange() {
      console.log(onlyAttrList)
    },
    tabClick(index) {
      console.log(value)
    },
    async getCateList() {
      let { data: res } = await axios.get('categories')
      if (res.meta.status !== 200) {
        return ElMessage.error('获取分类数据失败')
      }
      console.log('级联选择项', res)
      casCateList = res.data
    },
    hasSelected() {
      if (addGoodForm.goods_cat_arr.length !== 3) {
        addGoodForm.goods_cat_arr.length = 0
      } else {
        attrID = addGoodForm.goods_cat_arr[addGoodForm.goods_cat_arr.length - 1]
        getGoodParams('many', manyParamsList)
        getGoodParams('only', onlyAttrList)
      }
    },
    beforeTabsLeave(newTab, oldTab) {
      if (oldTab == '0' && addGoodForm.goods_cat_arr.length === 0) {
        ElMessage.error('请选择分类')
        return false
      }
    },

    async getGoodParams(type, typeList) {
      let { data: res } = await axios.get(`categories/${attrID}/attributes`, { params: { sel: type } })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取商品参数失败')
      }

      res.data.forEach((item) => {
        if (item.attr_vals.length === 0) {
          item.attr_vals_arr = []
          item.checkName = []
          return
        } else {
          item.attr_vals_arr = item.attr_vals.split(',')
          item.checkName = item.attr_vals.split(',')
        }
      })
      // typeList = res.data
      typeList.length = 0
      typeList.push(...res.data)
      console.log(type, typeList)
    },
    imgPreview(file) {
      console.log(file)
      priviewURL = file.response.data.url
      priviewShow = true
    },
    closePreview() {
      priviewShow = false
      priviewURL = ''
    },
    imgRemove(file) {
      console.log(file)
      const i = addGoodForm.pics.findIndex((item) => item.pic === file.response.data.tmp_path)
      addGoodForm.pics.splice(i, 1)
      console.log('删除成功数组', addGoodForm.pics)
    },
    imgSuccess(res) {
      let foo = { pic: res.data.tmp_path }
      addGoodForm.pics.push(foo)
      console.log('上传成功数组', addGoodForm.pics)
    },
    addGood() {
      let arr = _.cloneDeep(addGoodForm)
      console.log('深拷贝', arr).addGoodFormRef.validate(async (valid) => {
        if (!valid) {
          return ElMessage.error('请填写必要的表单项')
        } else {
          addGoodForm.goods_cat = addGoodForm.goods_cat_arr.join(',')
          addGoodForm.attrs.push(...onlyAttrList)
          addGoodForm.attrs.push(...manyParamsList)
          console.log(addGoodForm)
          let { data: res } = await axios.post('goods', addGoodForm)
          console.log(res)
          if (res.meta.status !== 201) {
            return ElMessage.error(res.meta.msg)
          } else {
            // .addGoodFormRef.resetFileds()
            ElMessage.success(res.meta.msg)
            $router.push('/goods')
          }
        }
      })
    },
  },
  created() {
    getCateList()
  },
  mounted() {},
}
</script>
<style lang="less" scoped>
.add-goods ::v-deep .el-checkbox {
  margin: 0 10px 0 0 !important;
}
.add-goods ::v-deep.el-dialog {
  img {
    width: 100%;
  }
}

.add-goods ::v-deep.ql-container.ql-snow {
  height: 300px;
}
.add-goods ::v-deep.el-button {
  margin-top: 20px;
}
</style>
