<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="login-logo"></div>
      <div class="input-box">
        <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                    placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
        </el-form-item>
        <el-form-item class="rember-user" >
          <el-checkbox v-model="checked"></el-checkbox>
          <label>记住用户</label>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登陆
          </el-button>
        </el-form-item>
      </div>

      <!--<div class="tips">-->
      <!--<span style="margin-right:20px;">username: admin</span>-->
      <!--<span> password: admin</span>-->
      <!--</div>-->
    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import Cookies from 'js-cookie'
  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      }
      return {
        checked: true,
        loginForm: {
          username: Cookies.get('username') ? Cookies.get('username') : '',
          password: Cookies.get('pwd') ? Cookies.get('pwd') : ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        pwdType: 'password'
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            if (this.checked) {
              Cookies.set('username', this.loginForm.username, { expires: 7 })
              Cookies.set('pwd', this.loginForm.password, { expires: 7 })
            } else {
              Cookies.set('username', this.loginForm.username, { expires: -1 })
              Cookies.set('pwd', this.loginForm.password, { expires: -1 })
            }
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        /*padding: 12px 5px 12px 15px;*/
        color: #999999;
        height: 48px;
        width: 324px;
        &:focus{
          background: #fff;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(246,246,246,1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("../../assets/image/login_bg.png") 100% 100%;
    .login-form {
      box-sizing: border-box;
      background: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      width: 480px;
      height: 490px;
      padding: 34px 28px 80px;
    }
    .login-logo{
      width: 424px;
      height: 70px;
      background: url("../../assets/image/logo.png");
      margin-bottom: 65px;
      font-size:24px;
    }
    .input-box{
      width: 360px;
      margin: 0 auto;
    }
    .rember-user{
      background: #fff;
    }
    .login-btn{
      width: 360px;
      height: 60px;
    }
    /*.tips {*/
    /*font-size: 14px;*/
    /*color: #fff;*/
    /*margin-bottom: 10px;*/
    /*span {*/
    /*&:first-of-type {*/
    /*margin-right: 16px;*/
    /*}*/
    /*}*/
    /*}*/
    .svg-container {
      padding: 6px 10px 6px 7px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      font-size: 24px;
      &_login {
        font-size: 36px;
        padding-left: 0;
      }
    }
    /*.title {*/
    /*font-size: 26px;*/
    /*font-weight: bold;*/
    /*color: #001528;*/
    /*!*margin: 0 auto 40px auto;*!*/
    /*text-align: center;*/
    /*}*/
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 20px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
