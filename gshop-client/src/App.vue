<template>
  <div id="app">
    <router-view></router-view>
    <!--仅仅在首页、搜索、订单、我的 四个模块中显示底部导航栏 完全可以使用计算属性来解决-->
    <!--<FooterGuide v-show="show"></FooterGuide>-->
    <!--下面是视频中解决仅仅在首页、搜索、订单、我的 四个模块中显示底部导航栏的方法-->
    <FooterGuide v-show="$route.meta.showFooter"></FooterGuide>
  </div>
</template>

<script>
  import FooterGuide from './components/FooterGuide/FooterGuide.vue'
  import {GET_USER_INFO, RECEIVE_ADDRESS} from "./store/mutation-types";
  import {mapActions} from "vuex";

  export default {
    mounted() {
      this[RECEIVE_ADDRESS]()  // 异步获取地址信息的另一种写法(但是需要写下面的methods, 不是很方便 最方便也是最常见的是直接使用this.$store.dispatch)
      this[GET_USER_INFO]() // 异步获取用户信息 因为vuex是只存在于页面中，类似于js的全局变量, 所以重新刷新页面的话, 则vuex中的userInfo会消失, 所以刷新之后就要重新从服务器端获取用户信息（by cookie）
    },
    components: {
      FooterGuide
    },
    methods: {
      ...mapActions([RECEIVE_ADDRESS, GET_USER_INFO])
    }
    /*computed: {
      show() {
        return (this.$route.path === '/msite') || (this.$route.path === '/search') || (this.$route.path === '/order') || (this.$route.path === '/profile')
      }
    }*/
  }
</script>

<!--css预编译器使用 stylus-->
<style lang="stylus" rel="stylesheet/stylus">
  #app
    /*width 100%*/   /*注意, app 不要设置高度, 不然的话, 则后面在Search组件搜索出很多结果的时候, 因为app高度限制死了, 则不会出现滚动条 你试一下就知道了*/
    /*height 100%*/
    /*background #f5f5f5*/
</style>
