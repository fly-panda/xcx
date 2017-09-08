// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    console.log('登录');
    wx.login({
      success: (res) => {

        console.log(res);

        if (res.code) {
          //发起网络请求

          wx.request({
            url: 'https://www.badazhou.com/onLogin',
            data: {
              code: res.code
            },
            success: (res) => {
              console.log(res);

            }
          })







        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail:(e) => {
        console.log(e);

      }

    });

    wx.getUserInfo({
      success: function(res) {
        console.log(res);

        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })

 }

})
