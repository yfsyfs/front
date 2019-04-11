<template>
    <div class="goodsinfo-container">
        <!--因为是半场动画，所以不能使用active-leave之类的, 必须要使用下面的钩子函数-->
        <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <!--小球(默认是隐藏的) 实现点击 加入购物车, 小球落到购物车的动画-->
            <div class="ball" v-show="ballFlag" ref="ball"></div>
        </transition>
        <!--下面的卡片视图组件是从 mui的examples中的card.html 中拷贝来的-->
        <!-- 商品轮播图区域 -->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <!--商品详情的轮播图不需要宽度 100% 而是自适应-->
                    <swiper_component :lunbotulist="lunbo" :isfull="false"></swiper_component>
                </div>
            </div>
        </div>


        <!-- 商品购买区域 -->
        <div class="mui-card">
            <div class="mui-card-header">{{goodsinfo.title}}</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p class="price">
                        市场价：
                        <del>￥{{goodsinfo.market_price}}</del>&nbsp;&nbsp;销售价：<span class="now_price">￥{{goodsinfo.sell_price}}</span>
                    </p>
                    <p>购买数量：
                        <!--注意, 这里涉及子组件如何向父组件传值——本质上就是子组件调用父组件的方法-->
                        <numbox @getcount="getselectedcount" :max="goodsinfo.stock_quantity"></numbox>
                    </p>
                    <p>
                        <mt-button type="primary" size="small">立即购买</mt-button>
                        <mt-button type="danger" size="small" @click="add2shopcart">加入购物车</mt-button>
                    </p>
                </div>
            </div>
        </div>


        <!-- 商品参数区域 -->
        <div class="mui-card">
            <div class="mui-card-header">商品参数</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p>商品货号: {{goodsinfo.goods_no}}</p>
                    <p>库存情况: {{goodsinfo.stock_quantity}} 件</p>
                    <p>上架时间: {{goodsinfo.add_time | dateFormat}}</p>
                </div>
            </div>
            <div class="mui-card-footer">
                <mt-button type="primary" plain size="large" @click="goDesc(id)">图文介绍</mt-button>
                <!--br不好看, 太业余-->
                <!--<br/>-->
                <mt-button type="danger" plain size="large" @click="goComment(id)">商品评论</mt-button>
            </div>
        </div>

    </div>


</template>
<script>
    import swiper from '../subcomponents/swiper.vue' // 导入轮播图组件
    import numbox from '../subcomponents/goodsinfonumberbox.vue' // 导入数字框组件

    export default {
        data() {
            return {
                id: this.$route.params.goodsid, // 为了方便, 将商品id放在组件里面
                lunbo: [], // 放置轮播图数据
                goodsinfo: { // 放置商品详情

                },
                ballFlag: false, // 小球是否展示, 默认是隐藏
                selectedCount: 1 // 用户选中的商品数量, 默认是1
            }
        },
        created() {
            this.getLunbo(); // 初始化进来就获取轮播图数据
            this.getgoodsinfo(); // 初始化商品参数
        },
        methods: {
            getLunbo() { // 获取商品详情页面的轮播图数据
                this.$http.get('api/getthumbsbyproductid/' + this.id).then(result => {
                    if (result.body) {
                        this.lunbo = result.body;
                        this.lunbo.forEach(e => {
                            e.img_url = e.src; // 这是因为swiper.vue 组件只认识 img_url 属性, 而不认识 src属性, 所以我们这里为每个轮播图数据添加一个 img_url 属性
                        })
                    }
                });
            },
            getgoodsinfo() { // 获取商品详情
                this.$http.get('api/goods/getinfo/' + this.id).then(result => {
                    if (result.body) {
                        this.goodsinfo = result.body;
                    }
                });
            },
            goDesc(id) { // 跳转图文介绍页面，通过编程式导航
                this.$router.push({name: "goodsdesc", params: {id}});
            },
            goComment(id) { // 通过编程式导航跳转商品评论页面
                this.$router.push('/home/goodscomment/' + id);
            },
            add2shopcart() { // 点击加入购物车
                this.ballFlag = !this.ballFlag // 切换小球隐藏/显示状态
                var goodsinfo = { // 准备往 vuex 中添加的商品对象
                    id: this.id,
                    count: this.selectedCount,
                    price: this.goodsinfo.sell_price,
                    selected: true  // 肯定是想买的, 所以默认是选中的
                };
                this.$store.commit('add2Car', goodsinfo); // 调用store中的mutations中的方法来将商品加入购物车(其实就是加入公共数据存储区)
            },
            beforeEnter(el) { // 第一个参数el是dom 原生对象
                el.style.transform = "translate(0,0)"; // 动画起始位置
            },
            enter(el, done) {
                el.offsetWidth; // 为了防止动画不生效
                // 获取小球在页面中的位置, 注意，这里的this 是main.js中vue组件 vm
                const ballposition = this.$refs.ball.getBoundingClientRect();
                // 获取购物车徽标在页面中的位置 注意，这里使用了页面dom操作，vue是不提倡使用dom操作的, 但是这里不涉及业务(没有数据的双向绑定), 只是想简单的获取页面元素在页面上的位置, 注意, 页面上使用dom操作和父子组件没有任何关系, 本组件是子组件，可以获取到在父组件——app.vue中的dom元素
                const badgeposition = document.getElementById('badge').getBoundingClientRect();
                // 得到小球和徽标水平和垂直方向上的距离差距
                const xdiff = badgeposition.left - ballposition.left;
                const ydiff = badgeposition.top - ballposition.top;
                // 下面使用es6中的模板字符串, 省得拼接字符串的麻烦, 至此，已经完美的解决了在不同分辨率（譬如代码执行环境从iphone6变成了iphoneX）以及滚动条不同位置下小球依旧能准确的到碗里来的效果
                el.style.transform = `translate(${xdiff}px, ${ydiff}px)`; // 继续移动( 注意  translate的入参的2个值是不能写死的, 否则的话，不要说是换成别的手机分辨率，就是拖动页面，则这个值如果写死的话, 小球也到不了购物车里去)
                el.style.transition = "all .5s cubic-bezier(0.4,-0.3,1,0.68)";
                done();
            },
            afterEnter() {
                this.ballFlag = !this.ballFlag;
            },
            getselectedcount(count) { // 获取用户选择的商品数量
                this.selectedCount = count;
                console.log('父组件拿到的值是: ' + this.selectedCount)
            }
        },
        components: {
            'swiper_component': swiper, // 注册轮播图组件
            numbox // 注册 数字框组件
        }
    }
</script>
<style lang="scss" scoped>
    .goodsinfo-container {
        background-color: #eee;
        overflow: hidden; /*这是为了防止嵌套垂直外边距导致父盒子下拉的问题的*/

        .now_price {
            color: red;
            font-size: 16px;
            font-weight: bold;
        }

        .mui-card-footer {
            display: block; /*因为默认mui组件采用了flex布局, 一旦使用flex布局, 则里面的br 等换行都不起作用了*/
            button {
                margin: 15px 0; /*让上下2个按钮之间有间隔*/
            }
        }

        .ball {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: red;
            position: absolute;
            z-index: 99;
            top: 390px;
            left: 152px;
        }
    }


</style>