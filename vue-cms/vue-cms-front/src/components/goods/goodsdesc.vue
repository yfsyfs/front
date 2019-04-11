<template>
    <div class="goodsdesc-container">
        <h3>
            {{info.title}}
        </h3>
        <hr/>
        <div class="content" v-html="info.content"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: { // 图文数据

                }
            }
        },
        created() {
          this.getgoodsdesc();
        },
        methods: {
            getgoodsdesc() { // 获取图文数据
                this.$http.get('api/goods/getdesc/' + this.$route.params.id).then(result => {
                    if (result.body) {
                        this.info = result.body;
                    }
                })
            }
        }
    }

</script>

<!--去掉scoped， 不然图片自适应 100% 无法实现-->
<style lang="scss">
    .goodsdesc-container {
        padding: 4px;
        h3 {
            font-size: 16px;
            color: #226aff;
            text-align: center;
            margin: 15px 0;
        }
        .content {
            img {
                width: 100%;
            }
        }
    }
</style>