<template>
    <div class="app-container">
        <!--顶部 header区-->
        <mt-header fixed title="黑马程序员·Vue项目">
            <span slot="left" @click="goback" v-show="flag">
                <mt-button icon="back">返回</mt-button>
            </span>
        </mt-header>
        <!--中间router-view区-->
        <transition>
            <router-view></router-view>
        </transition>
        <!--底部tabbar区-->
        <nav class="mui-bar mui-bar-tab">
            <router-link class="mui-tab-item1" to="/home">
                <span class="mui-icon mui-icon-home"></span>
                <span class="mui-tab-label">首页</span>
            </router-link>
            <router-link class="mui-tab-item1" to="/member">
                <span class="mui-icon mui-icon-contact"></span>
                <span class="mui-tab-label">会员</span>
            </router-link>
            <!--注意，为了这个购物车的字体图标，我们需要导入mui的icons-extra.css以及mui-icons-extra.ttf-->
            <router-link class="mui-tab-item1" to="/shopcar">
                <span class="mui-icon mui-icon-extra mui-icon-extra-cart">
                    <!--这里使用了vuex实现 购物车中商品数量的自动更新-->
                    <span class="mui-badge" id="badge">{{$store.getters.getAllCount}}</span>
                </span>
                <span class="mui-tab-label">购物车</span>
            </router-link>
            <router-link class="mui-tab-item1" to="/search">
                <span class="mui-icon mui-icon-search"></span>
                <span class="mui-tab-label">搜索</span>
            </router-link>
        </nav>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                flag: false // 默认是隐藏的
            }
        },
        methods: {
            goback() { // 点击后退
                // 下面2行哪一行都行
                // this.$router.go(-1);
                this.$router.back();
            }
        },
        watch: {
            '$route.path': function (newval) {
                if (newval === '/home') { // 如果已经到了首页，就不应该再展示返回按钮
                    this.flag = false;
                } else {
                    this.flag = true; // 其他页面不能隐藏, 要展示这个后退按钮
                }
            }
        },
        created() {
            // 如果进来就是 首页
            if (this.$route.path === '/home') {
                this.flag = false;
            } else {
                this.flag = true;
            }
        }
    }
</script>

<style scoped lang="scss">

    /*为了防止在图片列表页面中滑动图片, 导致上面的mint-header部分被覆盖， 所以设置其z-index*/
    .mint-header {
        z-index: 99;
    }

    .app-container {
        padding-top: 40px;
        padding-bottom: 50px; /*防止下面被挡住*/
        overflow-x: hidden; /*这样，就不会在动画右边的往左滚动会产生滚动条了*/
    }

    /*下面是两组切换tab的时候的动画设置*/
    .v-enter {
        opacity: 0;
        transform: translateX(100%);
    }

    /*注意，这里将  .v-enter 和 .v-leave-to 两个离场状态分开来写了，这样的话，就实现了动画右边进来，左边出去*/
    .v-leave-to {
        opacity: 0;
        transform: translateX(-100%);
        /*实现动画切换的时候不往上飘*/
        position: absolute;
    }

    .v-enter-active, .v-leave-active {
        transition: all 0.5s ease;
    }

    /*下面的四组css是为了解决 使用了顶部滑动条之后导致底部tabbar栏无法切换的bug*/
    .mui-bar-tab .mui-tab-item1.mui-active {
        color: #007aff;
    }

    .mui-bar-tab .mui-tab-item1 {
        display: table-cell;
        overflow: hidden;
        width: 1%;
        height: 50px;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #929292;
    }

    .mui-bar-tab .mui-tab-item1 .mui-icon {
        top: 3px;
        width: 24px;
        height: 24px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .mui-bar-tab .mui-tab-item1 .mui-icon ~ .mui-tab-label {
        font-size: 11px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>