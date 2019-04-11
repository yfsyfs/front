<template>
    <!--下面的代码copy自 mui 的 examples 中的 numbox.html-->
    <div class="mui-numbox" data-numbox-min='1' style="height: 25px">
        <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
        <!--这里注册了一个 change 事件, 即一旦发生改变, 就触发-->
        <input id="test" class="mui-input-numbox" type="number" :value="initcount" @change="countChanged" ref="numbox"
               readonly/>
        <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
    </div>
</template>

<script>
    import mui from '../../lib/mui/js/mui.min'; // 导入 mui.js

    export default {
        mounted() {
            mui('.mui-numbox').numbox(); // 初始化数字框
        },
        methods: {
            countChanged() { // 购物数量变化, 即用户在购物车页面调整了购物的数量 每当数量改变, 就立即同步到vuex中去
                this.$store.commit('updateCount', {
                    id: this.id,
                    count: parseInt(this.$refs.numbox.value)
                });
            }
        },
        props: [
            'initcount', // 初始化数量(即用户选购的商品数量)
            'id' // 购买的商品id
        ]
    }
</script>

<style lang="scss" scoped>

</style>