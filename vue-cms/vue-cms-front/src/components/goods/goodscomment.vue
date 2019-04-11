<template>
    <div>
        <!--注意, 放在 属性中可以不写 this, 但是在methods中要用的话, 是需要加this的-->
        <comment :id="$route.params.id" :type="'goods'"></comment>
    </div>
</template>

<script>
    import comment from '../subcomponents/comment.vue'; // 导入评论组件
    export default {
        components: {
            comment
        }
    }

</script>

<style lang="scss" scoped>

</style>