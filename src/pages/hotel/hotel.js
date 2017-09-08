

Page({

  data: {
    checkinDate: '2017-08-01',
    checkoutDate: '2017-08-05'
  },

  openCal() {
    var self = this;
    // 跳转到打开日历
    wx.navigateTo({
      url: '/pages/calendar/calendar?begin=' + this.data.checkinDate + '&&end=' + this.data.checkoutDate
    });


  },
  onUnload() {

  }


});
