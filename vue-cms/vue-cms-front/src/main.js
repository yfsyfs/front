/*
入口文件
 */
import Vue from 'vue';
import app from './app.vue'
// 导入mui的样式
import './lib/mui/css/mui.min.css'
// 导入购物车字体图标的样式
import './lib/mui/css/icons-extra.css'

// 按需导入mint-ui中的各个组件，但是发现，按需导入会导致懒加载图标出不来，所以还是采用全部导入
/*import {Header, Swipe, SwipeItem, Button, Lazyload} from 'mint-ui';
Vue.component(Header.name, Header); // 注册 Header组件
Vue.component(Swipe.name, Swipe); // 注册轮播图组件
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Button.name, Button); // 注册按钮组件
Vue.use(Lazyload); // 安装懒加载模块*/

// 下面三行是全部导入
import MintUI from 'mint-ui';

Vue.use(MintUI);
import 'mint-ui/lib/style.css';

// 安装 图片预览插件
import VuePreview from 'vue2-preview'

Vue.use(VuePreview)

import VueRouter from 'vue-router'; // 导入路由组件

import moment from 'moment'; // 导入时间格式化插件
// 定义全局过滤器, 这里默认采用的时间格式是 YYYY-MM-DD HH:mm:ss(注意, YYYY-MM-DD 必须要大写,不然无效)， 除非用户传入了pattern参数，譬如传入了 YYYY-MM-DD（则只取得日期）, 否则就会得到年月日时分秒
Vue.filter('dateFormat', function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
    // 使用格式化时间的插件格式化时间并返回
    return moment(dataStr).format(pattern);
});


Vue.use(VueRouter); // 安装路由模块

import Vuex from 'vuex'; // 导入 vuex
Vue.use(Vuex); // 安装 vuex
var cart = JSON.parse(localStorage.getItem('cart') || '[]'); // 每次刚进入网站，肯定会调用main.js, 则此处就将本地存储中的数据读取出来
var store = new Vuex.Store({ // 构建公共存储对象

    state: {
        cart: cart // 将购物车中的商品的数据, 用一个数组维护起来, 数组的每个元素是 {id: 商品id, count: 购买的数量, price: 商品单价, selected: 此商品在购物车中有没有被选中} 这个样子
    },
    mutations: {
        add2Car(state, goodsinfo) { // 将商品放进购物车
            var flag = false;
            state.cart.some(e => { // 找到了就终止
                if (e.id === parseInt(goodsinfo.id)) { // 如果已经存在此商品了, 我就单纯的增加数量
                    e.count += parseInt(goodsinfo.count);
                    return flag = true; // 返回true, 则终止后续循环
                }
            });
            if (!flag) {
                // 如果没找到, 说明是新的商品, 就直接push进去
                state.cart.push(goodsinfo);
            }
            localStorage.setItem('cart', JSON.stringify(state.cart)); // 持久化, 不然下次进来购物车又是空的了. 注意，localstorage 只支持字符串, 所以要序列化
        },
        updateCount(state, goodsinfo) { // 更新某商品购物数量
            state.cart.some(e => {
                if (e.id === goodsinfo.id) {
                    e.count = goodsinfo.count;
                    localStorage.setItem('cart', JSON.stringify(state.cart)); // 同步到本地存储中去
                    return true;
                }
            });
        },
        removefromcart: (state, productid) => {
            var index = state.cart.findIndex(e => {
                return e.id === productid;
            });
            state.cart.splice(index, 1);
            // 同步到本地存储
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        selectedChange: (state, o) => { // 改变购物车中商品的选中状态
            state.cart.some(e => {
                if (e.id === o.id) {
                    e.selected = o.flag; // 其实取反即可, 完全没必要这么麻烦
                    // 同步到本地存储
                    localStorage.setItem('cart', JSON.stringify(state.cart));
                    return true;
                }
            });
        }
    },
    getters: {
        getAllCount(state) { // 计算购物车商品总数量
            var c = 0;
            state.cart.forEach(e => {
                c += e.count;
            });
            return c;
        },
        getGoodsCount: state => { // 使用匿名函数的写法
            var o = {};
            state.cart.forEach(e => {
                o[e.id] = e.count;
            });
            return o;
        },
        getSelected: state => { // 获取所有商品开关的状态
            var o = {};
            state.cart.forEach(e => {
                o[e.id] = e.selected;
            });
            return o;
        },
        countall: state => { // 计算勾选的商品总件数
            var sum = {count: 0, price: 0};
            state.cart.forEach(e => {
                if (e.selected) { // 如果被选中的话,才计入
                    sum.count += e.count;
                    sum.price += e.count * e.price;
                }
            });
            return sum;
        }
    }
});

import router from './router' // 导入自定义路由模块

// 导入vue-resource模块准备发送数据请求
import VueResource from 'vue-resource';

// 安装vue-resource模块
Vue.use(VueResource);

// 此行代码必须放在上一行后面
Vue.http.options.root = 'http://localhost:3000'; // 设置根域名
Vue.http.options.emulateJSON = true; // 全局设置post时候表单数据格式组织形式

var vm = new Vue({
    el: '#app',
    render: c => c(app),
    router, // 挂载路由对象到vue实例上去
    store // 挂载 vuex 存储
})