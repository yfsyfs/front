<template>
    <div>
        <ul class="mui-table-view">
            <!--下面是假数据-->
            <!-- <li class="mui-table-view-cell mui-media">
                 <a href="javascript:;">
                     <img class="mui-media-object mui-pull-left"
                          src="https://avatar.gitee.com/uploads/80/863780_yfsyfs.png!avatar100?1538211833">
                     <div class="mui-media-body">
                         <h1>幸福</h1>
                         <p class='mui-ellipsis'>
                             <span>发表时间: 2012-12-12 12:12:12</span>
                             <span>点击: 0次</span>
                         </p>
                     </div>
                 </a>
             </li>
             <li class="mui-table-view-cell mui-media">
                 <a href="javascript:;">
                     <img class="mui-media-object mui-pull-left"
                          src="https://avatar.gitee.com/uploads/80/863780_yfsyfs.png!avatar100?1538211833">
                     <div class="mui-media-body">
                         <h1>幸福</h1>
                         <p class='mui-ellipsis'>
                             <span>发表时间: 2012-12-12 12:12:12</span>
                             <span>点击: 0次</span>
                         </p>
                     </div>
                 </a>
             </li>
             <li class="mui-table-view-cell mui-media">
                 <a href="javascript:;">
                     <img class="mui-media-object mui-pull-left"
                          src="https://avatar.gitee.com/uploads/80/863780_yfsyfs.png!avatar100?1538211833">
                     <div class="mui-media-body">
                         <h1>幸福</h1>
                         <p class='mui-ellipsis'>
                             <span>发表时间: 2012-12-12 12:12:12</span>
                             <span>点击: 0次</span>
                         </p>
                     </div>
                 </a>
             </li>-->
            <li class="mui-table-view-cell mui-media" v-for="item in newslist" :key="item.id">
                <!--注意, 这里传递了新闻的id过去, 因为/home/newsinfo 是字符串，所以加上单引号, 而这里item.id就是变量了, 这因为要用到变量, 所以这里使用了v-bind 这种单向绑定-->
                <router-link :to="'/home/newsinfo/'+item.id">
                    <img class="mui-media-object mui-pull-left"
                         :src="item.img_url">
                    <div class="mui-media-body">
                        <h1>{{item.title}}</h1>
                        <p class='mui-ellipsis'>
                            <!--这里使用了全局过滤器格式化后台传递来的时间-->
                            <span>发表时间: {{item.add_time | dateFormat}}</span>
                            <span>点击: {{item.click}}次</span>
                        </p>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>

    import {Toast} from 'mint-ui';

    export default {
        data() {
            return {
                newslist: [] // 新闻列表数据
            }
        },
        created() {
            this.getNewsList();
        },
        methods: {
            getNewsList() { // 获取新闻列表
                this.$http.get('api/getnewslist').then(result => {
                    console.log(result)
                    if (result.body && result.body.status === 0) {
                        this.newslist = result.body.message;
                    } else {
                        Toast('获取新闻列表数据失败...');
                    }
                }, err => {
                    Toast('获取新闻列表数据失败了!');
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mui-table-view {
        li {
            h1 {
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .mui-ellipsis {
                font-size: 12px;
                color: #226aff;
                /*以后尽量使用css3的布局*/
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>