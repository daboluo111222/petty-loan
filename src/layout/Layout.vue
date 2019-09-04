<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data () {
    return {
      show: false,
      userInfo: {}
    }
  },
  beforeMount: function () {
    // this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      let that = this
      this.$ajax({
        method: 'get',
        url: '/api/account/query'
      })
        .then(function (res) {
          let resData = res.data
          if (resData.code == 1) {
            let result = resData.result
            that.userInfo = result
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
