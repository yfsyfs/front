// pages/index/index.js
Page({ // Page 函数用于注册页面

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isShow: true
  },

  // es6的语法
  // handleParent() {
  //   console.log('父元素被调用')
  // },

  // es6的语法
  // handleChild() {
  //   console.log('子元素被调用')
  // },

  handleClick() {
    // 点击跳转到list页面 navigateTo这个API 保留当前页面(即当前页面还在,点击返回按钮之后能够回去, 如果使用的api是redirectTo的话,则当前页面就不在了, 即关闭当前页面（没有回退按钮的），跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。)，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。 如果使用 navigateTo的话, 会调用onHide(即隐藏当前index页面), 如果使用的是 redirect的话, 会调用 onUnload 卸（销）载（毁）当前页面（即index页面）
    // 因为list 是tabbar中的, 所以不能用navigateTo 或者 redirectTo 这两个是跳不过去的(见微信小程序开发文档)
    wx.switchTab({
      // 这里写绝对路径
      url: '/pages/list/list',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 一般用于做一些初始化工作，如发送请求、开启定时器等
    this.getUserInfo()
  },

  getUserInfo() {
    // 获取用户当前的设置
    wx.getSetting({
      success: (data) => {
        if (data.authSetting['scope.userInfo']) {
          // 用户已经授权
          this.setData({
            isShow: false
          })
        } else {
          // 用户没有授权
          this.setData({
            isShow: true
          })
        }
      }
    })
    /*
    下面使用that方式解决this指向问题
    
    let that = this
    // 获取用户信息
    wx.getUserInfo({
      success(data) {
        // 更新data中的userInfo
        that.setData({
          userInfo: data.userInfo
        })
      },

    })
    */

    // 学过es6之后, 开始使用箭头函数解决这个问题 这个比上面 that 优雅一些, 少一些开销
    // 获取用户信息
    wx.getUserInfo({
      // 成功回调
      success: (data) => {
        // 或者使用下面更新数据的方式
        this.setData({
          userInfo: data.userInfo
        })
      },
      // 失败回调(如果不授权的话, 就会走失败回调)
      fail() {
        console.log('有可能没授权~')
      }

    })
  },

  // 处理用户点击"获取用户登录信息" 按钮之后的回调
  handleGetUserInfo(data) {
    // 如果用户点击的是允许（即同意我方小程序获取用户信息）
    if (data.detail.rawData) {
      // 本办法是重新调用onLoad, 因为onLoad设计的初衷就是只执行一次，但是现在你又让我认为的重新执行一次, 所以好办法就是将onLoad拆出来
      // this.onLoad()
      this.getUserInfo()
    }
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