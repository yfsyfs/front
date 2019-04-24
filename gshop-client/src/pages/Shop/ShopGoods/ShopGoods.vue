<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <li class="menu-item" v-for="(good, index) in goods" :key="index" :class="{current: index===currentIndex}"
              @click="clickMenuItem(index)">
						<span class="text bottom-border-1px">
              <!--如果没有图片就不显示了-->
							<img class="icon" :src="good.icon" v-if="good.icon">
							{{good.name}}
						</span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="foodsUl">
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">
              {{good.name}}
            </h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index"
                  @click="showFood(food)">
                <div class="icon">
                  <!--<img width="57" height="57" :src="food.icon">-->
                  <!--图片懒加载-->
                  <img width="57" height="57" v-lazy="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">
                    {{food.name}}
                  </h2>
                  <p class="desc">
                    {{food.description}}
                  </p>
                  <div class="extra">
										<span class="count">
											月售 {{food.sellCount}} 份
										</span>
                    <span>
											好评率 {{food.rating}}%
										</span>
                  </div>
                  <div class="price">
										<span class="now">
											￥{{food.price}}
										</span>
                    <span class="old" v-if="food.oldPrice">
											￥{{food.oldPrice}}
										</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"></CartControl>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--购物车组件-->
      <ShopCart></ShopCart>
    </div>
    <Food :food="food" ref="food"></Food>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import BScroll from 'better-scroll'
  import CartControl from '../../../components/CartControl/CartControl.vue'
  import Food from '../../../components/Food/Food.vue'
  import ShopCart from '../../../components/ShopCart/ShopCart.vue'

  export default {
    data() {
      return {
        scrollY: 0, // 右侧滑动的Y轴坐标
        tops: [], // 所有右侧分类的li的top数组（列表第一次显示就不再变化）
        foodsScroll: null, // 右侧列表滚动条
        food: {} // 用户点击的食物
      }
    },
    mounted() {
      // 异步获取商家的商品列表 之后 执行回调函数  这和在我们处理 轮播图的时候使用的 watch+this.$nextTick 处理技巧达到的效果是一样的
      this.$store.dispatch('getShopGoods', () => {
        this.$nextTick(() => { // 因为界面更新是异步的, 所以依旧还要使用 $nextTick
          this._initScroll() // 初始化better-scroll滚动条
          this._initTops() // 初始化各个li的top值构成的数组
        })
      })
    },
    computed: {
      ...mapState(['goods']),
      currentIndex() {  // 计算得到当前分类的下标, 因为计算属性执行的时机有2 个, 一个是初始化的时候, 一个是相关属性发生变化的时候
        let {scrollY, tops} = this
        // 下面是一种方法
        /*let ret = 0
        while (scrollY >= tops[ret + 1]) {
          ret++
        }
        return ret*/
        // 下面是使用es6 中的另一种写法(优雅)
        return tops.findIndex((top, index) => {
          return scrollY >= tops[index] && scrollY < tops[index + 1]
        })
      }
    },
    methods: {
      // 这里 _ 开头的方法表示非事件回调方法, 以示区分
      _initScroll() { // 初始化better-scroll滚动条(有2个滚动条, 左边一个 食品列表一个)
        new BScroll('.menu-wrapper', { // 注意, 包装的是要滚动的父元素
          click: true  // 则你点击这个滚动条的时候会给你派发click事件, 默认false 就是不会给你派发
        }) // 列表数据ajax请求到位之后，界面也更新完毕了，则再使用better-scroll给 menu-wrapper 添加js行为
        this.foodsScroll = new BScroll('.foods-wrapper', {
          probeType: 2, // 注意, 滚动有3种, 一种是手一直按在屏幕上滑动, 一种是咔的一下，随着惯性滑动， 还有一种就是js编码的方式让其滑动, 譬如点击左边分类的滚动条促成的滑动
          // 这里probeType  取1的话, 只有滑动了一点点之后才开始回调. 而且不会因为惯性而回调
          // 取值为2的话, 则滑动一点点就会回调，但是不会因为惯性而回调, 取值为3的话, 则是最敏感的, 滑动一点点， 因为惯性都会回调
          click: true
        }) // 给食物分类列表加上滚动条
        // 给右侧滚动列表绑定监听
        this.foodsScroll.on('scroll', ({x, y}) => { // x记录了水平滑动的距离, y记录了垂直滑动的距离
          this.scrollY = Math.abs(y)
        })
        // 给右侧滚动列表绑定监听
        this.foodsScroll.on('scrollEnd', ({x, y}) => { // 监听滚动停止的事件  这是一种做法, 即如果用户咔的一下滑动的话, 则凭借惯性滑动, 最终左侧栏也要变化, 另一种简单的就是将上面的probeType改成3
          this.scrollY = Math.abs(y)
        })
      },
      _initTops() { // 初始化tops数组
        const tops = []
        let top = 0
        tops.push(top)
        // 先取得所有分类的li 这里有一个优化的小技巧, 如果你直接  document.getElementsByClassName('food-list-hook')的话, 就是在整个页面找class为 food-list-hook 的li列表
        // 而这里通过refs快速定位到食品列表的ul元素, 然后找就快多了
        // const lis = this.$refs.foodsUl.getElementsByClassName('food-list-hook')
        // 使用children 也可以（除了上面的 getElementsByClassName('food-list-hook') 之外）
        const lis = this.$refs.foodsUl.children
        Array.prototype.slice.call(lis).forEach(li => {
          top += li.clientHeight
          tops.push(top)
        })
        this.tops = tops
      },
      clickMenuItem(index) { // 点击左侧列表栏触发右侧列表栏滚动
        this.scrollY = -this.tops[index]  // 先让 this.scrollY 改变, 则触发计算属性重新求值 currentIndex, 改变current属性, 即说白了就是要先更新样式,再动画滚动右边分类列表
        this.foodsScroll.scrollTo(0, -this.tops[index], 300) // 花费0.3秒垂直滚动到 -this.tops[index] 处，即向下滚动
      },
      showFood(food) {
        this.food = food // 传递给子组件
        this.$refs.food.toggleShow() // 父组件调用子组件的方法
      }
    },
    components: {
      CartControl,
      Food,
      ShopCart
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden

    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7

      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px

        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700

          .text
            border-none()

      .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px 12px
        background-repeat: no-repeat

      .text
        display: table-cell
        width: 56px
        vertical-align: middle
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px

    .foods-wrapper
      flex: 1

      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7

      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))

        &:last-child
          border-none()
          margin-bottom: 0

        .icon
          flex: 0 0 57px
          margin-right: 10px

        .content
          flex: 1

          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)

          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)

          .desc
            line-height: 12px
            margin-bottom: 8px

          .extra
            .count
              margin-right: 12px

          .price
            font-weight: 700
            line-height: 24px

            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)

            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)

          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
