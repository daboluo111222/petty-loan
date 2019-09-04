<template>
  <div class="table-wrapper">
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column v-if="showIndex" type="index" :index="indexMethod" label="序号" align="center"
        width="50" />
      <slot></slot>
    </el-table>
    <div class="table-page">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :current-page="pageNum"
        :page-size="pageSize" :total="pageTotal" @current-change="pageNumChange"
        @size-change="pageSizeChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import utils from '@/utils/utils'
export default {
  props: {
    initPost: { // 默认请求数据
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      required: true,
      default: ''
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    searchForm: {
      type: Object,
      default () {
        return {}
      }
    },
    pageSize: {
      type: Number,
      default: 20,
    },
  },
  data () {
    return {
      pageNum: 1,
      pageTotal: 0,
      tableData: [],
      loading: false
    }
  },
  computed: {
    tableDataUrl () {
      return this.url
    }
  },
  watch: {
    pageNum () {
      this.getTableList()
    },
    pageSize () {
      this.getTableList()
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
    indexMethod (index) {
      let { pageSize, pageNum } = this
      return (pageNum - 1) * pageSize + (index + 1)
    },
    /**
     * 本地分页
     * @param {} data 表格数据
     */
    pagination (data) {
      let { pageSize, pageNum } = this
      let start = (pageNum - 1) * pageSize
      let end = pageNum * pageSize
      if (pageNum * pageSize >= data.length) {
        return data.slice(start)
      }
      return data.slice(start, end)
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
    },
    pageNumChange (pageNum) {
      this.pageNum = pageNum
    },
    getTableList () {
      let { pageNum, pageSize } = this
      this.loading = true
      if (!this.initPost) { this.loading = false; return }
      return this.$ajax.post(this.tableDataUrl, Object.assign({}, this.searchForm, { pageNum, pageSize }))
        .then((res) => {
          this.loading = false
          if (utils.isEmpty(res.result.list)) {
            this.tableData = []
            return
          }
          this.pageTotal = res.result.total
          this.tableData = res.result.list
        })
        .catch((e) => {
          this.tableData = []
          this.pageNum = 1
          this.pageTotal = 0
          this.loading = false
          this.$message.error(e.msg || '获取列表数据失败!')
        })
    },
    reloadTableList () {
      this.pageNum = 1
      this.pageTotal = 0
      utils.debounce(this.getTableList, 500)()
    }
  }
}
</script>
<style lang="scss">
.table-page {
  margin: 10px 35px 10px;

  .el-pagination {
    text-align: right;
  }
}
</style>
