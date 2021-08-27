<template>
  <div class="">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="  注意: 只允许为第三级别分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            :options="casCateList"
            :props="casCartListProps"
            clearable
            @change="cascaderChange"
            v-model="selectedKey"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTabName" @tab-click="tabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="addForm">添加参数</el-button>
          <el-table :data="manyTableData" stripe style="width: 100%" border expand-change>
            <el-table-column type="expand" label="">
              <template #default="scope">
                <el-tag
                  v-for="(value, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTag(scope.row, index)"
                  >{{ value }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.isShowInput"
                  v-model="scope.row.inputValue"
                  ref="tagInputRef"
                  size="small"
                  @keyup.enter.native="tagInputConfirm(scope.row)"
                  @blur="tagInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="530"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" size="mini" @click="editParams(scope.row)"
                  ><i class="el-icon-edit"></i><span> 修改</span></el-button
                >
                <el-button type="danger" size="mini" @click="deleteParams(scope.row)"
                  ><i class="el-icon-delete"></i><span> 删除</span></el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="addForm">添加属性</el-button>
          <el-table :data="onlyTableData" stripe style="width: 100%" border expand-change>
            <el-table-column type="expand" label="">
              <template #default="scope">
                <el-tag
                  v-for="(value, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTag(scope.row, index)"
                  >{{ value }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.isShowInput"
                  v-model="scope.row.inputValue"
                  ref="tagInputRef"
                  size="small"
                  @keyup.enter.native="tagInputConfirm(scope.row)"
                  @blur="tagInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="530"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" size="mini" @click="editParams(scope.row)"
                  ><i class="el-icon-edit"></i><span> 修改</span></el-button
                >
                <el-button type="danger" size="mini" @click="deleteParams(scope.row)"
                  ><i class="el-icon-delete"></i><span> 删除</span></el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="dialogTitle" v-model:visible="formVisible" width="50%" @close="colseForm">
      <el-form :model="formData" :rules="addFormRules" ref="formRef" label-width="100px">
        <el-form-item :label="titleTail" prop="attr_name">
          <el-input v-model="formData['attr_name']"></el-input>
        </el-form-item>
      </el-form>
      <span #"footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog title="添加静态属性" :visible.sync="addOnlyDialogVisible" width="50%" @close="colseOnlyForm">
      <el-form :model="addOnlyData" :rules="addOnlyRules" ref="addOnlyRef" label-width="100px">
        <el-form-item label="静态属性" prop="only">
          <el-input v-model="addOnlyData.value"></el-input>
        </el-form-item>
      </el-form>
      <span #"footer" class="dialog-footer">
        <el-button @click="addOnlyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddAttr">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      casCateList: [],
      casCartListProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedKey: [],
      activeTabName: 'many',
      manyTableData: [],
      onlyTableData: [],
      formVisible: false,
      formData: { attr_name: '', attr_sel: 'many', attr_vals: '' },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
      attrId: 0,
      cateId: 0,
      titleHead: '',
      editAbleTag: false,
    }
  },
  watch: {},
  computed: {
    isDisabled() {
      return selectedKey.length !== 3
    },
    titleTail() {
      if (activeTabName === 'many') return '动态参数'
      else return '静态属性'
    },
    dialogTitle() {
      return titleHead + titleTail
    },
  },
  methods: {
    async getCateList() {
      let { data: res } = await axios.get('categories')
      if (res.meta.status !== 200) {
        return ElMessage.error('获取分类数据失败')
      }
      console.log('级联选择项', res)
      casCateList = res.data
    },

    cascaderChange() {
      getParamsList()
    },
    tabsClick() {
      formData.attr_sel = activeTabName
      console.log(formData.attr_sel)
      getParamsList()
    },
    async getParamsList() {
      if (selectedKey.length !== 3) {
        selectedKey = []
        manyTableData = []
        onlyTableData = []
        return
      }
      attrId = selectedKey[selectedKey.length - 1]
      let { data: res } = await axios.get(`categories/${attrId}/attributes`, {
        params: { sel: activeTabName },
      })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取参数信息失败')
      }
      console.log('改造前', JSON.parse(JSON.stringify(res.data)))
      console.log('改造后', res.data)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.isShowInput = false
        item.inputValue = ''
      })
      if (activeTabName === 'many') {
        manyTableData = res.data
      } else {
        onlyTableData = res.data
      }
    },
    async editParams(params) {
      let { data: res } = await axios.get(`categories/${params.cat_id}/attributes/${params.attr_id}`)
      if (res.meta.status !== 200) {
        return ElMessage.error('获取参数名称失败')
      }
      formData.attr_name = res.data.attr_name
      titleHead = '修改'
      formVisible = true
      cateId = params.cat_id
      attrId = params.attr_id
      editAbleTag = true
    },
    async deleteParams(params) {
      cateId = params.cat_id
      attrId = params.attr_id
      let tag = await ElMessageBox.confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (tag !== 'confirm') {
        ElMessage.info('取消删除参数')
      } else {
        let { data: res } = await axios.delete(`categories/${cateId}/attributes/${attrId}`)
        console.log(res)
        if (res.meta.status !== 200) {
          return ElMessage.error('删除参数失败')
        } else {
          ElMessage.success('删除参数成功')
          getParamsList()
        }
      }
    },
    addForm() {
      titleHead = '添加'
      formVisible = true
    },
    confirmForm() {
      .formRef.validate(async (valid) => {
        if (!valid) {
          return ElMessage.info(`请输入${titleTail}`)
        } else if (!editAbleTag) {
          console.log(JSON.parse(JSON.stringify(formData)))
          let { data: res } = await axios.post(`categories/${attrId}/attributes`, formData)
          console.log(res)
          if (res.meta.status !== 201) {
            return ElMessage.error('添加参数失败')
          } else ElMessage.success('添加参数成功')
          getParamsList()
          formVisible = false
        } else {
          let { data: res } = await axios.put(`categories/${cateId}/attributes/${attrId}`, formData)
          console.log(res)
          if (res.meta.status !== 200) {
            return ElMessage.error('编辑参数失败')
          } else ElMessage.success('编辑参数成功')
          getParamsList()
          editAbleTag = false
          formVisible = false
        }
      })
    },
    colseForm() {
      .formRef.resetFields()
      editAbleTag = false
    },
    async putAttrVal(row) {
      let stringVar = row.attr_vals.join()
      console.log('上传参数为字符串', stringVar)
      let { data: res } = await axios.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(),
      })
      console.log('修改的结果', res)
      if (res.meta.status !== 200) {
        row.isShowInput = false
        return ElMessage.error('修改参数项失败')
      }
      ElMessage.success('修改参数项成功')
    },
    tagInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.isShowInput = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue)
      putAttrVal(row)
      row.inputValue = ''
      row.isShowInput = false
    },
    showInput(row) {
      row.isShowInput = true
      $nextTick(() => {
        .tagInputRef.$refs.input.focus()
      })
    },
    closeTag(row, index) {
      row.attr_vals.splice(index, 1)
      putAttrVal(row)
    },
  },
  created() {
    getCateList()
  },
  mounted() {},
}
</script>
<style scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-cascader {
  margin-left: 15px;
}
.el-table .el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
