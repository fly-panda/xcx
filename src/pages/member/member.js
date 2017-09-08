const api = require("../../utils/api.js");
const app = getApp();

Page({

  data:{
    telNumber:app.globalData.telNumber
  },

  onReady() {
    api.wxRequest({
      url: 'vip/isLogin',
      success: (res) => {
        let isLogin = res.data.res ? true : false;

        this.setData({
          isLogin,
          notLogin: !isLogin
        })

        if(isLogin) {
          api.wxRequest({
            needLogin: true,
            url: 'vip/detail',
            success: (res) => {
              let phone = res.data.res.phone;
              this.setData({
                phone
              })
            }
          })
        }

      }
    })

  },
  loginBox: function(){
    wx.navigateTo({
      url: '/pages/member/login/login'
    })
  },
  hotelOrderListPage() {
    wx.navigateTo({
      url: '/pages/member/hotelOrderList/hotelOrderList'
    })
  },
  bindBankCardPage() {
    wx.navigateTo({
      url: '/pages/member/bindBankCard/bindBankCard'
    })
  },
  exit() {
    wx.showModal({
      title: '退出',
      content: '您确定是要退出八大洲旅游吗？',
      cancelColor:'#fb5f0a',
      confirmColor: '#888888',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('accessToken');
          this.onReady();
        }
      }
    })

  },
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.telNumber
    })
  }
})
