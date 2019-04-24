/*
直接更新state的多个方法的对象
 */

import {
  CLEAR_CART,
  DECREMENT_FOOD_COUNT,
  INCREMENT_FOOD_COUNT,
  RECEIVE_ADDRESS,
  RECEIVE_FOOTYPES, RECEIVE_GOODS,
  RECEIVE_INFO, RECEIVE_RATING, RECEIVE_SEARCH_SHOPS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO
} from "./mutation-types"
import Vue from "vue";

export default {
  // 同步更新地址信息
  [RECEIVE_ADDRESS](state, address) {
    state.address = address
  },

  // 同步设置食品分类列表
  [RECEIVE_FOOTYPES](state, foodtypes) {
    state.foodtypes = foodtypes
  },

  // 同步设置附近商家列表
  [RECEIVE_SHOPS](state, shops) {
    state.shops = shops
  },

  // 同步设置搜索出来的商家列表
  [RECEIVE_SEARCH_SHOPS](state, searchShops) {
    state.searchShops = searchShops
  },

  // 同步保存用户信息
  [RECEIVE_USER_INFO](state, userInfo) {
    state.userInfo = userInfo
  },

  // 重置用户信息
  [RESET_USER_INFO](state) {
    state.userInfo = {}
  },

  // 设置商家信息
  [RECEIVE_INFO](state, info) {
    state.info = info
  },

  // 设置商家评价
  [RECEIVE_RATING](state, rating) {
    state.rating = rating
  },

  // 设置商家商品
  [RECEIVE_GOODS](state, goods) {
    state.goods = goods
  },

  // 增加food中的count值
  [INCREMENT_FOOD_COUNT](state, food) {  // 之所以可以最终更新到goods中去 是因为 指向同一份内存, 传递的是引用
    if (food.count) {
      food.count++ // 不用操作了, 因为 cartFoods引用着此 food, 所以什么都不需要操作
    } else {
      // food.count = 1 // 新增属性这么写是没有数据绑定效果的
      Vue.set(food, 'count', 1) // Vue.set 是用于给有数据绑定的对象添加新的属性的 这样写就让新增的属性也有绑定效果了, 还有一种是 this.$set 后面参数一样, 但是这里得不到 this,, 所以用了Vue的静态方法set
      state.cartFoods.push(food) // 将food添加至cartFoods中
    }
  },

  // 减少food中的count值
  [DECREMENT_FOOD_COUNT](state, food) {
    // 为了 程序健壮一点
    if (food.count) {
      food.count--
      if (!food.count) { // 如果减没了. 需要从 cartFoods中移除它 indexOf还可以使用对象啊
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    }
  },

  [CLEAR_CART](state) { // 清空购物车
    // 清除food中的count
    state.cartFoods.forEach(food => {
      // food.count = 0 // 置零或者delete 都行
      delete food.count
    })
    state.cartFoods = [] // 移除购物车中所有的购物项
  }
}
