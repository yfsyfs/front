<template>
  <section class="msite">
    <HeadreTop :title="address.name">
      <!--点击搜索字体图标的话, 跳转至搜索页面-->
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <router-link class="header_login" slot="right" :to="userInfo._id?'/userinfo':'/login'">
        <!--如果用户已经登录的话, 就展示头像小图标-->
        <span class="header_login_text" v-if="userInfo._id">
          <i class="iconfont icon-person"></i>
        </span>
        <!--否则展示登录/注册-->
        <span class="header_login_text" v-else>登录|注册</span>
      </router-link>
    </HeadreTop>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="foodtypes.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categories,index) in categoriesArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category, index) in categories" :key="index">
              <div class="food_container">
                <!--<img :src="baseImgUrl+category.image_url">-->
                <!--图片懒加载写法-->
                <img v-lazy="baseImgUrl+category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" alt="back" v-else/>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList></ShopList>
    </div>
  </section>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css' // 注意, 引入 第三方包中的css 和引入自定义的css的不同, 后者使用 @import
  import {mapState} from 'vuex'

  import HeadreTop from '../../components/HeaderTop/HeaderTop.vue'
  import ShopList from '../../components/ShopList/ShopList.vue'
  import {RECEIVE_FOOTYPES, RECEIVE_SHOPS} from "../../store/mutation-types";

  export default {
    data() {
      return {
        baseImgUrl: 'https://fuss10.elemecdn.com'
      }
    },
    components: {
      HeadreTop,
      ShopList
    },
    computed: {
      ...mapState(['address', 'foodtypes', 'userInfo']), // 读取地址信息、食品分类信息、用户信息
      categoriesArr() { // 使用上面的foodtypes生成一个二维数组 categoriesArr 其中小数组的长度最多为8
        const categoriesArr = []
        let categories = []
        this.foodtypes.forEach(e => {
          categories.push(e)
          if (categories.length === 8) {
            categoriesArr.push(categories)
            categories = []
          }
        })
        if (categories.length) {
          categoriesArr.push(categories)
        }
        return categoriesArr
      }
    },
    mounted() {
      this.$store.dispatch(RECEIVE_FOOTYPES)  // 异步获取食品分类列表数据 用于展示轮播图
      this.$store.dispatch(RECEIVE_SHOPS) // 异步获取附近商家列表
    },
    watch: { // 之所以要监视foodtypes，是因为一开始 foodtypes 是空数组(记住,上面的dispatch是异步的), 但是foodtypes是计算属性啊, 所以store中的foodtypes一旦通过ajax请求到了, 是会异步更新界面dom的, 这里监视完全就是为了重新为轮播图组件绑定js行为而已
      foodtypes() {  // 监视 foodtypes 的变化, 一旦数据变化, 则这里就会监视到, 但是界面的更新也是异步的, 所以必须要让轮播图组件的js行为的添加放在界面dom更新的后面, $nextTick 就是做这个事情的
        this.$nextTick(() => {
          // 创建一个swiper实例(其实就是为上图中的swiper-container这个html结构使用js控制行为) 来实现轮播  如果这个回调函数不放在 $nextTick的回调中，而直接放在foodtypes的watch函数中的话, 则属性更新之后不等界面dom更新就立马执行下面的轮播图js行为赋值是没有意义的,因为dom结构此时都没有生成(因为dom界面更新是异步于数据更新的), 你加js有什么意义呢?
          new Swiper('.swiper-container', {
            loop: true, // 循环轮播
            pagination: { // 需要分页器
              el: '.swiper-pagination'
            }
          })
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .msite //首页
    width 100%

    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff

      .swiper-container
        width 100%
        height 100%

        .swiper-wrapper
          width 100%
          height 100%

          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap

            .link_to_food
              width 25%

              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0

                img
                  display inline-block
                  width 50px
                  height 50px

              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666

        .swiper-pagination
          > span.swiper-pagination-bullet-active
            background #02a774

    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff

      .shop_header
        padding 10px 10px 0

        .shop_icon
          margin-left 5px
          color #999

        .shop_header_title
          color #999
          font-size 14px
          line-height 20px

</style>
