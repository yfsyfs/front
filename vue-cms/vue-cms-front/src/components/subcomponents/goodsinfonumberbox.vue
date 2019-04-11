<template>
    <!--下面的代码copy自 mui 的 examples 中的 numbox.html-->
    <div class="mui-numbox" data-numbox-min='1'>
        <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
        <!--这里注册了一个 change 事件, 即一旦发生改变, 就触发-->
        <input id="test" class="mui-input-numbox" type="number" value="1" @change="countChanged" ref="numbox"/>
        <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
    </div>
</template>

<script>
    import mui from '../../lib/mui/js/mui.min'; // 导入 mui.js

    export default {
        mounted() {
            mui('.mui-numbox').numbox(); // 初始化数字框
            console.log(this.max); // 最开始是undefined, 因为这里的max是父组件 goodsinfo.vue中的goodsinfo.stock_quantity 传递来的. 而goodsinfo 是goodsinfo.vue 组件发送异步ajax请求获取的, 异步... 而这里渲染子组件多半是同步获取的, 同步优先，异步靠边. 所以这里是undefined
        },
        methods: {
            countChanged() {
                // 调用父组件传递来的函数————getcount 实现 子组件(numbox)传递选中的数量到父组件（goodsinfo.vue）
                this.$emit('getcount', parseInt(this.$refs.numbox.value));
            }
        },
        props: [
            'max' // 数字框组件的最大值(即可以选购的商品的最大数量(应该就是库存量))
        ],
        watch: { // 因为 max 是goodsinfo.vue组件中异步获取的, 一开始必然是undefined, 所以要监听这个max, 因为最后一定是数字(goodsinfo.vue中的ajax请求完成)
            "max": function (newVal, oldVal) { // 监听max 属性变化, 他一定会变化, 因为最开始是undefined(同步优先，异步靠边), 而后来因为父组件 goodsinfo.vue 的 ajax请求 goodsinfo完成，导致goodsinfo.vue组件中的属性绑定代码——:max="goodsinfo.stock_quantity" 触发了子组件(即本组件)的max属性的变化, 从而被这里的watch监听到，触发了这里的代码改变了数字框的最大值
                mui('.mui-numbox').numbox().setOption('max', newVal); // 通过查阅 mui的数字框组件的js API ，我们动态的设置数字框组件的最大值
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>