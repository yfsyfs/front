/*
抽离路由模块
 */
import VueRouter from 'vue-router';

// 导入各个vue组件
import home from './components/tabbar/home.vue';
import member from './components/tabbar/member.vue';
import shopcar from './components/tabbar/shopcar.vue';
import search from './components/tabbar/search.vue';
import newslist from './components/news/newslist.vue'
import newsinfo from './components/news/newsinfo.vue'
import photolist from './components/photo/photolist.vue'
import photoinfo from './components/photo/photoinfo.vue'
import goodslist from './components/goods/goodslist.vue';
import goodsinfo from './components/goods/goodsinfo.vue';
import goodsdesc from './components/goods/goodsdesc.vue';
import goodscomment from './components/goods/goodscomment.vue';

var router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: home
        },
        {
            path: '/member',
            component: member
        },
        {
            path: '/shopcar',
            component: shopcar
        },
        {
            path: '/search',
            component: search
        },
        // 注意 这里newslist并没有成为子组件，而是平级的组件，因为它仍然要和home平级的占坑
        {
            path: '/home/newslist',
            component: newslist
        },
        {
            // RESTful风格的路由
            path: '/home/newsinfo/:id',
            component: newsinfo
        },
        {
            path: '/home/photolist',
            component: photolist
        },
        {
            path: '/home/photoinfo/:id',   // 图片详情组件
            component: photoinfo
        },
        {
            path: '/home/goodslist',  // 商品列表
            component: goodslist
        },
        {
            path: '/home/goodsinfo/:goodsid', // 商品信息组件
            component: goodsinfo,
            name: 'goodsinfo'   // 为了编程式路由导航,我们给此路由起了一个名字
        },
        {
            path: '/home/goodsdesc/:id', // 图文介绍组件
            component: goodsdesc,
            name: 'goodsdesc'
        },
        {
            path: '/home/goodscomment/:id', // 商品评论组件
            component: goodscomment
        }
    ],
    linkActiveClass: 'mui-active' // 覆盖默认的vue-router的高亮的类（默认的叫做router-link-active）
})

// 通过es6将我们的路由暴露出去
export default router;