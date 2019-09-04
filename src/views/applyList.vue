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
    <ghTable ref="ghTable" :url="tableUrl" :searchForm="searchForm" :show-index="true" :initPost="true">
      <el-table-column prop="orderNumber" label="订单号" />
      <el-table-column prop="account" label="账号" />
      <el-table-column prop="applyTime" label="申请时间" />
      <el-table-column prop="type" label="用户类型">
        <template slot-scope="scope">
          <span v-show="Number(scope.row.type)===1">普通用户</span>
          <span v-show="Number(scope.row.type)===2">白名单用户</span>
          <span v-show="Number(scope.row.type)===3">黑名单用户</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button @click="viewInfo(scope.row.uuid)" type="text" size="small">查看信息</el-button>
          <el-button size="small"
                     @click="checkAccount(scope.row,1)"
                     v-if="Number(scope.row.status) === 1"
                     type="text">审核通过
          </el-button>
          <el-button class="el-button--text--danger"
                     size="small"
                     @click="checkAccount(scope.row,2)"
                     v-if="Number(scope.row.status) === 1"
                     type="text">拒绝申请
          </el-button>
          <el-button class="el-button--text--warning"
                     size="small"
                     @click="confirmLoan(scope.row)"
                     v-if="Number(scope.row.status) === 2"
                     type="text">确认放款
          </el-button>
        </template>
      </el-table-column>
    </ghTable>
    <el-dialog
            width="450px"
            title="查看信息"
            :visible.sync="showAccountInfo">
            <ul class="account-info-wrap">
              <li class="info-list"><span class="title">姓名：</span><span class="value">{{accountInfoData.name}}</span></li>
              <li class="info-list"><span class="title">身份证：</span><span class="value">{{accountInfoData.idCard}}</span></li>
              <li class="info-list"><span class="title">银行卡：</span><span class="value">{{accountInfoData.bankCard}}</span></li>
              <li class="info-list"><span class="title">手机号：</span><span class="value">{{accountInfoData.mobile}}</span></li>
            </ul>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'applyList',
  data () {
    return {
      tableUrl: '/back/loan/applyList',
      searchForm: {
        account: '',
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
      showAccountInfo: false,
      accountInfoData: {
        bankCard: '', idCard: '', mobile: '', name: ''
      }
    }
  },
  methods: {
    reloadTable () {
      this.$nextTick(() => {
        this.$refs.ghTable.reloadTableList()
      })
    },
    viewInfo (idParams) {
      this.showAccountInfo = true
      this.$ajax({
        method: 'post',
        url: '/back/loan/detail',
        data: {uuid: idParams}
      })
        .then((res) => {
          if (+res.code === 1) {
            this.accountInfoData = Object.assign({}, res.result)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    checkAccount (data, checkType) {
      let checkText = '同意'
      if (checkType !== 1) checkText = '拒绝'
      this.$confirm('确定' + checkText + data.account + '的申请？', '提示', {type: 'warning'})
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/loan/doReview',
            data: {uuid: data.uuid, type: checkType}
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
    confirmLoan (data) {
      this.$confirm('确认给' + data.account + '放款？', '提示', {type: 'warning'})
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/loan/doBorrow',
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
            })
        })
        .catch((action) => {
          this.$message.info('操作已取消！')
        })
    }
  }
}
</script>

<style lang="scss">
  .account-info-wrap{
    padding-bottom:30px;
    .info-list{
      line-height: 30px;
      .title,.value{
        display: inline-block;
        width:100px;
        text-align: right;
      }
      .value{
        text-align: left;
        width:260px;
        padding-left: 20px;
      }
    }
  }
</style>
