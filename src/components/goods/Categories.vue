<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="cateData"
        stripe
        style="width: 100%"
        row-key="cat_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="cat_name" label="分类名称" width="180"> </el-table-column>
        <el-table-column prop="isok" label="是否有效" width="180">
          <template #default="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" :style="{ color: 'lightGreen' }"></i>
            <i class="el-icon-error" v-else :style="{ color: 'red' }"></i>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序">
          <template #default="scope">
            <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
            <el-tag type="warning" v-else size="mini">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="movement" label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="editCate(scope.row.cat_id)">
              <i class="el-icon-edit"></i><span>编辑</span></el-button
            >
            <el-button type="danger" size="mini" @click="deleteCate(scope.row.cat_id)"
              ><i class="el-icon-delete"></i><span>删除</span></el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[3, 5, 10, 15]"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" v-model="addCatedialogVisible" width="50%" @close="addCateDialogClose">
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="120px" :rules="addCateFormRules">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKey"
            :options="parentCateList"
            @change="handleCascaderChange"
            :props="cascaderProp"
            :style="{ width: '100%' }"
            clearable
            placeholder="请选择分类"
            ref="cascaderRef"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑分类" v-model="editorDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="90px" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editorDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const axios: any = inject('axios')

// 获取分类
const getDataParam = ref({
  type: 3,
  pagenum: 1,
  pagesize: 5,
})
const cateData = ref([])
const total = ref(0)
const getCateData = async () => {
  let { data: res } = await axios
    .get('categories', {
      params: getDataParam.value,
    })
    .catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取商品分类失败')
  }
  cateData.value = res.data.result
  total.value = res.data.total
}
getCateData()

// 分页器
const currentPage = computed({
  get: () => getDataParam.value.pagenum,
  set: (val: number) => {
    getDataParam.value.pagenum = val
    getCateData()
  },
})
const pageSize = computed({
  get: () => getDataParam.value.pagesize,
  set: (val: number) => {
    getDataParam.value.pagesize = val
    getCateData()
  },
})

// 添加分类
const addCatedialogVisible = ref(false)
const parentCateList = ref([]) //父级节点数据
const cascaderProp = ref({
  checkStrictly: true,
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
})
const selectedKey = ref([]) // 选中数据
const addCateForm = ref({
  cat_pid: 0,
  cat_name: '',
  cat_level: 0,
})
const addCateFormRules = ref({
  cat_name: [
    { required: true, message: '请输入分类名', trigger: 'blur' },
    { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' },
  ],
})
const addCateFormRef: any = ref(null)
const addCate = () => {
  addCatedialogVisible.value = true
  getParentCateList()
}
const getParentCateList = async () => {
  let { data: res } = await axios.get('categories', { params: { type: 2 } }).catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取父级分类失败')
  }
  parentCateList.value = res.data
}
const handleCascaderChange = () => {
  if (selectedKey.value.length > 0) {
    addCateForm.value.cat_pid = selectedKey.value[selectedKey.value.length - 1]
    addCateForm.value.cat_level = selectedKey.value.length
  } else {
    addCateForm.value.cat_pid = 0
    addCateForm.value.cat_level = 0
  }
}
const confirmAddCate = () => {
  addCateFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return ElMessage.error('请输入分类名称')
    }
    let { data: res } = await axios.post('categories', addCateForm.value).catch((err: any) => err)
    if (res.meta.status !== 201) {
      return ElMessage.error('添加分类失败')
    }
    ElMessage.success('添加分类成功')
    getCateData()
    addCatedialogVisible.value = false
  })
}
const addCateDialogClose = () => {
  addCateFormRef.value.resetFields()
  selectedKey.value = []
}

// 删除分类
const deleteCate = async (id: number) => {
  let result = await ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch((err) => err)
  if (result != 'confirm') {
    ElMessage({ type: 'info', message: '已取消删除' })
  } else {
    let { data: res } = await axios.delete('categories/' + id).catch((err: any) => err)
    if (res.meta.status !== 200) {
      return ElMessage({ type: 'warning', message: '删除失败' })
    } else ElMessage({ type: 'success', message: '删除成功' })
    getCateData()
  }
}
// 编辑分类
const editForm = ref({ cat_name: '', cat_id: 0 })
const editFormRef = ref(null) as any
const editorDialogVisible = ref(false)
const editFormRule = ref({
  cat_name: [
    { required: true, message: '请输入分类名', trigger: 'blur' },
    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
  ],
})
const editDialogClose = () => {
  editFormRef.value.resetFields()
}
const editCate = async (id: number) => {
  const { data: res } = await axios.get('categories/' + id).catch((err: any) => err)
  if (res.meta.status !== 200) return ElMessage.error('查询分类失败')
  editorDialogVisible.value = true
  editForm.value = res.data
}
const updateCate = () => {
  editFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const { data: res } = await axios
        .put('categories/' + editForm.value.cat_id, editForm.value)
        .catch((err: any) => err)
      if (res.meta.status !== 200) return ElMessage.warning('更新分类失败')
      else {
        ElMessage.success('更新分类成功')
        getCateData()
        editorDialogVisible.value = false
      }
    }
  })
}
</script>
<style scoped>
.el-button span {
  margin-left: 10px;
}
.tree-table {
  margin-top: 15px;
}
</style>
