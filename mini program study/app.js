App({ // App函数用于注册小程序
  data: { // 这和 组件的 js 文件中 的data 是一样的，就是全局数据, 类似于vue, vue的 Vue和各个组件都能有data 这里的数据有点像 vue的store
    isPlay: false, // 是否正在播放
    pageIndex: null, // 第几个页面正在播放
    moviesArr: [] // 获取到的电影数组
  }
})