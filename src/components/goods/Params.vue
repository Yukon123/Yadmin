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
                  >{{ value }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.isShowInput"
                  v-model="scope.row.inputValue"
                  ref="tagInputRef"
                  size="small"
                  autofocus
                  @keyup.enter="tagInputConfirm(scope.row)"
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
                  @keyup.enter="tagInputConfirm(scope.row)"
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
    <el-dialog :title="dialogTitle" v-model="formVisible" width="40%" @close="colseForm">
      <el-form :model="formData" :rules="addFormRules" ref="formRef" label-width="100px">
        <el-form-item :label="titleTail" prop="attr_name">
          <el-input v-model="formData['attr_name']"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const axios: any = inject('axios')

const casCartListProps = ref({
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
})
const addFormRules = ref({
  attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
})
// 计算属性
const isDisabled = computed(() => {
  return selectedKey.value.length !== 3
})
const titleTail = computed(() => {
  if (activeTabName.value === 'many') return '动态参数'
  else return '静态属性'
})
const dialogTitle = computed(() => {
  return titleHead.value + titleTail.value
})

// 级联选择框分类
const casCateList = ref([])
const getCateList = async () => {
  let { data: res } = await axios.get('categories').catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取分类数据失败')
  }
  casCateList.value = res.data
}
getCateList()
const cascaderChange = () => {
  getParamsList()
}
const activeTabName = ref('many')
const tabsClick = () => {
  formData.value.attr_sel = activeTabName.value
  getParamsList()
}

// 获取参数列表
const attrId = ref(0)
const selectedKey = ref([])
const manyTableData = ref([])
const onlyTableData = ref([])
const getParamsList = async () => {
  if (selectedKey.value.length !== 3) {
    selectedKey.value = []
    manyTableData.value = []
    onlyTableData.value = []
    return
  }
  attrId.value = selectedKey.value[selectedKey.value.length - 1]
  let { data: res } = await axios
    .get(`categories/${attrId.value}/attributes`, {
      params: { sel: activeTabName.value },
    })
    .catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取参数信息失败')
  }
  res.data.forEach((item: any) => {
    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
    item.isShowInput = false
    item.inputValue = ''
  })
  if (activeTabName.value === 'many') {
    manyTableData.value = res.data
  } else {
    onlyTableData.value = res.data
  }
}

// 编辑参数
const cateId = ref(0)
const titleHead = ref('')
const editAbleTag = ref(false)
const formData = ref({ attr_name: '', attr_sel: 'many', attr_vals: '' })
const formVisible = ref(false)
const editParams = async (params: any) => {
  let { data: res } = await axios
    .get(`categories/${params.cat_id}/attributes/${params.attr_id}`)
    .catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取参数名称失败')
  }
  formData.value.attr_name = res.data.attr_name
  titleHead.value = '修改'
  formVisible.value = true
  cateId.value = params.cat_id
  attrId.value = params.attr_id
  editAbleTag.value = true
}

// 删除参数
const deleteParams = async (params: any) => {
  cateId.value = params.cat_id
  attrId.value = params.attr_id
  let tag = await ElMessageBox.confirm('此操作将永久删除该参数, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch((err) => err)
  if (tag !== 'confirm') {
    ElMessage.info('取消删除参数')
  } else {
    let { data: res } = await axios
      .delete(`categories/${cateId.value}/attributes/${attrId.value}`)
      .catch((err: any) => err)
    if (res.meta.status !== 200) {
      return ElMessage.error('删除参数失败')
    } else {
      ElMessage.success('删除参数成功')
      getParamsList()
    }
  }
}

// 增加参数
const formRef: any = ref(null)
const addForm = () => {
  titleHead.value = '添加'
  formVisible.value = true
}
const confirmForm = () => {
  formRef.value.validate(async (valid: any) => {
    if (!valid) {
      return ElMessage.info(`请输入${titleTail}`)
    } else if (!editAbleTag.value) {
      let { data: res } = await axios
        .post(`categories/${attrId.value}/attributes`, formData.value)
        .catch((err: any) => err)
      if (res.meta.status !== 201) {
        return ElMessage.error('添加参数失败')
      } else ElMessage.success('添加参数成功')
      getParamsList()
      formVisible.value = false
    } else {
      let { data: res } = await axios
        .put(`categories/${cateId.value}/attributes/${attrId.value}`, formData.value)
        .catch((err: any) => err)
      if (res.meta.status !== 200) {
        return ElMessage.error('编辑参数失败')
      } else ElMessage.success('编辑参数成功')
      getParamsList()
      editAbleTag.value = false
      formVisible.value = false
    }
  })
}
const colseForm = () => {
  formRef.value.resetFields()
  editAbleTag.value = false
}

// 修改属性值
const putAttrVal = async (row: any) => {
  let { data: res } = await axios
    .put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
      attr_name: row.attr_name,
      attr_sel: row.attr_sel,
      attr_vals: row.attr_vals.join(),
    })
    .catch((err: any) => err)
  if (res.meta.status !== 200) {
    row.isShowInput = false
    return ElMessage.error('修改参数项失败')
  }
  ElMessage.success('修改参数项成功')
}

const tagInputConfirm = (row: any) => {
  if (row.inputValue.trim().length === 0) {
    row.isShowInput = false
    row.inputValue = ''
    return
  }
  row.attr_vals.push(row.inputValue)
  putAttrVal(row)
  row.inputValue = ''
  row.isShowInput = false
}

const tagInputRef: any = ref(1)
const showInput = async (row: any) => {
  row.isShowInput = true
  await nextTick().catch((err: any) => err)
  tagInputRef.value.focus()
}
const closeTag = (row: any, index: string | number | symbol) => {
  row.attr_vals.splice(index, 1)
  putAttrVal(row)
}
</script>
<style scoped lang="less">
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
