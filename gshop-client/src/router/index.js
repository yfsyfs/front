/*
路由入口
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入各个组件
/*import MSite from '../pages/MSite/MSite.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'
import Search from '../pages/Search/Search.vue'*/
// 下面以 路由懒加载的方式引入四个组件, 而不是像上面四行那样立即加载，注意，这里组件变成了返回路由组件的函数，
// 只有执行此函数才会加载路由组件，这个函数在第一次请求对应路由路径的时候才会执行
// 而且你会在F12的时候, 看到随着下面四个路由的点击, Sources面板的js文件会逐步加载，名称一般是 1.js、2.js、3.js 这种， 这说明后台已经拆分打包了（代码进行了分割）
const MSite = () => import('../pages/MSite/MSite.vue')
const Order = () => import('../pages/Order/Order.vue')
const Profile = () => import('../pages/Profile/Profile.vue')
const Search = () => import('../pages/Search/Search.vue')

import Login from '../pages/Login/Login.vue'
import Shop from "../pages/Shop/Shop";
import ShopGoods from "../pages/Shop/ShopGoods/ShopGoods";
import ShopRating from "../pages/Shop/ShopRating/ShopRating";
import ShopInfo from "../pages/Shop/ShopInfo/ShopInfo";

Vue.use(VueRouter) // 安装插件

export default new VueRouter({
  routes: [
    {
      path: '/msite',
      component: MSite, // 首页
      meta: { // 路由可以通过meta传递自定义数据, 则 $route.meta 中就会有这个数据
        showFooter: true // 是否展示底部导航栏
      }
    },
    {
      path: '/order',
      component: Order,  // 订单
      meta: {
        showFooter: true
      }
    },
    {
      path: '/profile',
      component: Profile,  // 我的
      meta: {
        showFooter: true
      }
    },
    {
      path: '/search',
      component: Search, // 搜索
      meta: {
        showFooter: true
      }
    },
    {
      path: '/login',
      component: Login  // 登录
    },
    {  // 默认显示msite
      path: '/',
      redirect: '/msite'
    },
    {  // 点击店铺列表中的任意一项进入此路由
      path: '/shop',
      component: Shop,
      children: [
        {
          path: '/shop/goods',
          component: ShopGoods
        },
        {
          path: '/shop/rating',
          component: ShopRating
        },
        {
          path: '/shop/info',
          component: ShopInfo
        },
        {
          path: '', // 点击商家列表中的每一项, 默认进入goods路由
          redirect: 'goods'
        }
      ]
    }
  ]
})
