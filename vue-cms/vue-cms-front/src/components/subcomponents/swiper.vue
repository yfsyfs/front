<template>
    <div>
        <!--轮播图区域-->
        <mt-swipe :auto="1000">
            <!--轮播图的假数据-->
            <!-- <mt-swipe-item>1</mt-swipe-item>
             <mt-swipe-item>2</mt-swipe-item>
             <mt-swipe-item>3</mt-swipe-item>-->
            <!--组件中使用v-for循环的话，一定要用key-->
            <mt-swipe-item v-for="item in lunbotulist" :key="item.url">
                <!--注意，这里使用:src, 因为是属性绑定, 这里并没有使用插值表达式{{}}  因为这个值不是固定的-->
                <img :src="item.img_url" alt="图片走丢了..." :class="{'full':isfull}"/>
            </mt-swipe-item>
        </mt-swipe>
    </div>
</template>

<script>
    export default {
        props: [
            'lunbotulist',  // 表明如果想要使用本轮播图组件的话,必须要向本组件传递 名为 lunbotulist的数据参数
            'isfull'  //表示要不要宽度 100%
        ]
    }
</script>

<style lang="scss" scoped>
    .mint-swipe {
        height: 200px;
        /*less中的写法*/
        .mint-swipe-item {
            text-align: center; /*让图片居中显示*/
            /*这种写法类似于 css3中的 nth-child 选择器写法*/
            /*&:nth-child(1) {
                background-color: red;
            }

            &:nth-child(2) {
                background-color: cyan;
            }

            &:nth-child(3) {
                background-color: darkcyan;
            }*/

            /*原始图片太大了*/
            img {
                height: 100%;
            }
        }
    }

    .full {  /*图片的宽度要不要 100%*/
        width: 100%;
    }
</style>