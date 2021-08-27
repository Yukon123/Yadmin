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
      <!-- <el-table
        :data="cateData"
        border
        style="width: 100%"
        stripe
        row-key="cat_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180"> </el-table-column>
        <el-table-column prop="address" label="是否有效"> </el-table-column>
        <el-table-column prop="cat_level" label="排序" width="180"> <el-tag>一级</el-tag> </el-table-column>
        <el-table-column prop="address" label="操作">
          <el-button type="primary"> <i class="el-icon-edit"></i><span>编辑</span></el-button>
          <el-button type="danger"><i class="el-icon-delete"></i><span>删除</span></el-button>
        </el-table-column>
      </el-table> -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="5"
        layout="total,prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> -->
      <tree-table
        class="tree-table"
        :data="cateData"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
        :show-row-hover="false"
        ><template #isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" :style="{ color: 'lightGreen' }"></i>
          <i class="el-icon-error" v-else :style="{ color: 'red' }"></i>
        </template>
        <template #order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <template #movement="scope">
          <el-button type="primary" size="mini" @click="editCate(scope.row.cat_id)">
            <i class="el-icon-edit"></i><span>编辑</span></el-button
          >
          <el-button type="danger" size="mini" @click="deleteCate(scope.row.cat_id)"
            ><i class="el-icon-delete"></i><span>删除</span></el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="getDataParam.pagesize"
        :current-page="getDataParam.pagenum"
        layout="total,sizes,prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" v-model:visible="addCatedialogVisible" width="50%" @close="addCateDialogClose">
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
      <span #"footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'categories',
  components: {},
  props: {},
  data() {
    return {
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' },
        ],
      },
      getDataParam: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      cateData: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'movement',
        },
      ],
      addCatedialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      parentCateList: [], //父级节点数据
      selectedKey: [], // 选中数据
      cascaderProp: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
    }
  },
  watch: {},
  computed: {},
  methods: {
    async getCateData() {
      let { data: res } = await axios.get('categories', {
        params: getDataParam,
      })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取商品分类失败')
      }
      cateData = res.data.result
      total = res.data.total
      console.log('cateData', cateData)
    },
    handleSizeChange(size) {
      getDataParam.pagesize = size
      getCateData()
    },
    handleCurrentChange(page) {
      getDataParam.pagenum = page
      getCateData()
    },
    //添加分类表单对话框
    addCateDialogClose() {
      .addCateFormRef.resetFields()
      selectedKey = []
    },
    addCate() {
      addCatedialogVisible = true
      getParentCateList()
    },
    confirmAddCate() {
      //预校验
      .addCateFormRef.validate(async (valid) => {
        if (!valid) {
          ElMessage.error('请输入分类名称')
          return
        }
        let { data: res } = await axios.post('categories', addCateForm)
        if (res.meta.status !== 201) {
          return ElMessage.error('添加分类失败')
        }
        ElMessage.success('添加分类成功')
        console.log(res)
        console.log(addCateForm)
        getCateData()
        addCatedialogVisible = false
      })
    },
    async getParentCateList() {
      let { data: res } = await axios.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取父级分类失败')
      }
      parentCateList = res.data
      console.log('父级节点', parentCateList)
    },
    handleCascaderChange() {
      if (selectedKey.length > 0) {
        addCateForm.cat_pid = selectedKey[selectedKey.length - 1]
        addCateForm.cat_level = selectedKey.length
      } else {
        addCateForm.cat_pid = 0
        addCateForm.cat_level = 0
      }
    },
    //删除编辑分类
    editCate(id) {
      console.log('点击了')
      console.log(id)
    },
    async deleteCate(id) {
      console.log(id)
      let result = await ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      console.log(result)
      if (result != 'confirm') {
        ElMessage({ type: 'info', message: '已取消删除' })
      } else {
        let { data: res } = await axios.delete('categories/' + id)
        console.log(res)
        if (res.meta.status !== 200) {
          return ElMessage({ type: 'danger', message: '删除失败' })
        } else ElMessage({ type: 'success', message: '删除成功' })
        getCateData()
      }
    },
  },
  created() {
    getCateData()
  },
  mounted() {},
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
