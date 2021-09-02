<template>
  <div class="">
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="paramsList.query" clearable @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="doEditForm(scope.row.id)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUsersById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setUserRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsList.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="paramsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加用户" v-model="addDialogVisible" width="40%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="90px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="text" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="text" v-model="addForm.checkPass" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="on"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUsers">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑用户" v-model="editorDialogVisible" width="40%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="70px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editorDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUsers">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="分配角色" v-model="setRoledialogVisible" width="40%" ref="setFormRef" @close="setRoleDiaClose">
      <div>
        <div>当前的用户:{{ userInfo.username }}</div>
        <div>当前的角色:{{ userInfo.role_name }}</div>
        <div>
          分配新角色
          <el-select v-model="selectedRoleId" placeholder="请选择新角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSetRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const axios: any = inject('axios')

// 校验函数
const validatePass = (rule: any, value: string | number, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (addForm.value.checkPass !== '') {
      addFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== addForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 手机校验
const checkPhone = (rule: any, value: string, callback: any) => {
  var phone = value.replace(/\s/g, '') // 去除空格
  // 校验手机号，号段主要有(不包括上网卡)：130~139、150~153，155~159，180~189、170~171、176~178。14号段为上网卡专属号段
  const regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
  if (value.length !== 0 && !regs.test(phone)) {
    callback([new Error('手机号输入不合法')])
  } else callback()
}

// 邮箱校验
const checkEmail = (rule: any, value: string, callback: any) => {
  const regEmail = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  if (value !== '' && !regEmail.test(value)) {
    callback(new Error('请输入合法的邮箱'))
  } else callback()
}

//  获取用户列表
const paramsList = ref({
  query: '',
  pagenum: 1,
  pagesize: 5,
})
const userList = ref([])
const total = ref(0)
const getUserList = async () => {
  const { data: res } = await axios
    .get('users', {
      params: paramsList.value,
    })
    .catch((err: any) => err)
  if (res.meta.status !== 200) ElMessage.error('获取用户列表失败')
  userList.value = res.data.users
  total.value = res.data.total
}
const handleSizeChange = (size: number) => {
  paramsList.value.pagesize = size
  getUserList()
}
const handleCurrentChange = (page: number) => {
  paramsList.value.pagenum = page
  getUserList()
}
getUserList()

// 添加用户
const addForm = ref({
  username: '',
  password: '',
  checkPass: '',
  email: '',
  mobile: '',
})
const addFormRef = ref(null) as any
const addFormRule = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' },
  ],
  password: [
    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
  checkPass: [
    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
    { validator: checkPhone, trigger: 'blur' },
  ],
})
const addDialogVisible = ref(false)
const addDialogClose = () => {
  addFormRef.value.resetFields()
}
const addUsers = () => {
  addFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const { data: res } = await axios.post('users', addForm.value).catch((err: any) => err)
      if (res.meta.status !== 201) return ElMessage.warning('添加用户失败')
      else {
        ElMessage.success('添加用户成功')
        getUserList()
        addDialogVisible.value = false
      }
    }
  })
}

// 编辑用户
const editForm = ref({ id: 0, username: '', role_id: 0, mobile: '', email: '' })
const editFormRef: Ref<any> = ref(null)
const editFormRule = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
    { validator: checkPhone, trigger: 'blur' },
  ],
}
const editorDialogVisible = ref(false)
const editDialogClose = () => {
  editFormRef.value.resetFields()
}
const doEditForm = async (id: number) => {
  const { data: res } = await axios.get('users/' + id).catch((err: any) => err)
  if (res.meta.status !== 200) return ElMessage.error('查询用户失败')
  editorDialogVisible.value = true
  editForm.value = res.data
}
const editUsers = () => {
  editFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const { data: res } = await axios.put('users/' + editForm.value.id, editForm.value).catch((err: any) => err)
      if (res.meta.status !== 200) return ElMessage.warning('更新用户失败')
      else {
        ElMessage.success('更新用户成功')
        getUserList()
        editorDialogVisible.value = false
      }
    }
  })
}

// 状态改变按钮 & 删除用户按钮
const userStateChange = async (state: any) => {
  const { data: res } = await axios.put(`users/${state.id}/state/${state.mg_state}`).catch((err: any) => err)
  if (res.meta.status !== 200) {
    state.mg_state = !state.mg_state
    return ElMessage.error('更改用户状态失败')
  }
}
const removeUsersById = (id: any) => {
  ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { data: res } = await axios.delete('users/' + id)
      if (res.meta.status !== 200) return ElMessage.error('删除失败')
      else ElMessage({ type: 'success', message: '删除成功!' })
      getUserList()
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '已取消删除' })
    })
}

// 分配角色
const userInfo = ref({
  id: 0,
  username: '',
  mobile: '',
  type: 0,
  email: '',
  create_time: '',
  mg_state: true, // 当前用户的状态
  role_name: '',
})
const setRoledialogVisible = ref(false)
const roleList: Ref<any[]> = ref([]) as any
const selectedRoleId = ref('')
const setUserRole = (role: any) => {
  getRole()
  userInfo.value = role
  setRoledialogVisible.value = true
}
const getRole = async () => {
  const { data: res } = await axios.get('roles').catch((err: any) => err)
  if (res.meta.status !== 200) {
    return ElMessage.error('获取角色列表失败')
  }
  roleList.value = res.data
}
const confirmSetRole = async () => {
  if (!selectedRoleId.value == true) {
    return ElMessage.error('请选择新角色')
  }

  const { data: res } = await axios.put(`users/${userInfo.value.id}/role`, { rid: selectedRoleId.value })

  if (res.meta.status !== 200) {
    return ElMessage.error('更新角色失败')
  }
  ElMessage.success('设置角色成功')
  setRoledialogVisible.value = false
  getUserList()
}
const setFormRef = ref(null) as any
const setRoleDiaClose = () => {
  userInfo.value = {
    id: 0,
    username: '',
    mobile: '',
    type: 0,
    email: '',
    create_time: '',
    mg_state: true,
    role_name: '',
  }
  selectedRoleId.value = ''
  setFormRef.value.resetFields()
}
</script>
<style lang="less" scoped>
.el-form-item__label {
  margin-top: 20px;
}

div.cell {
  display: flex;
  justify-content: center;
}
.el-dialog div div {
  margin: 10px 0;
}
</style>
