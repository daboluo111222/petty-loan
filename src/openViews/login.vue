<template>
  <div class="login">
    <div class="login--bg">
      <div class="login--bg-name">
        <div class="login--bg-name-ch">小工贷款管理平台</div>
        <div class="login--bg-name-en">LOAN</div>
        <div class="login--bg-name-en">Loan Management Platform</div>
      </div>
    </div>
    <div class="login--form flex-row flex-center-center">
      <el-form ref="form" :model="form" @keyup.enter.native="onSubmit">
        <div class="login--form__title flex-row flex-center">登录</div>
        <el-form-item label="用户账号" prop="account" verify>
          <el-input v-model="form.account" placeholder="请输入账号"
            prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" verify>
          <el-input v-model="form.password" type="password" placeholder="请输入密码"
            prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-button class="login--form__button" @click="onSubmit">登录</el-button>
        <div class="login--form__other flex-row flex-center">
          <router-link v-show="false" to="/resetPassword">忘记密码</router-link>
        </div>
      </el-form>
    </div>
    <div class="login--footer flex-row flex-center-center">小工贷款管理平台</div>
  </div>
</template>

<script>
// import CryptoES from 'crypto-es'
let isDev = process.env.NODE_ENV == 'development'
export default {
  name: 'login',
  props: {},
  data () {
    return {
      form: {
        account: isDev ? 'admin' : '',
        password: isDev ? '123456' : ''
      },
      secretKey: '',
      encryptPwd: '',
      msgIsOpen: null,
    }
  },
  created () { },
  mounted () { },
  methods: {
    onSubmit () {
      if (this.msgIsOpen) return
      // let encrypt = (msg) => {
      //   // 初始向量解析
      //   const iv = CryptoES.enc.Utf8.parse('82114756')
      //   const key = CryptoES.enc.Utf8.parse('@gonghui@ng@lx100$#365#$')
      //   let encrypted = CryptoES.TripleDES.encrypt(msg, key, {
      //     iv: iv,
      //     mode: CryptoES.mode.CBC,
      //     padding: CryptoES.pad.Pkcs7
      //   })
      //   return CryptoES.enc.Base64.stringify(encrypted.ciphertext)
      // }

      this.$refs.form.validate()
        .then(() => {
          let form = Object.assign({}, this.form)
          // form.password = encrypt(form.password)
          return this.$ajax.post('/back/login/doLogin', form)
        })
        .then((res) => {
          // console.log(res)
          let goto = () => {
            this.$router.push('/index')
          }
          this.$message({
            type: 'success',
            message: '操作成功',
            duration: '1000',
            onClose: goto
          })
        })
        .catch((e) => {
          if (!e) {
            this.$message({
              type: 'warning',
              message: '请填写正确的用户名和密码',
              duration: '2000',
              onClose: () => {
                this.msgIsOpen = false
              }
            })
            this.msgIsOpen = true
          } else {
            this.$message({
              type: 'error',
              message: e.msg,
              duration: '2000',
              onClose: () => {
                this.msgIsOpen = false
              }
            })
            this.msgIsOpen = true
          }
        })
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/flex.scss";
$login-default-color: #4c84ff;
$login-footer-bg: #333;
$login-name-bg: #2d304a;
.login {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: 6fr 4fr;
  grid-template-rows: 1fr 40px;
  grid-template-areas:
    "bg login"
    "footer footer";
  &--bg {
    position: relative;
    grid-area: bg;
    background: $login-name-bg;
    &-name {
      position: absolute;
      top: 35%;
      left: 20%;
    }
    &-name-ch {
      color: #fff;
      font-size: 40px;
      font-family: "Microsoft YaHei";
      font-weight: bold;
      letter-spacing: 5px;
      margin-bottom: 25px;
    }
    &-name-en {
      color: #fff;
      font-size: 24px;
      font-family: "Microsoft YaHei";
      letter-spacing: 0.5px;
      margin-top: 8px;
    }
  }
  &--form {
    grid-area: login;
    &__title {
      color: $login-default-color;
      font-size: 36px;
      font-weight: bold;
      margin: 0 0 50px;
    }
    &__other {
      margin-top: 30px;
      width: 100%;
      color: $login-default-color;
      font-size: 14px;
    }
    &__button {
      width: 100%;
      &.el-button {
        margin-top: 40px;
        border-radius: 25px;
        height: 50px;
        background: $login-default-color;
        border: none;
        color: #fff;
        box-shadow: 6px 6px 20px $login-default-color;
      }
    }
    .el-form {
      width: 460px;
    }
    .el-form-item {
      &__label {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        &::before {
          display: none;
        }
      }
      .el-form-item__error {
        padding: 5px 0 0 22px;
      }
      .el-input__inner {
        border-radius: 25px;
        height: 50px;
      }
      .el-input--prefix .el-input__inner {
        padding: 0 0 0 50px;
      }
      .el-input__prefix {
        top: 2px;
        left: 22px;
        font-size: 22px;
      }
      .login-form-icon {
        font-size: 20px;
      }
    }
  }
  &--footer {
    grid-area: footer;
    background: $login-footer-bg;
    color: #fff;
    font-size: 12px;
  }
}
</style>
