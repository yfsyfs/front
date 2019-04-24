/*
入口js
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {Button} from 'mint-ui'
import './mock/mockServer' // 加载mockServer.js  这种写法用于js没有任何需要暴露的对象, 只是单纯的想让该js执行一下 这种写法在css中也用到过 只有加载进main.js 这个webpack打包入口文件,才能被打包
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'  // 引入图片资源
import './filters' // 执行一下 过滤器即可，不需要引入什么 因为 filter/index.js 也没有对外暴露什么

// 注册全局组件
Vue.component(Button.name, Button)
Vue.use(VueLazyload, {  // 声明使用vue-lazyload 插件，里面自定义了一个指令叫lazy
  loading // 懒加载的时候显示的加载中的图片
})

new Vue({
  el: '#app',
  render: c => c(App),
  router,  // 挂载路由  这样引入路由的话, 就多了 router-view router-link keep-alive this.$router this.$route 这五个点
  store // 使用vuex进行公共数据管理
})
