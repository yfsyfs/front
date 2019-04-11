<template>
    <div class="goods-list">
        <!--假数据-->
        <!-- <div class="goods-item">
             <img src="https://img.gsdlcn.com/uploads/allimg/170512/12-1F512144632.jpg">
             <h1 class="title">巨乳大波霸女优大奶摇摇欲坠疯狂销魂</h1>
             <div class="info">
                 <p class="price">
                     <span class="now">￥899</span>
                     <span class="old">￥999</span>
                 </p>
                 <p class="sell">
                     <span>热卖中</span>
                     <span>仅剩60件</span>
                 </p>
             </div>
         </div>

         <div class="goods-item">
             <img src="https://img.gsdlcn.com/uploads/allimg/171228/12-1G22Q54J3-50.jpg">
             <h1 class="title">尤果网艾语桃c弧蜜桃美胸各色服装凸显好身材&极品大胸器少妇大白兔emma硕臀翘起人体艺术写真&极品大胸器少妇大白兔emma硕臀翘起人体艺术写真</h1>
             <div class="info">
                 <p class="price">
                     <span class="now">￥899</span>
                     <span class="old">￥999</span>
                 </p>
                 <p class="sell">
                     <span>热卖中</span>
                     <span>仅剩60件</span>
                 </p>
             </div>
         </div>

         <div class="goods-item">
             <img src="https://img.gsdlcn.com/uploads/allimg/190324/1-1Z324031R3-51.jpg">
             <h1 class="title">人体艺术女神唐婉儿情趣黑丝美腿白嫩翘臀丁字裤诱人犯罪</h1>
             <div class="info">
                 <p class="price">
                     <span class="now">￥899</span>
                     <span class="old">￥999</span>
                 </p>
                 <p class="sell">
                     <span>热卖中</span>
                     <span>仅剩60件</span>
                 </p>
             </div>
         </div>-->

        <!--下面这种方式属于标签跳转, 注意，和传统HTML完全类似, 传统html中有a标签跳转和js编程跳转（window.location.href进行跳转）,vue-router也提供了两种方式进行路由跳转，router-link 因为默认渲染成 a 标签, 所以router-link 就是第一种方式——标签跳转, 另一种跳转方式见下面-->
        <!--<router-link class="goods-item" v-for="item in goodslist" :key="item.id" :to="'/home/goodsinfo/'+item.id" tag="div">
            &lt;!&ndash;Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div id="{{ val }}">, use <div :id="val">.&ndash;&gt;
            &lt;!&ndash;所以属性绑定不能使用插值表达式&ndash;&gt;
            <img :src="item.img_url">
            <h1 class="title">{{item.title}}</h1>
            <div class="info">
                <p class="price">
                    <span class="now">￥{{item.sell_price}}</span>
                    <span class="old">￥{{item.market_price}}</span>
                </p>
                <p class="sell">
                    <span>热卖中</span>
                    <span>仅剩{{item.stock_quantity}}件</span>
                </p>
            </div>
        </router-link>-->

        <!--这是vue-router提供的第二种路由跳转方式——编程跳转, 类比于传统html中的js的window,location.href 跳转, 即通过触发事件完成跳转-->
        <div class="goods-item" v-for="item in goodslist" :key="item.id" @click="goDetail(item.id)">
            <!--Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div id="{{ val }}">, use <div :id="val">.-->
            <!--所以属性绑定v-bind (或者简写的 :)不能使用插值表达式-->
            <img :src="item.img_url">
            <h1 class="title">{{item.title}}</h1>
            <div class="info">
                <p class="price">
                    <span class="now">￥{{item.sell_price}}</span>
                    <span class="old">￥{{item.market_price}}</span>
                </p>
                <p class="sell">
                    <span>热卖中</span>
                    <span>仅剩{{item.stock_quantity}}件</span>
                </p>
            </div>
        </div>

        <mt-button type="danger" size="large" @click="getMore">加载更多</mt-button>

    </div>
</template>


<script>
    export default {
        data() {
            return {
                pageIndex: 1, // 分页参数(即第几页)
                goodslist: [] // 商品列表
            }
        },
        created() {
            this.getGoodslist(); // 初始化组件就调用
        },
        methods: {
            getGoodslist() {
                this.$http.get('api/getgoods?pageIndex=' + this.pageIndex).then(result => {
                    if (result.body) {
                        this.goodslist = this.goodslist.concat(result.body);
                    }
                });
            },
            getMore() { // 点击加载更多
                this.pageIndex++;
                this.getGoodslist();
            },
            goDetail(id) { // 单击完成路由跳转
                console.log(this); // 打印vue对象，发现其中的 $router 对象，注意，要和我们之前获取路由穿参的$route 区分开来, 对于 this.$route.query,和 this.$route.params 路由中所有的参数都属于他们, 而this.$router 是一个路由导航对象，我们可以使用它方便的使用js代码实现路由的前进(go(1)、forward)、后退(go(-1), back)、以及跳转（push）到新的URL地址,这是因为this.$router.__proto__ 中有 go、forward、back三个方法
                // 这是最简单的第一种
                // this.$router.push('/home/goodsinfo/'+id);
                // 将第一种的写法对象化 就是第二种写法
                // this.$router.push({path: '/home/goodsinfo/' + id});
                // 第三种写法是命名路由，也就是给路由起名字, 我们这里给 /home/goodsinfo/:goodsid 起名字为 goodsinfo(见 router.js) 而这里的 params就是RESTful 风格的路径上的参数, 注意，这里使用了简写, 即本应该是 params: {id: id},因为键值一致，所以简写id就可以了, 但是发现, router.js中的路由的路径参数是 goodsid, 所以不能简写
                // 注意, 如果提供了 path 参数的话, 则params 参数是会被完全忽略的!(这不难想象)
                this.$router.push({name: 'goodsinfo', params: {goodsid: id}});
                // 第四种写法不适用于这里, 因为下面的路由相当于是跳转 /home/goodsinfo?id=id  即你记住, 在vue中 query相当于问号穿参，而params相当于是路径传参. 而且不难想象哈，给了path，query也是不会被忽略的(和第三种不一样)，这里因为不涉及问号传参，所以第四种不适用于这里
                // this.$router.push({path: '/home/goodsinfo/'+id, query:{id}});
            }
        }
    }
</script>

<style lang="scss" scoped>
    .goods-list {
        display: flex;
        flex-wrap: wrap;
        padding: 7px;
        justify-content: space-between;

        .goods-item {
            width: 49%; /*这样促使一行只能放两个*/
            border: 1px solid #cccccc;
            box-shadow: 0 0 8px #cccccc;
            margin: 4px 0;
            padding: 2px;
            display: flex;
            flex-direction: column; /* 垂直布局*/
            justify-content: space-between;
            min-height: 293px; /* 防止如果网速慢的话, 则图片没加载进来的话, 则盒子就自动小了（因为没撑开的缘故），一旦设置了，则就算图片没加载进来, 则也会保持这么高的架子*/

            img {
                width: 100%;
            }

            .title {
                font-size: 14px;
            }

            .info {
                background-color: #eeeeee;

                p {
                    margin: 0;
                    padding: 5px;
                }

                .price {
                    .now {
                        color: red;
                        font-weight: bold;
                        font-size: 16px;
                    }

                    .old {
                        text-decoration: line-through;
                        font-size: 12px;
                        margin-left: 10px;
                    }
                }

                .sell {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                }
            }

        }
    }
</style>