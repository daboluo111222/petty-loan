<template>
  <div class="contentWrap pd20 projectList">
    <el-form class="table-search-form" size="medium" :model="searchForm" :inline="true"
             label-width="120px" @keyup.enter.native="reloadTable">
      <el-form-item label="账号">
        <el-input v-model="searchForm.account"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="searchForm.type" placeholder="请选择">
          <el-option v-for="item in accountType" :key="item.value" :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="medium" class="searchBtnWrap">
        <el-button type="primary" @click="reloadTable" style="margin-left: 20px">
          <i class="iconfont icon-search btnIcon"></i>搜索
        </el-button>
      </el-form-item>
    </el-form>
    <ghTable ref="ghTable" :url="tableUrl" :searchForm="searchForm" :show-index="true" :initPost="true">
      <el-table-column prop="account" label="账号" />
      <el-table-column prop="type" label="用户类型">
        <template slot-scope="scope">
          <span v-show="Number(scope.row.type)===1">普通用户</span>
          <span v-show="Number(scope.row.type)===2">白名单用户</span>
          <span v-show="Number(scope.row.type)===3">黑名单用户</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanCount" label="借款次数">
        <template slot-scope="scope">
          <span v-if="Number(scope.row.loanCount)===0" class="lightColor">{{scope.row.loanCount}}</span>
          <span v-else class="blueText hand" @click="viewRecord(scope.row.uuid,1)">{{scope.row.loanCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="returnCount" label="还款次数">
        <template slot-scope="scope">
          <span v-if="Number(scope.row.returnCount)===0" class="lightColor">{{scope.row.returnCount}}</span>
          <span v-else class="blueText hand" @click="viewRecord(scope.row.uuid,2)">{{scope.row.returnCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expiredCount" label="逾期次数">
        <template slot-scope="scope">
          <span v-if="Number(scope.row.expiredCount)===0" class="lightColor">{{scope.row.expiredCount}}</span>
          <span v-else class="blueText hand" @click="viewRecord(scope.row.uuid,3)">{{scope.row.expiredCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360">
        <template slot-scope="scope">
          <el-button @click="editPwd(scope.row.uuid)" type="text" size="small">修改密码</el-button>
          <span style="margin-left:10px;" v-if="Number(scope.row.type) === 1">
            <el-button class="el-button--text--warning"
                      size="small"
                      @click="switchAccountState(scope.row,'set','black')"
                      type="text">设为黑名单
            </el-button>
            <el-button size="small"
                     @click="switchAccountState(scope.row,'set','white')"
                     v-if="Number(scope.row.type) === 1 || Number(scope.row.type) === 3"
                     type="text">设为白名单
            </el-button>
          </span>
          <el-button size="small"
                     @click="switchAccountState(scope.row,'cancel','white')"
                     v-if="Number(scope.row.type) === 2"
                     type="text">取消白名单
          </el-button>
          <el-button size="small"
                     @click="switchAccountState(scope.row,'cancel','black')"
                     v-if="Number(scope.row.type) === 3"
                     type="text">取消黑名单
          </el-button>
          <el-button size="small"
                     @click="deleteAccount(scope.row)"
                     class="el-button--text--danger"
                     type="text">删除</el-button>
        </template>
      </el-table-column>
    </ghTable>
    <el-dialog
            width="450px"
            title="修改密码"
            @close="closeDialog"
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
            width="750px"
            title="查看贷款记录"
            :visible.sync="viewRecordDialog">
            <el-table
                    :data="recordTableData"
                    stripe
                    style="width: 100%">
              <el-table-column type="index" label="序号"/>
              <el-table-column prop="loanTime" label="借款时间"/>
              <el-table-column prop="returnTime" label="还款时间"/>
              <el-table-column prop="status" label="是否逾期">
                <template slot-scope="scope">
                  <span v-if="Number(scope.row.status)===6">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
            </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'memberList',
  data () {
    return {
      tableUrl: '/back/user/list',
      searchForm: {
        account: '',
        accountType: '',
        type: '', // 1普通用户 2白名单用户 3黑名单用户
        pageSize: 10,
        pageNum: 1,
      },
      accountType: [
        { 'name': '全部', value: '' },
        { 'name': '普通用户', value: '1' },
        { 'name': '白名单用户', value: '2' },
        { 'name': '黑名单用户', value: '3' }
      ],
      tableData: [],
      editPassword: false,
      editPwdForm: {
        uuid: '',
        password: '',
        secondPassword: ''
      },
      viewRecordDialog: false,
      recordTableData: []
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
    closeDialog () {
      this.$refs.editPwdForm.resetFields()
    },
    postPwdForm () {
      this.$refs.editPwdForm.validate()
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/user/modifyPwd',
            data: this.editPwdForm
          })
            .then((res) => {
              this.editPassword = false
              this.$message.success('操作成功！')
              this.reloadTable()
            })
            .catch((error) => {
              this.$message.error(error.msg)
            })
        })
    },
    switchAccountState (data, ctrlType, state) {
      let typeText = '设置'
      if (ctrlType !== 'set') typeText = '取消'
      let stateText = '黑名单？'
      if (state !== 'black') stateText = '白名单？'
      this.$confirm('是否将用户' + data.account + typeText + stateText, '提示', {
        type: 'warning'
      })
        .then(() => {
          this.postAccountState(data, state)
        })
        .catch((action) => {
          // console.log(action)
          this.$message.info('操作已取消！')
        })
    },
    postAccountState (data, state) {
      let postUrl = '/back/user/switchBlack'
      if (state !== 'black') postUrl = '/back/user/switchWhite'
      if (state) {
        this.$ajax({
          method: 'post',
          url: postUrl,
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
      }
    },
    deleteAccount (data) {
      this.$confirm('是否删除用户' + data.account + '?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/user/delete',
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
    viewRecord (idParams, type) {
      this.viewRecordDialog = true
      this.$ajax({
        method: 'post',
        url: '/back/user/record',
        data: {uuid: idParams, type: type}
      })
        .then((res) => {
          this.recordTableData = res.result
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
