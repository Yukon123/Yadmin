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
          <el-input placeholder="请输入内容" v-model.trim="getOrderParams.query" clearable @change="queryOrder">
            <template #append> <el-button icon="el-icon-search"></el-button></template>
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
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress">修改地址</el-button>
            <el-button type="success" icon="el-icon-location-outline" size="mini" @click="editOrder(row)"
              >修改订单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalOrder"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" v-model="editAddressShow" width="70%" @close="cancelAddress">
      <el-form :model="editAddressForm" :rules="editAddressRules" ref="editAddressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="county">
          <el-cascader :options="cityOptions" v-model="editAddressForm.county"> </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="editAddressForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelAddress">取 消</el-button>
          <el-button type="primary" @click="comfirmAddress">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改订单" v-model="editOrderVisible" width="70%" @close="closeEditOrders">
      <el-form :model="editOrderForm" :rules="editOrderRules" ref="editOrdersRef" label-width="100px">
        <el-form-item label="订单编号" prop="order_number">
          <el-input v-model="editOrderForm.order_number"></el-input>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model.number="editOrderForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="是否付款" prop="pay_status">
          <el-input v-model="editOrderForm.pay_status"></el-input>
        </el-form-item>
        <el-form-item label="是否发货" prop="is_send">
          <el-input v-model.number="editOrderForm.is_send"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditOrders">取 消</el-button>
          <el-button type="primary" @click="comfirmEditOrders">确 定</el-button>
        </span>
      </template></el-dialog
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed } from 'vue'
import { ElMessage } from 'element-plus'
const axios: any = inject('axios')
import { formatDate } from '@/common/regDate'
import cityOptions from '@/common/city_data2017_element'

// 分页器

const currentPage = computed({
  get: () => getOrderParams.value.pagenum,
  set: (page: number) => {
    getOrderParams.value.pagenum = page
    getOrderList()
  },
})
const pageSize = computed({
  get: () => getOrderParams.value.pagesize,
  set: (size: number) => {
    getOrderParams.value.pagesize = size
    getOrderList()
  },
})
//获取订单列表
const getOrderParams = ref({
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
})
const orderList: any = ref([])
const totalOrder = ref(0)
const getOrderList = async () => {
  const { data: res } = await axios
    .get('orders', {
      params: getOrderParams.value,
    })
    .catch((err: any) => console.log(err))
  if (res.meta.status !== 200) {
    return ElMessage.error(res.meta.msg)
  }
  orderList.value = res.data.goods
  totalOrder.value = res.data.total
  orderList.value.forEach((value: any) => {
    const date = new Date(value.create_time)
    value.create_time = formatDate(date, 'yyyy-MM-dd hh:mm:ss')
  })
  console.log('列表', orderList.value)
}
getOrderList()

// 查询订单
const queryOrder = () => {
  console.log(getOrderParams.value.query)
  getOrderList()
}

// 修改地址
const editAddressShow = ref(false)
const editAddress = () => {
  editAddressShow.value = true
}
const editAddressForm = ref({
  county: [''],
  detail: '',
})
const editAddressRules = ref({
  county: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
  detail: [{ required: true, message: '请输入详细地址f', trigger: 'blur' }],
})
const comfirmAddress = async () => {
  ElMessage.success('修改地址成功')
  editAddressShow.value = false
}
const editAddressRef: any = ref(null)
const cancelAddress = () => {
  editAddressRef.value.resetFields()
  editAddressShow.value = false
}

// 修改订单

const editOrderForm = ref({
  user_id: 0,
  order_id: 0,
  order_number: '',
  order_price: 0,
  order_pay: '',
  is_send: '',
  pay_status: '',
})
const editOrderVisible = ref(false)
const editOrderRules = ref({
  order_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
  order_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  order_pay: [{ required: true, message: '请输入支付方式', trigger: 'blur' }],
  pay_status: [{ required: true, message: '请输入支付状态', trigger: 'blur' }],
  is_send: [{ required: true, message: '请输入发货状态', trigger: 'blur' }],
})
const editOrdersRef: any = ref(null)
const editOrder = async (row: any) => {
  editOrderVisible.value = true
  const { data: res } = await axios.get(`orders/${row.order_id}`).catch((err: any) => console.log(err))
  editOrderForm.value = res.data
}
const comfirmEditOrders = async () => {
  console.log('请求参数', editOrderForm.value)
  const { data: res } = await axios
    .put(`orders/${editOrderForm.value.order_id}`, editOrderForm.value)
    .catch((err: any) => console.log(err))
  console.log('确认修改', res)

  ElMessage.success('更新订单成功')
  getOrderList()

  editOrderVisible.value = false
}
const closeEditOrders = () => {
  editOrdersRef.value.resetFields()
  editOrderVisible.value = false
}
</script>
<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>
