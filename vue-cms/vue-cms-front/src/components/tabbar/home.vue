<template>
    <div>
        <!--轮播图区域 首页的轮播图宽度 100%, 需要占满整个 区域-->
        <swiper :lunbotulist="swipeList" :isfull="true"></swiper>
        <!--六宫格  在 mui的example中找的-->
        <ul class="mui-table-view mui-grid-view mui-grid-9">
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
                <router-link to="/home/newslist">
                    <img src="../../images/menu1.png" alt="图片走丢了...">
                    <div class="mui-media-body">新闻资讯</div>
                </router-link>
            </li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/photolist">
                <img src="../../images/menu2.png" alt="图片走丢了...">
                <div class="mui-media-body">图片分享</div>
            </router-link></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/goodslist">
                <img src="../../images/menu3.png" alt="图片走丢了...">
                <div class="mui-media-body">商品购买</div>
            </router-link></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                <img src="../../images/menu4.png" alt="图片走丢了...">
                <div class="mui-media-body">留言反馈</div>
            </a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                <img src="../../images/menu5.png" alt="图片走丢了...">
                <div class="mui-media-body">视频专区</div>
            </a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                <img src="../../images/menu6.png" alt="图片走丢了...">
                <div class="mui-media-body">联系我们</div>
            </a></li>
        </ul>
    </div>
</template>

<script>

    import {Toast} from 'mint-ui';

    // 导入轮播图组件
    import swiper from '../subcomponents/swiper.vue'

    export default {
        data() {
            return {
                swipeList: [] // 保存轮播图的数组
            }
        },
        created() {
            this.getSwipe();
        },
        methods: {
            getSwipe() { // 获取轮播图数据的方法, 注意，因为 vue-resource设置了根域名，所以这里不能带/
                this.$http.get('api/getlunbo').then(result => {
                    if (result.body && result.body.status === 0) {
                        this.swipeList = result.body.message;
                    } else {
                        // 提示用户获取轮播图数据失败
                        Toast('加载轮播图数据失败!')
                    }
                }, function () {
                    Toast('加载轮播图数据失败了!');
                })
            }
        },
        components: { // 注册为子组件
            swiper
        }
    }
</script>

<style scoped lang="scss">

    /*.mui-grid-view.mui-grid-9 这个类名是我直接从ul的背景色对应的class粘过来的, 不要自己写，因为可能写的样式权重没有原本的高，导致你怎么写也没用 下面的设置边框的也是同理*/
    .mui-grid-view.mui-grid-9 {
        background-color: white;
        border: none;

        img {
            width: 60px;
            height: 60px;
        }

        .mui-media-body {
            font-size: 13px;
        }
    }

    .mui-grid-view.mui-grid-9 .mui-table-view-cell {
        border: none;
    }
</style>