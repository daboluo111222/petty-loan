<template>
  <div class="navWrap">
    <el-menu class="navbar" mode="horizontal">
      <div class="right-menu">
        <span class="companyName">{{companyName}}</span>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <!--<img class="user-avatar">-->
            <i class="iconfont icon-head-round" style="font-size:22px; color: #009fe9; margin-right: 4px;"></i>
            <span class="userName">{{accountName}}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item v-show="false">
              <span class="dropDownList" @click="editCompany=true">
                <i class="iconfont icon-edit" style="margin-right:5px;"></i>
                修改单位
              </span>
            </el-dropdown-item>
            <el-dropdown-item v-show="false">
              <span class="dropDownList" @click="editPassword=true">
                <i class="iconfont icon-set" style="margin-right:5px;"></i>
                修改密码
              </span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span class="dropDownList" @click="logout">
                <i class="iconfont icon-exit" style="margin-right:5px;"></i>
                退出登录
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>

    <el-dialog
      width="450px"
      title="修改单位信息"
      :visible.sync="editCompany">
      <el-form :model="editCompanyForm" status-icon :rules="checkRule" ref="editCompanyForm">
        <el-form-item label="单位名称" prop="depName">
          <el-input type="text" v-model="editCompanyForm.depName" placeholder="请输入单位名称" maxlength="24"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="taxId">
          <el-input type="text" v-model="editCompanyForm.taxId" placeholder="请输入统一社会信用代码" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="depAddress">
          <el-input type="text" v-model="editCompanyForm.depAddress" placeholder="请输入单位地址" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCompany = false">取 消</el-button>
        <el-button type="primary" @click="postCompanyForm('editCompanyForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="450px"
      title="修改密码"
      :visible.sync="editPassword">
      <el-form :model="editPwdForm" :rules="checkRule" ref="editPwdForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="editPwdForm.oldPassword" placeholder="请输入原密码" maxLength="6"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="editPwdForm.newPassword" placeholder="请输入新的6位数的数字密码"
                    maxLength="6"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="secondPassword">
          <el-input type="password" v-model="editPwdForm.secondPassword" placeholder="请再次输入新密码"
                    maxLength="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPassword = false">取 消</el-button>
        <el-button type="primary" @click="postPwdForm('editPwdForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import isEmpty from 'lodash/isEmpty'

export default {
  name: 'Navbar',
  props: {
    userInfo: {}
  },
  data () {
    var checkCompanyName = (rule, value, callback) => {
      var noSpaceAroundVal = this.$Cp.clearStringSpace(value)
      if (noSpaceAroundVal.length == 0) {
        callback(new Error('请输入单位名称'))
      } else {
        callback()
      }
    }
    var checkPwd = (rule, value, callback) => {
      var pwdReg = /^[0-9]{6}$/
      if (!pwdReg.test(value)) {
        callback(new Error('请输入6位数的数字密码'))
      } else {
        callback()
      }
    }
    var checkPwd2 = (rule, value, callback) => {
      if (value !== this.editPwdForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // isCollapse: true,
      accountName: '管理员',
      companyName: '',
      editCompany: false,
      editPassword: false,
      editCompanyForm: {
        depName: '',
        taxId: '',
        depAddress: ''
      },
      editPwdForm: {
        oldPassword: '',
        newPassword: '',
        secondPassword: ''
      },
      checkRule: {
        depName: [
          {validator: checkCompanyName, trigger: 'blur'}
        ],
        oldPassword: [
          {validator: checkPwd, trigger: 'blur'}
        ],
        newPassword: [
          {validator: checkPwd, trigger: 'blur'}
        ],
        secondPassword: [
          {validator: checkPwd2, trigger: 'blur'}
        ]
      },
    }
  },
  mounted: function () {
    // this.getUserInfo() //从父级获取
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
            that.accountName = result.accountName
            that.companyName = result.depName
            that.editCompanyForm.depName = result.depName
            that.editCompanyForm.taxId = result.taxId
            that.editCompanyForm.depAddress = result.depAddress
            that.$emit('getUserInfo', result) // 将获取的用户信息传递给父组件
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    postCompanyForm (formName) {
      let that = this
      this.$refs[formName].validateField('depName', function (valid) {
        if (valid == '请输入单位名称') {

        } else {
          this.$ajax({
            method: 'post',
            url: '/api/account/modifyDept',
            data: that.editCompanyForm
          })
            .then(function (res) {
              let resData = res.data
              if (resData.code == 1) {
                that.$message({
                  type: 'success',
                  duration: 1000,
                  showClose: true,
                  message: '操作成功！',
                  onClose: function () {
                    that.editCompany = false
                    that.getUserInfo()
                  }
                })
              } else {
                that.$alert(resData.msg, {type: 'error'})
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      })
    },
    postPwdForm (formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax({
            method: 'post',
            url: '/api/account/modifyPassword',
            data: that.editPwdForm
          })
            .then(function (res) {
              let resData = res.data
              if (resData.code == 1) {
                that.$message({
                  type: 'success',
                  duration: 1000,
                  showClose: true,
                  message: '操作成功！',
                  onClose: function () { that.$router.push({path: '/login'}) }
                })
              } else {
                that.$alert(resData.msg, {type: 'error'})
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    logout () {
      // this.$router.push({path:'/login'})
      let that = this
      this.$ajax({
        method: 'post',
        url: '/back/login/logout'
      })
        .then(function (res) {
          if (+res.code === 1) {
            that.$router.push({path: '/login'})
          }
          // let resData = res.data;
          // if (resData.code == 1) {
          //   let result = resData.result;
          //   that.$router.push({path:'/login'})
          // }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    background: #ffffff;
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .companyName {
        float: left;
        line-height: 50px;
        font-size: 14px;
        color: #606266;
      }
      .avatar-container {
        float: right;
        height: 50px;
        margin-right: 30px;
        padding-left: 10px;
        border-left: 1px solid #e6e6e6;
        .avatar-wrapper {
          cursor: pointer;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .userName {
            position: relative;
            top: -2px;
            font-size: 1em;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -15px;
            top: 20px;
            font-size: 12px;
          }
        }
      }
    }
  }

  .el-dropdown-menu__item {
    padding: 0 20px;
  }

  .el-dropdown-menu__item .dropDownList {
    display: block
  }
</style>
