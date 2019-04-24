/*
通过mutations间接更新state的多个方法的对象
 */
import {
  CLEAR_CART,
  DECREMENT_FOOD_COUNT,
  GET_USER_INFO, INCREMENT_FOOD_COUNT,
  RECEIVE_ADDRESS,
  RECEIVE_FOOTYPES, RECEIVE_GOODS, RECEIVE_INFO, RECEIVE_RATING, RECEIVE_SEARCH_SHOPS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO
} from "./mutation-types";
import {
  reqAddress,
  reqFoodsTypes,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopInfo,
  reqShopGoods,
  reqShopRating,
  reqSearchShop
} from "../api";

export default {

  // 异步获取地址信息
  async [RECEIVE_ADDRESS]({commit, state}) { // actions的第一个入参默认包含 commit对象和 state对象
    // 发送ajax和数据后台交互
    const result = await reqAddress(state.latitude + ',' + state.longitude)
    // 调用mutations
    if (result.code === 0) {
      commit(RECEIVE_ADDRESS, result.data)
    }
  },

  // 异步获取食品分类列表
  async [RECEIVE_FOOTYPES]({commit}) { // actions的第一个入参默认包含 commit对象和 state对象
    // 发送ajax
    const result = await reqFoodsTypes()
    // 调用mutations
    if (result.code === 0) {
      commit(RECEIVE_FOOTYPES, result.data)
    }
  },

  // 异步获取附近商家列表
  async [RECEIVE_SHOPS]({commit, state}) { // actions的第一个入参默认包含 commit对象和 state对象
    let {longitude, latitude} = state // 解构赋值
    // 发送ajax
    const result = await reqShops(longitude, latitude)
    // 调用mutations
    if (result.code === 0) {
      commit(RECEIVE_SHOPS, result.data)
    }
  },

  // 同步记录用户信息
  [RECEIVE_USER_INFO]({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, userInfo)
  },

  // 异步获取用户信息
  async [GET_USER_INFO]({commit}) {
    const result = await reqUserInfo()
    if (result.code === 0) { // 如果请求成功
      const userInfo = result.data
      commit(RECEIVE_USER_INFO, userInfo) // 保存到vuex中去
    }
  },

  // 异步登出
  async logout({commit}) {
    const result = await reqLogout()
    if (result.code === 0) { // 如果请求成功
      const userInfo = result.data
      commit(RESET_USER_INFO) // 保存到vuex中去
    }
  },


  // 异步获取商家信息
  async getShopInfo({commit}) {
    const result = await reqShopInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RECEIVE_INFO, info)
    }
  },

  // 异步获取搜索的商家信息
  async searchShops({commit, state}, keyword) {
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqSearchShop(geohash, keyword)
    if (result.code === 0) {
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS, searchShops)
    }
  },

  // 异步获取商家评价列表
  async getShopRating({commit}) {
    const result = await reqShopRating()
    if (result.code === 0) {
      const rating = result.data
      commit(RECEIVE_RATING, rating)
    }
  },

  // 异步获取商家商品列表 其中 cb 是回调
  async getShopGoods({commit}, cb) {
    const result = await reqShopGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_GOODS, goods)
      // 因为 mutations是同步方法, 所以此时数据已经到位了
      // 如果传入了回调函数的话， 执行之
      cb && cb()
    }
  },

  // 同步更新food中的count值
  updateFoodCount({commit}, {isAdd, food}) {
    if (isAdd) {
      commit(INCREMENT_FOOD_COUNT, food)
    } else {
      commit(DECREMENT_FOOD_COUNT, food)
    }
  },

  // 同步清空购物车
  clearCart({commit}) {
    commit(CLEAR_CART)
  },

  // 异步获取商家评价列表
  async getShopRatings({commit}, callback) {
    const result = await reqShopRating()
    if (result.code === 0) {
      const ratings = result.data
      commit(RECEIVE_RATING, ratings)
      // 数据更新了, 通知一下组件
      callback && callback()
    }
  },
}
