<template>
    <div>
        <!--顶部滚动条区域 从MUI 的 tab-top-webview-main.html 拷贝过来的, 注意，要删掉 mui-fullscreen 这个类名 不然全屏-->
        <!--但是还是有问题, 因为这是可滑动的组件（即一款js组件），但是我们仅仅导入了css是不行的, 所以还需要导入mui.js 以及使用官方示例的代码去初始化-->
        <div id="slider" class="mui-slider">
            <!--注意，mui的例子中的tab-top-webview-main.html 中这里还加了n多属性，需要将其去掉才行 不然无法滑动-->
            <div id="sliderSegmentedControl"
                 class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                <div class="mui-scroll">
                    <!--假数据-->
                    <!--<a class="mui-control-item" href="#item1mobile" data-wid="tab-top-subpage-1.html">
                        推荐
                    </a>
                    <a class="mui-control-item mui-active" href="#item2mobile" data-wid="tab-top-subpage-2.html">
                        热点
                    </a>
                    <a class="mui-control-item" href="#item3mobile" data-wid="tab-top-subpage-3.html">
                        北京
                    </a>
                    <a class="mui-control-item" href="#item4mobile" data-wid="tab-top-subpage-4.html">
                        社会
                    </a>
                    <a class="mui-control-item" href="#item5mobile" data-wid="tab-top-subpage-5.html">
                        娱乐
                    </a>
                    <a class="mui-control-item" href="#item6mobile" data-wid="tab-top-subpage-6.html">
                        科技
                    </a>-->
                    <!--注意, 这里根据category.id是不是0(是0表示是'全部'分类)来决定到底要不要加上 mui-active 这个class，不能都加上, 不然一进来全部是蓝色, 如果像下面这样的话，则只有全部是蓝色，其他的选项卡都不是, 但是你点击其他选项卡，都可以成功变成蓝色，这是scroll这个组件给我们做的, 不需要我们自己动手的-->
                    <!--注意，这里在安卓手机上可能点击没效果，则要将 @click 换成 @tap  注意，只有 mui 封装的组件才能使用 @tap, 一般的div只能使用 @click-->
                    <a :class="['mui-control-item', category.id === 0? 'mui-active':'']" v-for="category in categories"
                       :key="category.id" @click="getPhotolistByCategoryId(category.id)">
                        {{category.title}}
                    </a>
                </div>
            </div>

        </div>
        <!--图片列表区域-->
        <ul class="photo-list">
            <!--和 newslist.vue 类似, 这里是一个路由, 并传递photo的id 而且这里使用了tag标签指定 router-link需要渲染成li标签，因为下面的样式都是照着li写的, 而router-link 默认渲染成a标签-->
            <router-link v-for="item in list" :key="item.id" :to="'/home/photoinfo/'+item.id" tag="li">
                <img v-lazy="item.img_url">
                <!--下面是图片的介绍-->
                <div class="info">
                    <h1 class="info-title">
                        {{item.title}}
                    </h1>
                    <div class="info-body">
                        {{item.zhaiyao}}
                    </div>
                </div>
            </router-link>
        </ul>
    </div>
</template>

<script>
    // 下面两行使用了严格模式不允许的写法，而webpack打包后的bundle.js启用了严格模式, 则就会报错 callee、caller、arguments不被在严格模式下 允许
    // 但是mui.js 不是我们自己写的，所以解决方案是把webpack打包成bundle.js 的时候禁用掉严格模式
    // 如何禁用呢? 通过 babel-plugin-transform-remove-strict-mode 插件 cnpm i -D  本地安装他之后，在 .babelrc 文件中配置即可
    import mui from '../../lib/mui/js/mui.min.js';

    import {Toast} from 'mint-ui';

    export default {
        data() {
            return {
                categories: [],  // 图片分类列表
                list: [] // 图片数据列表
            }
        },
        created() { // 对于操作数据的东西，就在created方法中使用 对于操作页面dom的，放在 mounted中
            this.getAllCategory();
            this.getPhotolistByCategoryId(0); // 刚进这个页面的时候，传0（表示全部分类）
        },
        mounted() { // 当组件中的dom结构被渲染好并放到页面中的时候，会执行下面的钩子函数(如果不放在这里的话, 会出现进入页面之后无法滑动的尴尬的),  即组件被放到页面上之后，我们才能初始化这个滚动条.细想一下也是正确的，如果这个组件都没有挂载到页面上，初始化滚动条还有意义吗?
            // 所以如果要操作元素，最好在mounted中，因为这里的dom元素是最新的
            // 初始化滑动控件
            mui(".mui-scroll-wrapper").scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });

        },
        methods: {
            getAllCategory() { // 获取所有图片分类
                this.$http.get('api/getimagecategory').then(result => {
                    console.log(result)
                    // 如果成功了
                    if (result.body) {
                        // 因为返回的数据不包含"全部"这个分类
                        result.body.unshift({title: "全部", id: 0});
                        this.categories = result.body;
                    } else {
                        Toast('加载图片分类列表失败.')
                    }
                }, err => {
                    Toast('加载图片分类列表失败了.')
                });
            },
            getPhotolistByCategoryId(categoryId) {  // 根据分类id获取图片数据列表
                this.$http.get('api/getimages/' + categoryId).then(result => {
                    if (result.body) {
                        this.list = result.body;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    * {
        /*css3中touch-action 用于指定某个给定区域是否允许用户操作，以及如何响应用户操作（比如浏览器自带的滑动，缩放等等）*/
        /*pan-y的意思是启用单指垂直平移手势，即chrome浏览器中垂直滑动的时候能提高流畅度 也就chrome支持*/
        touch-action: pan-y /*去掉滑动时的警告，该警告只在chrome中有，是chrome搞出来的提高用户体验的东西*/
    }

    .photo-list {
        list-style: none;
        margin: 0;
        padding: 10px;
        padding-bottom: 0px;

        li {
            background-color: #ccc;

            margin-bottom: 10px;

            /*让懒加载的图片居中显示*/
            text-align: center;
            /*图片阴影*/
            box-shadow: 0 0 9px #999999;

            /*图片中的样式*/
            img {
                width: 100%;
                vertical-align: middle;
            }

            /*下面是懒加载的转圈圈的图片的样式*/
            img[lazy=loading] {
                width: 40px;
                height: 300px;
                margin: auto;
            }

            position: relative;

            .info {
                color: white;

                text-align: left;

                position: absolute;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.4);
                max-height: 84px;

                .info-title {
                    font-size: 14px;
                }

                .info-body {
                    font-size: 13px;
                }
            }
        }
    }
</style>