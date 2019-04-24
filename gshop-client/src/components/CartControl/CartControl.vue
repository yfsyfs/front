<template>
  <div class="cartcontrol">
    <!--减号-->
    <!--注意,数字以及减号只在food.count有值的时候才显示-->
    <transition name="move">
      <div class="iconfont icon-remove_circle_outline" v-if="food.count" @click.stop="updateFoodCount(false)"></div>
    </transition>
    <div class="cart-count" v-if="food.count">{{food.count}}</div>
    <!--加号 因为有了Food组件的遮罩层,所以要阻止事件冒泡-->
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script>
  export default {
    props: {
      food: Object // 即此cartcontrol组件是哪个食物的cartcontrol组件
    },
    methods: {
      updateFoodCount(isAdd) {
        // actions也只能最多接受一个参数
        this.$store.dispatch('updateFoodCount', {isAdd, food: this.food})
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .cartcontrol
    font-size: 0

    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)

    .icon-remove_circle_outline
      display: inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color $green
      /*给购物车的减号加平移旋转的动画*/
      &.move-enter-active, &.move-leave-active
        transition all .3s

      &.move-enter, &.move-leave-to
        opacity 0
        transform translateX(15px) rotate(180deg)

    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)

    .icon-add_circle
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color $green
</style>
