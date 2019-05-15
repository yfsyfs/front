// pages/list/list.js
// 使用commonJS规范进行js的模块化 ，注意, require 只能使用相对路径, 绝对路径不行, 这应该是工具的一个bug
let datas = require('../../datas/list-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      listArr: datas.list_data
    })
  },

  //去往详情页
  toDetail(e) {
    // 获取点击跳转对应的下标
    let index = e.currentTarget.dataset.xxx;
    wx.navigateTo({
      url: `/pages/detail/detail?idx=${index}`
    })
  },

  // 单击轮播图跳转
  carousel2detail(e) {
    // 注意, 这里在 target中取, 而上面是在 currentTarget 中取, 这是因为在 list.wxml 中是事件委托, 即触发事件的是子元素, 但是通过冒泡调用的是父元素上的事件响应函数, 此时就要使用target, 而上面不是事件委托, 所以就是 currentTarget（当前元素，而target是触发事件的元素）
    let index = e.target.dataset.index;
    wx.navigateTo({
      url: `/pages/detail/detail?idx=${index}`
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
    console.log('list页面被隐藏了...但是没销毁!')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('页面卸载了...而且已经销毁了!')
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