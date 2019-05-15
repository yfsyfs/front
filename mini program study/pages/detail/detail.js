// pages/detail/detail.js
let datas = require('../../datas/list-data.js')

let appDatas = getApp() // 得到当前小程序实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前页面详情对象
    detailObj: {},
    // 当前页面的索引
    index: null,
    // 是否收藏
    isCollected: false,
    // 音乐是否播放
    isMusicPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 取得点击的下标  options 就是用于接收URL传参用的
    let index = options.idx
    this.setData({
      detailObj: datas.list_data[index]
    })
    this.setData({
      index
    })
    // 根据本地缓判断用户是否收藏当前的文章  getStorageSync是同步接口, 同步的一大特点是没有回调
    let detailStorage = wx.getStorageSync('isCollected')
    if (!detailStorage) {
      // 本地缓存中c初始化空对象
      wx.setStorageSync('isCollected', {})
    }
    if (detailStorage && detailStorage[index]) { // 如果用户收藏过
      this.setData({
        isCollected: true
      })
    }

    // 判断当前页面的音乐是否在播放
    if (appDatas.data.isPlay && appDatas.data.pageIndex === index) {
      this.setData({
        isMusicPlay: true
      })
    }

    // 监听音乐播放
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isMusicPlay: true
      })
      // 更新 appDatas中的数据
      appDatas.data.isPlay = true
      appDatas.data.pageIndex = index
    })
    // 监听音乐暂停
    wx.onBackgroundAudioPause(() => {
      this.setData({
        isMusicPlay: false
      })
      // 更新 appDatas中的数据
      appDatas.data.isPlay = false
      appDatas.data.pageIndex = index
    })
  },

  // 处理用户单击收藏按钮
  handlecollection() {
    // 和 vue不同, 小程序没有数据劫持（vue实现数据绑定的一种手段），所以只能这么干
    let isCollected = !this.data.isCollected
    this.setData({
      isCollected
    })
    // 下面的写法是错误的
    // this.data.isCollected = !this.data.isCollected
    // 提示用户
    wx.showToast({
      title: isCollected ? '收藏成功' : '取消收藏',
      icon: 'success'
    })

    // es6 对象的解构赋值
    let {
      index
    } = this.data

    // 异步获取本地缓存 isCollected
    wx.getStorage({
      key: 'isCollected',
      success: (res) => {
        let obj = res.data
        obj[index] = isCollected

        // 异步缓存数据到本地
        wx.setStorage({
          key: 'isCollected',
          data: obj,
          success() {
            console.log('缓存成功!')
          }
        })
      }
    })

  },

  // 处理音乐播放按钮点击
  handleMusicPlay() {
    let isMusicPlay = !this.data.isMusicPlay
    this.setData({
      isMusicPlay
    })

    if (isMusicPlay) {
      let {
        dataUrl,
        title
      } = this.data.detailObj.music
      // 播放音乐
      wx.playBackgroundAudio({
        // 音乐文件的链接, 和图片同样, 因为小程序大小的限制, 所以一般音乐文件都不会放在小程序中, 而是放在额外的服务器上 
        dataUrl,
        // 音乐的标题
        title
      })
    } else {
      // 暂停播放
      wx.pauseBackgroundAudio()
    }
  },

  // 用户点击分享按钮, 注意, 对于个人小程序开发者账号, 实际上是不能分享的, 但是没关系, 进入到企业中, 使用的都是企业开发小程序账号
  handleShare() {
    wx.showActionSheet({
      // 按钮的文本数组, 长度最大为6个
      itemList: ['分享到朋友圈', '分享到qq空间', '分享到微博'],
      // 按钮的文字颜色
      itemColor: '#CDEFA5'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})