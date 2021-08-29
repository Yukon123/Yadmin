<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col><el-button type="primary" @click="addDialogVisible = true">添加角色</el-button></el-col>
    </el-row>
    <el-table :data="rolesList" border style="width: 100%" stripe="">
      <el-table-column type="expand">
        <template #default="scope">
          <el-row
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
            :class="['elbot', 'vcenter', i1 == 0 ? 'eltop' : '']"
          >
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
                :class="[i2 == 0 ? '' : 'eltop', 'vcenter']"
              >
                <el-col :span="6">
                  <el-tag type="success" @close="removeRightById(scope.row, item2.id)" closable>
                    {{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                  >
                    {{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column prop="" label="操作" width="300px" #default="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="doEditForm(scope.row.id)">编辑</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
        <el-button type="warning" size="mini" @click="distUserRights(scope.row)"
          ><i class="el-icon-setting"></i><span>分配权限</span></el-button
        >
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" v-model="roleDialogVisible" width="50%">
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKey"
        ref="treeRef"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDistRight(currentUserId)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="添加角色" v-model="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addRoleForm" :rules="addFormRule" ref="addFormRef" label-width="90px" status-icon>
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑角色" v-model="editorDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="90px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editorDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUsers">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const axios: any = inject('axios')

// 获取角色列表
const rolesList = ref([
  {
    id: 0,
    roleName: '',
    roleDesc: '',
    children: [] as any[],
  },
])
const getRolesList = async () => {
  const { data: res } = await axios.get('roles').catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取角色列表失败')
  }
  rolesList.value = res.data
}
getRolesList()

// expand列表
const removeRightById = async (role: any, rightId: number) => {
  let result = await ElMessageBox.confirm('此操作将永久删除该权限, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch((err) => err)
  if (result !== 'confirm') {
    return ElMessage.info('取消了删除')
  }
  let { data: res } = await axios.delete(`roles/${role.id}/rights/${rightId}`).catch((err: any) => err)
  if (res.meta.status !== 200) ElMessage.error('删除权限失败')
  else ElMessage.success('删除权限成功')
  role.children = res.data
}

// 添加角色
const addRoleForm = ref({ roleName: '', roleDesc: '' })
const addFormRef = ref(null) as any
const addDialogVisible = ref(false)
const addFormRule = ref({
  roleName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
  ],
  roleDesc: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
  ],
})
const addDialogClose = () => {
  addFormRef.value.resetFields()
}
const addRoles = async () => {
  const { data: res } = await axios.post('/roles', addRoleForm.value).catch((err: any) => err)
  if (res.meta.status !== 201) {
    return ElMessage.error(res.meta.msg)
  }
  res.data.children = []
  res.data.id = res.data.roleId
  getRolesList()
  addDialogVisible.value = false
}

// 编辑角色
const editForm = ref({ roleName: '', roleDesc: '', roleId: 0 })
const editFormRef = ref(null) as any
const editorDialogVisible = ref(false)
const editFormRule = ref({
  roleName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
  ],
  roleDesc: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
  ],
})
const editDialogClose = () => {
  editFormRef.value.resetFields()
}
const doEditForm = async (id: number) => {
  const { data: res } = await axios.get('roles/' + id).catch((err: any) => err)
  if (res.meta.status !== 200) return ElMessage.error('查询角色失败')
  editorDialogVisible.value = true
  editForm.value = res.data
}
const editUsers = () => {
  editFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const { data: res } = await axios.put('roles/' + editForm.value.roleId, editForm.value).catch((err: any) => err)
      console.log('修改结果', res)
      if (res.meta.status !== 200) return ElMessage.warning('更新角色失败')
      else {
        ElMessage.success('更新角色成功')
        getRolesList()
        editorDialogVisible.value = false
      }
    }
  })
}

//分配权限
const defKey = ref([])
const rightList = ref([
  {
    id: 0,
    authName: '',
    level: '',
    pid: 0,
    path: null,
  },
])
const currentUserId = ref(0)
const treeRef = ref(null) as any
const treeProps = ref({
  children: 'children',
  label: 'authName',
})
const roleDialogVisible = ref(false)
const getNodeKey = (node: any, arr: number[]) => {
  if (!node.children) {
    return arr.push(node.id)
  }
  node.children.forEach((item: any) => {
    getNodeKey(item, arr)
  })
}
const distUserRights = async (role: any) => {
  currentUserId.value = role.id
  let { data: res } = await axios.get('rights/tree').catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取权限列表失败')
  }
  rightList.value = res.data
  defKey.value = []
  getNodeKey(role, defKey.value)
  roleDialogVisible.value = true
}
const confirmDistRight = async (id: number) => {
  let keys = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()]
  let keyStr = keys.join()
  let { data: res } = await axios
    .post(`roles/${id}/rights`, {
      rids: keyStr,
    })
    .catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('分配权限失败')
  }
  getRolesList()
  roleDialogVisible.value = false
  ElMessage.success('分配权限成功')
}

// 删除角色
const deleteRole = (id: number) => {
  ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { data: res } = await axios.delete('roles/' + id).catch((err: any) => err)
      if (res.meta.status !== 200) return ElMessage.error('删除失败')
      else ElMessage({ type: 'success', message: '删除成功!' })
      getRolesList()
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '已取消删除' })
    })
}
</script>
<style scoped lang="less">
.el-button span {
  margin-left: 5px;
}
.el-tag {
  margin: 7px;
}
.elbot {
  border-bottom: 1px solid #eee;
}
.eltop {
  border-top: 1px solid #eee;
}
</style>
