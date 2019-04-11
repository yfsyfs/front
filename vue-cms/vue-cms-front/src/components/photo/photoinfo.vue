<template>
    <div class="photoinfo-container">
        <h3>{{photoinfo.title}}</h3>
        <p class="subtitle">
            <span>发表时间: {{photoinfo.add_time | dateFormat}}</span>
            <span>点击次数: {{photoinfo.click}}次</span>
        </p>

        <hr>

        <!-- 缩略图区域 -->
        <div class="thumbs">
            <!--注意，preview-img 这个class不能省略   $preview.open 用于打开缩略图-->
            <!--<img class="preview-img" v-for="(item, index) in list" :src="item.src" height="100"
                 @click="$preview.open(index, list)" :key="item.src">-->
            <vue-preview
                    :list="list"
                    :thumbImageStyle="{width: '80px', height: '80px', margin: '10px'}"
                    :previewBoxStyle="{border: '1px solid #eee'}"
                    :tapToClose="true"
                    @close="closeHandler"
                    @destroy="destroyHandler"
            />
        </div>

        <!--图片介绍文字内容区域-->
        <div class="content" v-html="photoinfo.content"></div>

        <!--评论子组件  注意, 这里评论子组件我们传递了2个值 而且第二个是字面量-->
        <cmt-box :id="id" :type="'photo'"></cmt-box>
    </div>
</template>

<script>

    // 导入评论子组件
    import comment from '../subcomponents/comment.vue'

    export default {
        data() {
            return {
                id: this.$route.params.id,  // 从组件路由中获取到图片id
                photoinfo: { // 图片详情
                },
                list: [] // 缩略图的数组
            }
        },
        created() {
            this.getPhotoInfo(); // 一初始化组件就调用
            this.getThumb();
        },
        methods: {
            getPhotoInfo() { // 获取图片详情
                this.$http.get('api/getimageinfo/' + this.id).then(result => { // 这里省略掉异常处理
                    if (result.body) {
                        this.photoinfo = result.body;
                    }
                });
            },
            getThumb() { // 获取缩略图
                // 获取缩略图
                this.$http.get("api/getthumimages/" + this.id).then(result => {
                    if (result.body) {
                        // 循环每个图片数据，补全图片的宽和高, 注意, w和h这两个属性是必须的
                        result.body.forEach(item => {
                            item.w = 600;
                            item.h = 400;
                        });
                        // 把完整的数据保存到 list 中，以便让上面的v-for进行遍历
                        this.list = result.body;
                    }
                });
            },
            // 即将关闭的时候，调用这个处理函数
            closeHandler() {
                console.log('closeHandler')
            },
            // 完全关闭之后，调用这个函数清理资源
            destroyHandler() {
                console.log('destroyHandler')
            }
        },
        components: { // 注册评论子组件
            'cmt-box': comment
        }
    }
</script>

<!--这里将scoped去掉了, 这样图片就不会显示不全 但是不好解释(这是经验之谈) 而且不用担心样式污染，因为这里的所有样式都是放在 .photoinfo-container 中的-->
<style lang="scss">
    .photoinfo-container {
        padding: 3px;

        h3 {
            color: #26a2ff;
            font-size: 15px;
            text-align: center;
            margin: 15px 0;
        }

        /*让发表时间和点击次数两边对齐的css3的flex布局*/
        .subtitle {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
        }

        .content {
            font-size: 13px;
            line-height: 30px;

            img {
                width: 100%; /*防止图片因为过大而显示不全*/
            }
        }

        .thumbs{
            img{
                margin: 10px;
                box-shadow: 0 0 8px #999;
            }
        }
    }
</style>