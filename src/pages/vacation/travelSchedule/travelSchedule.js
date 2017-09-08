// pages/vacation/travelSchedule/travelSchedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    interval: 5000,
    duration: 500,
    indicatorDots: false,
    indicatorColor: 'rgba(255, 255, 255, .5)',
    indicatorActive: '#fb5f0a',
    isSollect: true,
    showToast: {nullHouse: true, alertMsg: ''},  // 弹出框信息,默认状态隐藏
    imgUrls: [
      'https://himg1.qunarzz.com/imgs/201608/25/C._M0DCiL2XYfJJ5Nxi120.jpg',
      'https://resource.36dong.com/badazhou/www/res/20160811/a69fe3a48f71d62167c1bd39ea1dcc6c.jpg',
      'https://resource.36dong.com/badazhou/www/res/20160811/b6cb7a58fb9b940cf0cc63ccab44ade3.jpg',
    ]
  },


  // 显示提示消息,
  showTipMsg(alertMsg ,second = 1) {
    this.setData({
      showToast: {
        nullHouse: false,
        alertMsg: alertMsg
      }
    });
    //1秒之后弹窗隐藏
    setTimeout(()=> {
      this.setData({
        'showToast.nullHouse': true
      })
    }, second *1000);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 动态设置标题
    wx.setNavigationBarTitle({
      title: '八大洲旅游'
    });


  },
  collect() {
    this.setData({
      isSollect: !this.data.isSollect,
    })
    if(!this.data.isSollect){
      this.showTipMsg('收藏成功');
      return;
    } else {
      this.showTipMsg('已取消收藏');
      return;
    }
  },
  preview(e) {

    // let urls = [];
    // this.typeArr.forEach( function(e, i) {
    //   urls.push(e.url);
    // });

    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
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
    return {
        // imageUrl: 'https://file.36dong.com/badazhou/weixinxcx/shareImage.jpg?1326',
        title: '八大洲旅游',
        path: '/pages/vacation/travelSchedule'
      };
  }

})
