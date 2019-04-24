<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay = !loginWay">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay = !loginWay">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <!--这里使用prevent防止表单被同步提交导致页面刷新，因为我们需要异步提交-->
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <!--注意, 这里使用了  @click.prevent , 因为这里是一个form表单, 点击任何一个按钮都会导致表单被提交 从而页面刷新 这是不好的-->
              <button :disabled="!rightPhone" class="get_verification" :class="{right_phone:rightPhone}"
                      @click.prevent="getCode">{{coutDown?`${coutDown}s`:'获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="tex" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="密码" v-if="showPassword" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button off" :class="showPassword?'on':'off'" @click="showPassword=!showPassword">
                  <div class="switch_circle" :class="{right:showPassword}"></div>
                  <span class="switch_text">{{showPassword?'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <!--图形验证码其实就是一个svg图片 既可以写本地静态的svg图片, 也可以写 远程路径-->
                <!--<img class="get_verification" src="./images/captcha.svg" alt="captcha">-->
                <img ref="captcha" class="get_verification" src="http://localhost:3000/captcha" alt="图形验证码"
                     @click="getCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alert-text="errMsg" v-show="errMsg" @closeTip="closeLoginErrMsg"></AlertTip>
  </section>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip.vue'
  import {reqSendCode, reqSmsLogin, reqPwdLogin} from "../../api";
  import {RECEIVE_USER_INFO} from "../../store/mutation-types";

  const PHONE_REG = /^1\d{10}/
  export default {
    components: {AlertTip},
    data() {
      return {
        loginWay: false, // true 表示短信登录, false表示密码登录
        phone: '',
        coutDown: 0, // 倒计时
        showPassword: false, // 是否明文显示密码, 一般情况下默认是不显示的
        pwd: '', // 密码
        code: '', // 短信验证码
        name: '', // 用户名
        captcha: '', // 图形验证码
        errMsg: '', // 提示文本
        intervalId: null // 定时器
      }
    },
    computed: {
      rightPhone() {
        return PHONE_REG.test(this.phone)
      }
    },
    methods: {
      async getCode() { // 异步获取短信校验码 做以下两件事情
        // 1. 启动倒计时
        if (!this.coutDown) {  // 只有现在没有倒计时才能点击倒计时
          this.coutDown = 60 // 一般常见的倒计时都是倒计时60秒
          this.intervalId = setInterval(() => {
            this.coutDown--
            if (this.coutDown <= 0) {
              clearInterval(this.intervalId)
              this.intervalId = null  // 清空 防止占内存
            }
          }, 1000);
          // 2. 倒计时的同时，发送ajax请求向指定手机号发送短信校验码(只能在没有倒计时的时候点击之后才发送短信)
          let result = await reqSendCode(this.phone)
          if (result.code === 1) { // 如果发送短信失败
            this.errMsg = result.msg
            if (this.coutDown) { // 如果还在倒计时，就停掉
              this.coutDown = 0
              clearInterval(this.intervalId) // 停止定时器
              this.intervalId = null
            }
          }
        }
      },
      async login() { // 异步登录  注意，这里的登录注册逻辑是这样的, 二合一的那种, 就是你在页面上输入一个不存在的用户名的话, 则就自动给你注册了, 但是如果你输入的用户名本来就存在的话, 则后台就会校验你的密码, 如果错误就不让你登录, 这其实是符合电商逻辑的. 因为为了方便用户注册嘛,越简单越好
        let result // 异步请求后台登录接口的结果
        // 前台表单参数的验证
        if (this.loginWay) { // 短信登录方式
          const {rightPhone, phone, code} = this
          if (!rightPhone) { // 如果手机号不正确
            this.errMsg = '手机号码格式不正确'
            return
          } else if (!/^\d{6}$/.test(code)) { // 如果短信校验码不是6位数字
            this.errMsg = '校验码必须是六位数字'
            return
          } else { // 异步发送ajax 进行短信登录
            result = await reqSmsLogin(phone, code)
          }
        } else { // 用户名密码登录方式
          const {name, pwd, captcha} = this
          if (!name) {
            this.errMsg = '用手机/邮箱/用户名不能为空'
            return
          } else if (!pwd) {
            this.errMsg = '密码必填'
            return
          } else if (!captcha) {
            this.errMsg = '图形验证码不能为空'
            return
          } else {
            // 异步发送ajax 进行用户名密码登录
            result = await reqPwdLogin({name, pwd, captcha})  // 注意，因为 reqPwdLogin的入参进行了解构赋值, 所以要传递的是一个对象（只不过这里使用了es6对象简写）
          }
        }
        // 等到后台登录接口响应成功, 则不论成功还是失败, 都要停止计时器
        if (this.coutDown) { // 如果还在倒计时，就停掉
          this.coutDown = 0
          clearInterval(this.intervalId) // 停止定时器
          this.intervalId = null
        }
        if (result.code === 0) { // 如果用户登录成功
          const user = result.data // 读取到用户信息
          // 做两件事
          // 1. 将user信息保存到 vuex
          this.$store.dispatch(RECEIVE_USER_INFO, user)
          // 2. 跳转到个人中心页面
          this.$router.replace('/profile')
        } else {
          // 读取到登录失败的信息
          this.errMsg = result.msg
          this.captcha = '' // 重置验证码
          // 刷新图形校验码
          this.$refs.captcha.src = 'http://localhost:3000/captcha?_' + Date.now()
        }
      },
      closeLoginErrMsg() { // 关闭提示信息
        this.errMsg = '' // 清空提示信息即可
      },
      getCaptcha(event) { // 获取新的图形验证码  注意, 为了防止缓存导致验证码不变化, 这里加上了 一个时间戳 注意,img的src不会导致跨域请求
        event.target.src = 'http://localhost:3000/captcha?_' + Date.now()
      }
    },
    components: { // 将组件映射成标签
      AlertTip
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .loginContainer
    width 100%
    height 100%
    background #fff

    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto

      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center

        .login_header_title
          padding-top 40px
          text-align center

          > a
            color #333
            font-size 14px
            padding-bottom 4px

            &:first-child
              margin-right 40px

            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774

      .login_content
        > form
          > div
            display none

            &.on
              display block

            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial

              &:focus
                border 1px solid #02a774

            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff

              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent

                &.right_phone /*& 表示父选择器的引用  其实完全可以不用  &, 直接 写 .right_phone 和 .get_verification 平级位置写 也可以达到效果, 我试过 */
                  color: #000

            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff

              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s, border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)

                &.off
                  background #fff

                  .switch_text
                    float right
                    color #ddd

                &.on
                  background #02a774

                > .switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1)
                  transition transform .3s

                  &.right
                    transform translateX(27px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px

              > a
                color #02a774

          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0

        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999

      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px

        > .iconfont
          font-size 20px
          color #999
</style>
