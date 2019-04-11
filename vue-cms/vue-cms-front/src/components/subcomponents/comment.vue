<template>
    <div class="cmt-container">
        <h3>发表评论</h3>
        <hr>
        <textarea placeholder="请输入要BB的内容(最多吐槽120字)" maxlength="120" v-model="msg">

        </textarea>
        <mt-button type="primary" size="large" @click="postComment">发表评论</mt-button>
        <div class="cmt-list">
            <!--下面是假数据-->
            <!--<div class="cmt-item">
                <div class="cmt-title">
                    第1楼&nbsp;&nbsp;用户: 匿名用户&nbsp;&nbsp; 发表时间: 2012-12-12 12:12:12
                </div>
                <div class="cmt-body">
                    锄禾日当午，汗滴禾下土
                </div>
            </div>
            <div class="cmt-item">
                <div class="cmt-title">
                    第1楼&nbsp;&nbsp;用户: 匿名用户&nbsp;&nbsp; 发表时间: 2012-12-12 12:12:12
                </div>
                <div class="cmt-body">
                    锄禾日当午，汗滴禾下土
                </div>
            </div>
            <div class="cmt-item">
                <div class="cmt-title">
                    第1楼&nbsp;&nbsp;用户: 匿名用户&nbsp;&nbsp; 发表时间: 2012-12-12 12:12:12
                </div>
                <div class="cmt-body">
                    锄禾日当午，汗滴禾下土
                </div>
            </div>-->
            <div class="cmt-item" v-for="(item,i) in comments" :key="item.add_time">
                <div class="cmt-title">
                    第{{i+1}}楼&nbsp;&nbsp;用户: {{item.username}}&nbsp;&nbsp; 发表时间: {{item.add_time | dateFormat}}
                </div>
                <div class="cmt-body">
                    <!--插值表达式中写表达式-->
                    {{item.content === undefined? '此用户很懒，什么都没说':item.content}}
                </div>
            </div>
        </div>
        <!--plain就是中空的按钮-->
        <mt-button type="danger" size="large" plain @click="getMore">加载更多</mt-button>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui';

    export default {
        data() {
            return {
                pageIndex: 1, //默认展示第一页数据
                comments: [], // 所有的评论数据
                msg: ''  // 评论输入的数据
            }
        },
        created() {
            this.getComments();
        },
        methods: {
            getComments() {
                console.log(this.type)
                if (this.type === 'photo') { // 如果是对图片的评论, 注意，要加this，因为是对props中的访问，而props和data类似，但是如果在template中写属性的话, 不需要加
                    this.$http.get('api/getcommentsofphoto/' + this.id + '?pageIndex=' + this.pageIndex).then(result => {
                        if (result.body) {
                            this.comments = this.comments.concat(result.body);
                        }
                    });
                    return;
                }
                if (this.type === 'goods') { // 如果是对商品的评论, 注意，要加this，因为是对props中的访问，而props和data类似
                    this.$http.get('api/getcommentsofgoods/' + this.id + '?pageIndex=' + this.pageIndex).then(result => {
                        if (result.body) {
                            this.comments = this.comments.concat(result.body);
                        }
                    });
                    return;
                }
                // 下面只是获取新闻的评论
                // 注意，要获取 props 中的id 也要使用 this才能访问的到，和子组件的data是一样的（子组件的props和子组件的data地位类似）
                this.$http.get('api/getcomments/' + this.id + '?pageIndex=' + this.pageIndex).then(result => {
                    if (result.body) {
                        this.comments = this.comments.concat(result.body); // 获取新数据的时候不要把老数据清空覆盖,而是要拼接
                    } else {
                        Toast('获取评论列表失败.');
                    }
                }, err => {
                    Toast('获取评论列表数据失败了...')
                });
            },
            getMore() { // 加载更多
                this.pageIndex++; // 取得下一页评论数据
                this.getComments();
            },
            postComment() { // 发表评论
                if (this.msg.trim().length === 0) {
                    return Toast('评论内容不能为空');
                }
                if (this.type === 'photo') { // 如果是对图片进行评论, 注意，这里得到id的方式和下面的提交新闻评论的方式不一致, 下面使用的是另一种思路，但是两种都可以
                    this.$http.post('api/postcommentofphoto/' + this.id, {content: this.msg.trim()}).then(result => {
                        if (result.body.code === 0) {
                            // 此次评论的内容
                            var cmt = {
                                username: '匿名用户',
                                add_time: Date.now(),
                                content: this.msg.trim()
                            };
                            this.comments.unshift(cmt); // 将此次提交的评论插在最前面（注意，这是纯前端的行为，当然,后端也会插入）
                            this.msg = ''; // 清空评论
                        } else {
                            Toast('提交评论失败, 服务器正忙, 请稍后再试哈~')
                        }
                    });
                    return;
                }
                if (this.type === 'goods') { // 如果是对商品进行评论, 注意，这里得到id的方式和下面的提交新闻评论的方式不一致, 下面使用的是另一种思路，但是两种都可以
                    this.$http.post('api/postcommentofgoods/' + this.id, {content: this.msg.trim()}).then(result => {
                        if (result.body.code === 0) {
                            // 此次评论的内容
                            var cmt = {
                                username: '匿名用户',
                                add_time: Date.now(),
                                content: this.msg.trim()
                            };
                            this.comments.unshift(cmt); // 将此次提交的评论插在最前面（注意，这是纯前端的行为，当然,后端也会插入）
                            this.msg = ''; // 清空评论
                        } else {
                            Toast('提交评论失败, 服务器正忙, 请稍后再试哈~')
                        }
                    });
                    return;
                }
                // 注意，这里展示了得到新闻id的另一种方式, 注意，因为comment.vue组件是挂在newsinfo.vue组件下面的, 所以 这里的 this.$route.params.id 就是进到newsinfo.vue 组件 中的路由. 不要疑惑哈. 你只需要使用vuetools插件观察一下就知道了
                this.$http.post('api/postcomment/' + this.$route.params.id, {content: this.msg.trim()}).then(result => {
                    if (result.body.code === 0) {
                        // 此次评论的内容
                        var cmt = {
                            username: '匿名用户',
                            add_time: Date.now(),
                            content: this.msg.trim()
                        };
                        this.comments.unshift(cmt); // 将此次提交的评论插在最前面（注意，这是纯前端的行为，当然,后端也会插入）
                        this.msg = ''; // 清空评论
                    } else {
                        Toast('提交评论失败, 服务器正忙, 请稍后再试哈~')
                    }
                }, err => {
                    Toast('提交评论失败, 服务器正忙, 请稍后再试^_^')
                });
            }
        },
        props: [
            'id',
            'type'
        ]
    }
</script>

<style lang="scss" scoped>
    .cmt-container {
        h3 {
            font-size: 18px;
        }

        textarea {
            font-size: 14px;
            height: 85px;
            margin: 0;
        }

        .cmt-list {
            margin: 5px 0;

            .cmt-item {
                font-size: 13px;

                .cmt-title {
                    background-color: #cccccc;
                    line-height: 30px;
                }

                .cmt-body {
                    line-height: 35px;
                    text-indent: 2em;
                }
            }
        }
    }
</style>