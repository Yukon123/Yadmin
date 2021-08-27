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
            <el-button #"append" icon="el-icon-search" @click="searchGoods"></el-button> </el-input
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
    <el-dialog title="预览图片" v-model:visible="priviewShow" width="50%" @close="closePreview">
      <img :src="priviewURL" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/common/regDate'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      goodsList: [],
      getGoodsParams: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      totalPage: 0,
      priviewShow: false,
      priviewURL: '',
    }
  },
  watch: {},
  computed: {},
  methods: {
    closePreview() {
      priviewShow = false
      priviewURL = ''
    },
    async getGoodsList() {
      let { data: res } = await axios.get('goods', {
        params: getGoodsParams,
      })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取商品列表数据失败')
      } else {
        res.data.goods.forEach((item) => {
          item.add_time = formatTime(item.add_time)
        })
        totalPage = res.data.total
        goodsList = res.data.goods
        // console.log("商品列表,"goodsList)
      }
    },
    formatTime(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    paginSizeChange(size) {
      getGoodsParams.pagesize = size
      getGoodsList()
    },
    paginCurrentChange(page) {
      getGoodsParams.pagenum = page
      getGoodsList()
    },
    searchGoods() {
      console.log('4444', getGoodsParams.query)
      if (!getGoodsParams.query) {
        return
      }
      console.log('1111')
      console.log(getGoodsParams.query.trim())
      getGoodsParams.query.trim()
      getGoodsList()
    },
    async deleteGoods(row) {
      console.log(row)
      console.log(row.goods_id)
      let result = await ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (result !== 'confirm') {
        ElMessage.info('已取消删除')
      } else {
        let { data: res } = await axios.delete('goods/' + row.goods_id)
        console.log(res)
        if (res.meta.status !== 200) {
          return ElMessage.error('删除商品失败')
        } else {
          ElMessage.success('删除商品成功')
          getGoodsList()
        }
      }
    },
    async editGoods(row) {
      console.log(row)
      let { data: res } = await axios.get('goods/' + row.goods_id)
      console.log(res)
      priviewURL = res.data.pics[0].pics_mid_url
      console.log(priviewURL)
      priviewShow = true
    },
    goAddPage() {
      $router.push('/goods/addgoods')
    },
  },
  created() {
    $nextTick(() => {
      getGoodsList()
    })
  },
  mounted() {},
}
</script>
<style scoped></style>
