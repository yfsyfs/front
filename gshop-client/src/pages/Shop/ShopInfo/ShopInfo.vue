<template>
  <div class="shop-info">
    <div class="info-content">
      <section class="section">
        <h3 class="section-title">
          配送信息
        </h3>
        <div class="delivery">
          <div>
						<span class="delivery-icon">
							{{info.description}}
						</span>
            <span>
							由商家配送提供配送， 约 {{info.deliveryTime}} 分钟送达， 距离 {{info.distance}}m
						</span>
          </div>
          <div class="delivery-money">
            配送费￥{{info.deliveryPrice}}
          </div>
        </div>
      </section>
      <div class="split">
      </div>
      <section class="section">
        <h3 class="section-title">
          活动与服务
        </h3>
        <div class="activity">
          <div class="activity-item" v-for="(support,index) in info.supports" :key="index"
               :class="supportClasses[support.type]">
						<span class="content-tag">
							<span class="mini-tag">
								{{support.name}}
							</span>
						</span>
            <span class="activity-content">
							{{support.content}}
						</span>
          </div>
        </div>
      </section>
      <div class="split">
      </div>
      <section class="section">
        <h3 class="section-title">
          商家实景
        </h3>
        <div class="pic-wrapper">
          <ul class="pic-list" ref="picsUl">
            <li class="pic-item" v-for="(pic, index) in info.pics" :key="index">
              <img width="120" height="90" :src="pic"
              />
            </li>
          </ul>
        </div>
      </section>
      <div class="split">
      </div>
      <section class="section">
        <h3 class="section-title">
          商家信息
        </h3>
        <ul class="detail">
          <li>
						<span class="bold">
							品类
						</span>
            <span>
							{{info.category}}
						</span>
          </li>
          <li>
						<span class="bold">
							商家电话
						</span>
            <span>
              {{info.phone}}
						</span>
          </li>
          <li>
						<span class="bold">
							地址
						</span>
            <span>
              {{info.address}}
						</span>
          </li>
          <li>
						<span class="bold">
							营业时间
						</span>
            <span>
              {{info.workTime}}
						</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import BScroll from 'better-scroll'

  export default {
    data() {
      return {
        supportClasses: ['activity-green', 'activity-red', 'activity-orange']
      }
    },
    computed: {
      ...mapState(['info'])  // 读取商家属性
    },
    mounted() { // 注意, 这里让可以滑动并没有监视（watch）info, 因为路由组件传过来就是有info数据的. 而且还是固定不变的, 所以watch没用(info在Shop组件创建的时候就发送ajax请求去取了)

      if (!this.info.pics) {  // 如果还没有数据, 譬如用户直接在地址栏输入http://localhost:8080/#/shop/info， 直接进入这个路由（虽然几乎不可能），则直接结束, 不然下面的代码报错info 未定义, 或者还有一种情况，就是用户先通过别的路由跳转过来，但是用户刷新了页面，则vuex清空了, 则导致页面又不能滚动 这很影响用户体验的, 解决方案就是watch info这个数据, 为什么info会有? 因为本组件是嵌套在 Shop组件中的，而Shop组件会发ajax请求商家数据的(reqShopInfo请求)
        return
      }

      this._initScroll()
    },
    methods: {
      _initScroll() {
        // 能进行下面的代码，说明数据有了，说明是从别的路由切换过来的（譬如用户的正常操作）
        new BScroll('.shop-info') // 注意, 为什么这里不需要放在 $nextTick 里面了, 这是因为 一开始进到Shop.vue 中来的时候, 有三个路由, 但是默认进入的是 点餐(ShopGoods) 路由,另外两个路由组件（ShopRating和ShopInfo）还没有创建,但是他们需要的数据info已经在ShopGoods(确切讲是Shop的mounted)的时候创建完毕了, 所以进到ShopInfo组件中来的时候, 特别是这里 mounted阶段的时候, 页面dom已经完成绘制了, 所以进行滑动化是没有任何问题的

        // 动态计算 ul的宽度
        const ul = this.$refs.picsUl // 找到 picsUl

        const liWidth = 120  // 每个 li 的宽度

        const space = 6 // li之间的缝隙

        const count = this.info.pics.length // 几个li

        ul.style.width = (liWidth + space) * count - space + 'px'  // 切记不要忘了px

        new BScroll('.pic-wrapper', {
          scrollX: true // 水平滚动
        })
      }
    },
    watch: {
      info() { // 如果用户来到了这个路由，然后刷新了页面的话, 则要等一会儿, info才到, 因为Shop组件会发送ajax去请求数据的(本组件是Shop组件的子组件), 防止了用户刷新本路由页面就不能滑动了
        this._initScroll()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"

  .shop-info
    position: absolute
    top: 195px
    bottom: 0
    left: 0
    width: 100%
    background: #fff;
    overflow: hidden

    .section
      padding 16px 14px 14px
      font-size 16px
      background-color #fff
      color #666
      border-bottom 1px solid #eee
      position relative

      .section-title
        color #000
        font-weight 700
        line-height 16px

        > .iconfont
          float right
          color #ccc

      .delivery
        margin-top 16px
        font-size 13px
        line-height 18px

        .delivery-icon
          width 55px
          font-size 11px
          margin-right 10px
          display inline-block
          text-align center
          color #fff
          background-color #0097ff
          padding 1px 0
          border-radius 4px

        .delivery-money
          margin-top 5px

      .activity
        margin-top 16px

        .activity-item
          margin-bottom 12px
          display flex
          font-size 13px
          align-items center

          &.activity-green
            .content-tag
              background-color rgb(112, 188, 70)

          &.activity-red
            .content-tag
              background-color rgb(240, 115, 115)

          &.activity-orange
            .content-tag
              background-color: rgb(241, 136, 79)

          .content-tag
            display inline-block
            border-radius 2px
            width 36px
            height: 18px
            margin-right 10px
            color #fff
            font-style normal
            position relative

            .mini-tag
              position absolute
              left 0
              top 0
              right -100%
              bottom -100%
              font-size 24px
              transform scale(.5)
              transform-origin 0 0
              display flex
              align-items center
              justify-content center

      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        margin-top 16px

        .pic-list
          font-size: 0

          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px

            &:last-child
              margin: 0

      .detail
        margin-bottom -16px

        > li
          display flex
          justify-content space-between
          align-items center
          margin-right -10px
          padding 16px 12px 16px 0
          line-height 16px
          bottom-border-1px(#ddd)
          font-size 13px

          > .bold
            font-weight 700
            color #333

          &:last-child
            border-none()


    .split
      width: 100%
      height: 16px
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      background: #f3f5f7
</style>
