<template>
    <div class="shopcar-container">
        <div class="goods-list">
            <!--商品列表项区域-->
            <div class="mui-card" v-for="(product,i) in shopcarproductlist" :key="product.id">
                <div class="mui-card-content">
                    <div class="mui-card-content-inner">
                        <!--假数据-->
                        <!--<mt-switch></mt-switch>
                        <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2357186413,3188968046&fm=26&gp=0.jpg"/>
                        <div class="info">
                            <h1>绝色爆乳,老司机首选, 油缸大，喜欢的可以入手，爽到爆</h1>
                            <p>
                                <span class="price">￥2199</span>
                                <numbox></numbox>
                                <a href="#">删除</a>
                            </p>
                        </div>-->
                        <!--注意, v-model哪怕是双向绑定, 也不会对 store中的数据进行改变(因为这里用的是getters对数据进行访问) 这里对改变事件进行了监听-->
                        <mt-switch v-model="$store.getters.getSelected[product.id]"
                                   @change="selectedChange(product.id, $store.getters.getSelected[product.id])"></mt-switch>
                        <img :src="product.img_url"/>
                        <div class="info">
                            <h1>{{product.title}}</h1>
                            <p>
                                <span class="price">￥{{product.sell_price}}</span>
                                <numbox :id="product.id" :initcount="$store.getters.getGoodsCount[product.id]"></numbox>
                                <!--阻止a标签的默认行为-->
                                <a href="#" @click.prevent="remove(product.id, i)">删除</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--结算区域-->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner jiesuan">
                    <div class="left">
                        <p>总计如下:</p>
                        <p>已勾选商品 <span class="red">{{$store.getters.countall.count}}</span> 件, 总价 ￥<span class="red">{{$store.getters.countall.price}}</span></p>
                    </div>
                    <mt-button type="danger">去结算</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import numbox from '../subcomponents/shopcarnumbox.vue'; // 导入购物车的数字框组件
    export default {
        data() {
            return {
                shopcarproductlist: [] // 购物车中商品列表
            }
        },
        created() {
            this.getGoodslist(); // 一进入购物车页面就初始化购物列表数据
        },
        methods: {
            getGoodslist() { // 获取购物车列表
                var ids = this.$store.state.cart; // 从vuex中获取所有购物的商品
                var idArr = [];
                ids.forEach(e => {
                    idArr.push(e.id); // 获取购买的所有的商品id
                });
                if (idArr.length === 0) {
                    return; // 如果压根没选商品, 就不要发请求了
                }
                this.$http.get('api/goods/getshopcarlist/' + idArr.join(',')).then(result => {
                    if (result.body) {
                        this.shopcarproductlist = result.body;
                    }
                })
            },
            remove(productid, index) { // 删除商品, 入参是商品productid和他在本组件在 shopcarproductlist 中的索引 前者用于删除store中的数据，后者用于删除本组件的 shopcarproductlist 中的数据
                // 要删除2个地方
                this.shopcarproductlist.splice(index, 1); // 从 本组件的 shopcarproductlist 中移除
                this.$store.commit('removefromcart', productid); // 从vuex中移除商品
            },
            selectedChange(id, flag) { // 改变选中的状态, 传入的参数是商品id
                console.log(id + '-------' + flag)
                this.$store.commit('selectedChange', {id, flag});
            }
        },
        components: {
            numbox // 注册数字框组件为子组件
        }
    }
</script>

<style scoped lang="scss">
    .shopcar-container {
        background-color: #eeeeee;
        overflow: hidden; /*防止嵌套垂直外边距合并 导致父盒子下来*/

        .goods-list {
            img {
                height: 60px;
            }

            h1 {
                font-size: 13px;
            }

            .info {
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .price {
                    color: red;
                    font-weight: 700;
                }
            }

            .mui-card-content-inner {
                display: flex;
                align-items: center;
            }
        }

        .jiesuan {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .red {
                color: red;
                font-weight: 700;
                font-size: 16px;
            }
        }
    }
</style>