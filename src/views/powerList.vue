<template>
  <div class="contentWrap pd20 projectList">
    <el-form class="table-search-form" size="medium" :model="searchForm" :inline="true"
             label-width="120px" @keyup.enter.native="reloadTable">
      <el-form-item label="账号">
        <el-input v-model="searchForm.account"></el-input>
      </el-form-item>
      <el-form-item size="medium" class="searchBtnWrap">
        <el-button type="primary" @click="reloadTable" style="margin-left: 20px">
          <i class="iconfont icon-search btnIcon"></i>搜索
        </el-button>
      </el-form-item>
    </el-form>
    <div class="dataTable">
      <div class="tableBtnWrap tableWrapSpace">
        <el-button type="primary" size="small" @click="addUser = true">
          <i class="iconfont icon-add-user btnIcon"></i>
          添加人员
        </el-button>
      </div>
      <div class="tableData tableWrapSpace">
        <ghTable ref="ghTable" :url="tableUrl" :searchForm="searchForm" :show-index="true" :initPost="true">
          <el-table-column prop="account" label="账号" />
          <el-table-column label="操作" width="360">
            <template slot-scope="scope">
              <el-button
                        @click="editPwd(scope.row.uuid)"
                        type="text" size="small"
                        v-show="scope.row.uuid !=='001'">
                        修改密码</el-button>
              <el-button size="small"
                         @click="deleteAccount(scope.row)"
                         class="el-button--text--danger"
                         v-show="scope.row.uuid !=='001'"
                         type="text">删除</el-button>
            </template>
          </el-table-column>
        </ghTable>
      </div>
    </div>
    <el-dialog
            width="450px"
            title="修改密码"
            @close="closePwdDialog"
            :visible.sync="editPassword">
      <el-form :model="editPwdForm" ref="editPwdForm">
        <el-form-item label="新密码" prop="password" verify>
          <el-input type="password" v-model="editPwdForm.password" placeholder="请输入新的密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="secondPassword" :verify="verifyPassword">
          <el-input type="password" v-model="editPwdForm.secondPassword" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPassword = false">取 消</el-button>
        <el-button type="primary" @click="postPwdForm('editPwdForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
            width="450px"
            title="新增账号"
            @close="closeAddDialog"
            :visible.sync="addUser">
      <el-form :model="addUserForm" ref="addUserForm">
        <el-form-item label="账号" prop="account" verify>
          <el-input v-model="addUserForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" verify>
          <el-input type="password" v-model="addUserForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUser = false">取 消</el-button>
        <el-button type="primary" @click="postUserForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'powerList',
  data () {
    return {
      tableUrl: '/back/manager/list',
      searchForm: {
        account: '',
        pageSize: 10,
        pageNum: 1,
      },
      tableData: [],
      editPassword: false,
      editPwdForm: {
        uuid: '',
        password: '',
        secondPassword: ''
      },
      addUser: false,
      addUserForm: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    reloadTable () {
      this.$nextTick(() => {
        this.$refs.ghTable.reloadTableList()
      })
    },
    editPwd (idParams) {
      this.editPassword = true
      this.editPwdForm.uuid = idParams
    },
    verifyPassword (rule, val, callback) {
      if (val !== this.editPwdForm.password) callback(Error('两次输入密码不一致!'))
      else callback()
    },
    closePwdDialog () {
      this.$refs.editPwdForm.resetFields()
    },
    postPwdForm () {
      this.$refs.editPwdForm.validate()
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/manager/modifyPwd',
            data: this.editPwdForm
          })
            .then((res) => {
              this.editPassword = false
            })
            .catch(function (error) {
              this.$message.error(error.msg)
            })
        })
    },
    deleteAccount (data) {
      this.$confirm('是否删除用户' + data.account + '?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/manager/delete',
            data: { uuid: data.uuid }
          })
            .then((res) => {
              if (+res.code === 1) {
                this.$message.success('操作成功！')
                this.reloadTable()
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message.error(error.msg)
            })
        })
        .catch((action) => {
          // console.log(action)
          this.$message.info('操作已取消！')
        })
    },
    closeAddDialog () {
      this.$refs.addUserForm.resetFields()
    },
    postUserForm () {
      this.$refs.addUserForm.validate()
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/manager/add',
            data: this.addUserForm
          })
            .then((res) => {
              this.addUser = false
              this.$message.success('操作成功！')
              this.reloadTable()
            })
            .catch((error) => {
              this.$message.error(error.msg)
            })
        })
    }
  }
}
</script>
<style lang="scss">
  .table-search-form, .table-wrapper{border: 1px solid #ebeef5;}
</style>
