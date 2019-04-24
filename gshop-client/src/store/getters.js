/*
包含多个基于state的getter计算属性的对象
 */
export default {
  totalCount(state) { // 计算购物总数量
    return state.cartFoods.reduce((prev, food) =>
        prev += food.count
      , 0)
  },

  totalPrice(state) { // 计算购物总价值
    return state.cartFoods.reduce((prev, food) =>
        prev += food.count * food.price
      , 0)
  },

  positiveSize(state) { // 赞的评价的数量
    return state.rating.reduce((prev, r) => prev + (r.rateType === 0 ? 1 : 0), 0)
  }
}
