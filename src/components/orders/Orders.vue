<template>
  <div class="order">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="getOrderParams.query" clearable @change="queryOrder">
            <el-button #"append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="90"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180"> </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrder(row)"></el-button>
            <el-button type="success" icon="el-icon-location-outline" size="mini" @click="transInfo(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="pagSizeChange"
        @current-change="pagCurrentChange"
        :current-page="getOrderParams.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalOrder"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" v-model:visible="editDialogShow" width="70%" @close="closeEditDialog">
      <el-form :model="editAddressForm" :rules="editAddressRules" ref="editAddressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="county">
          <el-cascader :options="cityOptions" :value="editAddressForm.county" @change="changeCounty"> </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="editAddressForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <span #"footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流进度" v-model:visible="transportdialogVisible" width="50%" @close="transportDialogClose">
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/common/regDate'
import cityOptions from '@/common/city_data2017_element'

export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      getOrderParams: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: '',
      },
      orderList: [],
      totalOrder: 0,
      editDialogShow: false,
      cityOptions: cityOptions,
      editAddressForm: {
        county: [],
        detail: '',
      },
      editAddressRules: {
        county: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入详细地址f', trigger: 'blur' }],
      },
      transportdialogVisible: false,
    }
  },
  watch: {},
  computed: {},
  methods: {
    async getOrderList() {
      const { data: res } = await axios.get('orders', {
        params: getOrderParams,
      })
      console.log('获取订单结果', res)
      if (res.meta.status !== 200) {
        return ElMessage.error(res.meta.msg)
      }
      orderList = res.data.goods
      totalOrder = res.data.total
      res.data.goods.forEach((value) => {
        const date = new Date(value.create_time)
        value.create_time = formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      })
      console.log('订单列表', orderList)
    },
    pagSizeChange(size) {
      getOrderParams.pagesize = size
      getOrderList()
    },
    pagCurrentChange(page) {
      getOrderParams.pagenum = page
      getOrderList()
    },
    queryOrder() {
      console.log('4444', getOrderParams.query)
      if (!getOrderParams.query) {
        return
      }
      console.log('1111')
      console.log(getOrderParams.query.trim())
      getOrderParams.query.trim()
      getOrderList()
    },
    editOrder(row) {
      editDialogShow = true
    },
    closeEditDialog() {
      .editAddressRef.resetFields()
      editDialogShow = false
    },
    changeCounty() {},
    transInfo(row) {
      console.log(row)
      transportdialogVisible = true
      // let { data: res } = await axios.get('/kuaidi/' + 1106975712662)
      // console.log(res)
    },
    transportDialogClose() {
      transportdialogVisible = false
    },
  },
  created() {
    getOrderList()
  },
  mounted() {},
}
</script>
<style scoped>
.el-cascader {
  width: 100%;
}
</style>
