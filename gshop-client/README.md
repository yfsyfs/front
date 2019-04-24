# gshop

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



这里有必要讲一下 ShopHeader.vue 中的样式中的 &

定位到

&.fade-enter-active, &.fade-leave-active

&的意思指向父选择器
查看一下
完整的
.shop-brief-modal
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      display flex
      justify-content center
      align-items center
      z-index 52
      flex-direction column
      color #333

      &.fade-enter-active, &.fade-leave-active
        transition opacity .5s

      &.fade-enter, &.fade-leave-to
        opacity 0
        
        
这就意味着   .fade-enter-active,.fade-leave-active 这两个样式和 .shop-brief-modal 是平级的
