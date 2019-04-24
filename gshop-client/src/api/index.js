/*
包含多个接口请求函数的模块  这些接口如下
1、根据经纬度获取位置详情<br/>

2、获取食品分类列表<br/>

3、根据经纬度获取商铺列表<br/>

4、根据经纬度和关键字搜索商铺列表<br/>

5、获取一次性验证码<br/>

6、用户名密码登陆<br/>

7、发送短信验证码<br/>

8、手机号验证码登陆<br/>

9、根据会话获取用户信息<br/>

10、用户登出

所有这些接口返回的都是promise对象

 */

// 导入ajax请求工具类
import ajax from './ajax'

const BASE_URL = '/api'

// 1、根据经纬度获取位置详情
export const reqAddress = geohash => ajax(`${BASE_URL}/position/${geohash}`)

// 2、获取食品分类列表
export const reqFoodsTypes = () => ajax(BASE_URL + '/index_category')

// 3、根据经纬度获取商铺列表 这里使用es6的解构赋值传参 以及 es6的对象简写
export const reqShops = ({longitude, latitude}) => ajax(BASE_URL + '/shops/', {longitude, latitude})

// 4、根据经纬度和关键字搜索商铺列表
export const reqSearchShop = (geohash, keyword) => ajax(`${BASE_URL}/search_shops`, {geohash, keyword})

// 5、获取一次性图形验证码（不需要， 因为图形验证码的变化是直接更改img的src做到的）
// export const reqAddress = geohash => ajax(`/position/${geohash}`)

// 6、用户名密码登陆
export const reqPwdLogin = ({name, pwd, captcha}) => ajax(`${BASE_URL}/login_pwd`, {
  name,
  pwd,
  captcha
}, 'POST')

// 7、发送短信验证码
export const reqSendCode = phone => ajax(`${BASE_URL}/sendcode`, {phone})

// 8、手机号验证码登陆
export const reqSmsLogin = (phone, code) => ajax(`${BASE_URL}/login_sms`, {phone, code}, 'POST')

// 9、根据会话获取用户信息
export const reqUserInfo = () => ajax(`${BASE_URL}/userinfo`)

// 10、用户登出
export const reqLogout = geohash => ajax(`${BASE_URL}/logout`)


// 下面三个接口不需要被代理, 所以不需要以 /api 开头的 下面三个接口是使用mockjs模拟出来的

// 获取商家信息
export const reqShopInfo = () => ajax('/info')

// 获取商家评价
export const reqShopRating = () => ajax('/rating')

// 获取商家商品
export const reqShopGoods = () => ajax('/goods')

