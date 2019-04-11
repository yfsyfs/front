<template>
    <div class="newsinfo-container">
        <!--大标题-->
        <h3 class="title">{{newsinfo.title}}</h3>
        <!--子标题-->
        <p class="subtitle">
            <!--这里使用全局过滤器处理一道-->
            <span>发表时间: {{newsinfo.add_time | dateFormat}}</span>
            <span>点击: {{newsinfo.click }}次</span>
        </p>
        <hr>
        <!--内容区域-->
        <!--html类型的内容一般使用v-html标签渲染-->
        <div class="content" v-html="newsinfo.content"></div>
        <!--评论区域  注意，这里和 004webpack-vue2 并不矛盾，因为那里是渲染一个div 而这里只是组件中使用其他组件-->
        <!--这里是父组件向子组件传值-->
        <comment-box :id="id"></comment-box>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui';
    import comment from '../subcomponents/comment.vue';

    export default {
        data() {
            return {
                id: this.$route.params.id, // 将URL地址传递过来的id值挂载到组件上，方便以后调用
                newsinfo: {} // 新闻对象
            }
        },
        created() {
            this.getNewsInfo(); // 一进来就发ajax请求获取数据
        },
        methods: {
            getNewsInfo() { // 获取新闻详情
                this.$http.get('api/getnew/' + this.id).then(result => {
                    console.log(result.body)
                    if (result.body) { // 不知道为什么，result.body 中不再有status属性, 也没有message属性了
                        this.newsinfo = result.body[0];
                    } else {
                        Toast('获取新闻详情失败!');
                    }
                }, err => {
                    Toast('获取新闻详情失败了.')
                })
            }
        },
        components: { // 注册子组件
            'comment-box': comment
        }
    }
</script>

<!--这里将scoped去掉了, 这样图片就不会显示不全 但是不好解释(这是经验之谈) 而且不用担心样式污染，因为这里的所有样式都是放在 .newsinfo-container 中的-->
<style lang="scss">
    .newsinfo-container {
        padding: 0 4px;

        .title {
            font-size: 16px;
            text-align: center;
            margin: 15px 0;
            color: red;
        }

        .subtitle {
            font-size: 13px;
            color: #226aff;
            display: flex;
            justify-content: space-between;
        }

        .content {
            img {
                width: 100%; /*防止图片因为过大而显示不全*/
            }

            font-size: 12px;
        }
    }
</style>