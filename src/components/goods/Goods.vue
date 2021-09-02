<template>
  <div class="">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="getGoodsParams.query" clearable autofocus="true">
            <template #append>
              <el-button icon="el-icon-search" @click="searchGoods"></el-button>
            </template> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180"> </el-table-column>
        <el-table-column #default="scope" label="操作" width="130">
          <el-button type="primary" size="mini" @click="editGoods(scope.row)" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" @click="deleteGoods(scope.row)" icon="el-icon-delete"></el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="paginSizeChange"
        @current-change="paginCurrentChange"
        :current-page="getGoodsParams.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="getGoodsParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        background
      >
      </el-pagination>
    </el-card>
    <el-dialog title="预览图片" v-model="priviewShow" width="40%" @close="closePreview">
      <img :src="priviewURL" alt="" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router/index'
import { ref, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/common/regDate.js'
const axios: any = inject('axios')

// 跳到添加页面
const goAddPage = () => {
  router.push('/goods/addgoods')
}

// 获取商品列表
const goodsList = ref([])
const totalPage = ref(0)
const getGoodsParams = ref({
  query: '',
  pagenum: 1,
  pagesize: 10,
})
const getGoodsList = async () => {
  let { data: res } = await axios
    .get('goods', {
      params: getGoodsParams.value,
    })
    .catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取商品列表数据失败')
  } else {
    res.data.goods.forEach((item: any) => {
      item.add_time = formatTime(item.add_time)
    })
    totalPage.value = res.data.total
    goodsList.value = res.data.goods
  }
}
getGoodsList()

// 页码跳转
const paginSizeChange = (size: number) => {
  getGoodsParams.value.pagesize = size
  getGoodsList()
}
const paginCurrentChange = (page: number) => {
  getGoodsParams.value.pagenum = page
  getGoodsList()
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}

// 删除编辑商品
const priviewShow = ref(false)
const priviewURL = ref('')
const closePreview = () => {
  priviewShow.value = false
  priviewURL.value = ''
}
const searchGoods = () => {
  if (!getGoodsParams.value.query) {
    return
  }

  getGoodsParams.value.query.trim()
  getGoodsList()
}
const deleteGoods = async (row: any) => {
  let result = await ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch((err) => err)
  if (result !== 'confirm') {
    ElMessage.info('已取消删除')
  } else {
    let { data: res } = await axios.delete('goods/' + row.goods_id).catch((err: any) => err)

    if (res.meta.status !== 200) {
      return ElMessage.error('删除商品失败')
    } else {
      ElMessage.success('删除商品成功')
      getGoodsList()
    }
  }
}
const editGoods = async (row: any) => {
  let { data: res } = await axios.get('goods/' + row.goods_id).catch((err: any) => err)

  priviewURL.value = res.data.pics[0].pics_mid_url

  priviewShow.value = true
}
</script>
<style scoped></style>
