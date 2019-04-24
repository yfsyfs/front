<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <!--只有购物车中有购物, 购物车才是亮的 不然就是暗的-->
            <div class="logo" :class="{highlight: totalCount}">
              <!--只有购物车中有购物, 购物车才是亮的 不然就是暗的-->
              <i class="iconfont icon-shopping_cart" :class="{highlight: totalCount}">
              </i>
            </div>
            <!--购物车图标右上角的数字 只有在你购物了才显示-->
            <div class="num" v-if="totalCount">
              {{totalCount}}
            </div>
          </div>
          <div class="price" :class="{highlight: totalCount}">
            ￥{{totalPrice}}
          </div>
          <div class="desc">
            另需配送费￥{{info.deliveryPrice}} 元
          </div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            {{payText}}
          </div>
        </div>
      </div>
      <transition name="move">
        <!--是否显示 不仅仅看 isShow, 还要看 购物车中是否有商品-->
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">
              购物车
            </h1>
            <span class="empty" @click="clearCart">
					清空
				</span>
          </div>
          <div class="list-content">
            <ul>
              <li class="food" v-for="(food, index) in cartFoods" :key="index">
						<span class="name">
              {{food.name}}
						</span>
                <div class="price">
							<span>
								￥{{food.price}}
							</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"></CartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
    </transition>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import CartControl from "../CartControl/CartControl"
  import BScroll from 'better-scroll'
  import {MessageBox} from 'mint-ui'

  export default {
    components: {CartControl},
    data() {
      return {
        isShow: false,
        scroll: null  // 为了保证滚动购物车列表是单例的, 不然的话, 你切换几次购物车列表，则再单击购物车列表中的CartControl 组件的话, 增加的就不止是1了, 增加的是创建的BScroll的个数这么多, 因为每个 BScroll实例分发了一次点击事件 所以才要保证单例
      }
    },
    computed: {
      ...mapState(['cartFoods', 'info']), // 将 用户已经购买的商品存入 vuex
      ...mapGetters(['totalCount', 'totalPrice']),
      payClass() { // 样式
        const {totalPrice} = this // 目前购物车中的总价格
        const {minPrice} = this.info // 本店最低消费
        return totalPrice >= minPrice ? 'enough' : 'not-enough'
      },
      payText() { // 需要显示的文本
        const {totalPrice} = this
        const {minPrice} = this.info
        if (totalPrice === 0) {
          return `￥${minPrice}元起送`
        } else if (totalPrice < minPrice) {
          return `还差￥${minPrice - totalPrice}元起送`
        } else {
          return '结算'
        }
      },
      listShow() {
        if (!this.cartFoods.length) {
          return this.isShow = false
        }
        if (this.isShow) {  // 只有购物车里面的数据不为空, 并且确定要显示, 才包装成滚动列表
          this.$nextTick(() => { // 在页面dom显示完成之后才执行
            if (!this.scroll) { // 只有不存在，才创建, 保证单例.
              this.scroll = new BScroll('.list-content', { // 让购物车列表能滚动
                click: true
              })
            } else {
              this.scroll.refresh() // 让滚动条刷新一波，重新统计内容的高度，看看要不要形成滚动，这是为了防止第一次购物不多（<=4）的时候, 就展示购物车列表, 自然不会形成滚动, 第二次选择多了几样，再次点开购物车列表，则第一次购物车是不会拉动的，要第二次才能拉动. 而这里refresh之后第一次就能拉动, 因为BScroll重新计算了,发现需要加滚动, 这里和 ShoopGoods 组件中的BScroll还不一样, 那里的列表一旦形成就不会改了, 所以可以不用refresh方法, 而这里的列表高度是变化的,动态的
            }
          })
        }
        return this.isShow
      }
    },
    methods: {
      toggleShow() {
        if (this.totalCount) {  // 只有存在购物的时候,才给你切换
          this.isShow = !this.isShow
        }
      },
      clearCart() { // 清空购物车
        MessageBox.confirm('确定清空购物车?').then(action=>{ // 这里仅仅指定了 用户点击确定之后的回调，而没有指定用户点击取消的回调, 则控制台会报  Uncaught (in promise) cancel 但是没有关系 或者干脆这里写上(一个空的. 啥也不用干)
          this.$store.dispatch('clearCart')
        },()=>{})
      }
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px

    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)

      .content-left
        flex 1

        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27

          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c

            &.highlight
              background $green

            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a

              &.highlight
                color #fff

          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)

        .price
          display inline-block
          vertical-align top
          margin-top 5px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          font-size 16px
          font-weight 700
          color #fff

          &.highlight
            color #fff

        .desc
          display inline-block
          vertical-align bottom
          margin-bottom 15px
          margin-left -45px
          font-size 10px

      .content-right
        flex 0 0 105px
        width 105px

        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          color #fff

          &.not-enough
            background #2b333b

          &.enough
            background #00b43c
            color #fff

    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)

        .inner
          width 16px
          height 16px
          border-radius 50%
          background $green
          transition all 0.4s linear

    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1 /*尽管是-1. 但是他的父元素 shopcart 的z-index 是 50, 比 list-mask 的40来的高, 所以依旧会压在 list-mask 上面, 所以你点击 .shopcart-list 不会触发 list-mask的点击事件切换显示状态*/
      width 100%
      transform translateY(-100%) /*注意 translate 的百分比是以自己为标准的 而不是以父亲*/

      &.move-enter-active, &.move-leave-active
        transition transform .5s

      &.move-enter, &.move-leave-to
        transform translateY(0)

      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)

        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)

        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)

      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff

        .food
          position relative
          padding 12px 0
          box-sizing border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))

          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)

          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)

          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)

    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s

    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
