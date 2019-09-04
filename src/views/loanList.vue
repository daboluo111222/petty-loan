<template>
  <div class="contentWrap pd20 projectList">
    <el-form class="table-search-form" size="medium" :model="searchForm" :inline="true"
             label-width="120px" @keyup.enter.native="reloadTable">
      <el-form-item label="账号">
        <el-input v-model="searchForm.account"></el-input>
      </el-form-item>
      <el-form-item label="逾期天数">
        <el-select v-model="searchForm.expiredDaysType" placeholder="请选择">
          <el-option v-for="item in overdueType" :key="item.value" :label="item.name"
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
      <el-table-column prop="orderNumber" label="订单号" />
      <el-table-column prop="account" label="账号"/>
      <el-table-column prop="loanTime" label="放款时间"/>
      <el-table-column prop="returnTime" label="到期时间" />
      <el-table-column prop="expiredDays" label="逾期天数" />
      <el-table-column prop="returnAmount" label="应还金额" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="confirmRepay(scope.row)" type="text" size="small">确认还款</el-button>
        </template>
      </el-table-column>
    </ghTable>
  </div>
</template>

<script>
export default {
  name: 'loanList',
  data () {
    return {
      tableUrl: '/back/loan/list',
      searchForm: {
        account: '',
        expiredDaysType: '',
        pageSize: 10,
        pageNum: 1,
      },
      overdueType: [
        { 'name': '全部', value: '1' },
        { 'name': '未逾期', value: '2' },
        { 'name': '小于等于5天', value: '3' },
        { 'name': '5到10天', value: '4' },
        { 'name': '10到15天', value: '5' },
        { 'name': '大于15天', value: '6' }
      ],
      tableData: [],
    }
  },
  methods: {
    reloadTable () {
      this.$nextTick(() => {
        this.$refs.ghTable.reloadTableList()
      })
    },
    confirmRepay (data) {
      this.$confirm('确认用户' + data.account + '已经还款？', '提示', {type: 'warning'})
        .then(() => {
          this.$ajax({
            method: 'post',
            url: '/back/loan/doReturn',
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
