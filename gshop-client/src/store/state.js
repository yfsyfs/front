/*
状态对象
 */
export default {
  longitude: 116.36876, // 用户的经度
  latitude: 40.10038, // 用户的纬度
  address: [], // 地址信息对象 这是比 (longitude,latitude) 更加丰富的地址信息, 包括地址名称等， 这是需要调用后端接口才能获得的
  foodtypes: [], // 美食分类数组
  shops: [], // 商家列表
  userInfo: {}, // 用户信息
  goods: [], // 商家商品列表
  rating: [], // 商家评价列表
  info: {}, // 商家信息列表
  cartFoods:[], // 购物车中食物的列表，注意, 因为已经进入了购物车, 所以里面每个食物的 count 属性一定存在, 而且大于0
  searchShops: [] // 搜索得到的商家列表
}
