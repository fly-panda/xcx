// pages/vacation/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSollect: true,
    isSollectText: '收藏',
    loadingPage: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
    indicatorDots: true,
    indicatorColor: 'rgba(255, 255, 255, .5)',
    indicatorActive: '#fb5f0a',
    imgUrls: [
      'https://resource.36dong.com/badazhou/www/res/20160811/a69fe3a48f71d62167c1bd39ea1dcc6c.jpg',
      'https://resource.36dong.com/badazhou/www/res/20160811/b6cb7a58fb9b940cf0cc63ccab44ade3.jpg',
      'https://resource.36dong.com/badazhou/www/res/20160811/cace055b19c5df8e83e0ab03daff9464.jpg'
    ],
    imageArrNum: 20,
    startingPoint: '上海出发'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '罗莱夏朵 · 斯里兰卡Ceylon Tea Trails+Cape Weligama 7晚8日度假'
    });
    this.setData({
      loadingPage: false
    })


  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '4000-88-2020'
    })
  },
  collect() {
    this.setData({
      isSollect: !this.data.isSollect,
    })
  },
  routeDetail() {
    wx.navigateTo({
      url: '/pages/vacation/travelSchedule/travelSchedule'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
