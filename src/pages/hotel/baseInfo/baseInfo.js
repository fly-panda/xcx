const api = require('../../../utils/api.js');

Page({

  onLoad(options) {

    const no = options.no;
    const hotelName = options.hotelName;

    // 动态设置标题
    wx.setNavigationBarTitle({
      title: hotelName
    });

    api.wxRequest({
      url: '/gdsHotel/detail/'+no,
      success: (res) => {
        let hotelBaseInfo = res.data.res;
        let fami = hotelBaseInfo.fami.split('\n');
        let faci = hotelBaseInfo.faci.split('\n');
        let desc = hotelBaseInfo.desc.split('\n');

        this.setData({
          hotelBaseInfo,
          fami,
          faci,
          desc
        });
      }
    });
  },
  getTranslate(q, contentTran) {
    api.wxRequest({
      url: 'gdsHotelTranslate/enToCn',
      method:'post',
      data:{q},
      success: (res) => {
        switch (contentTran) {
          case 'desc':
          this.setData({
            descTran:res.data.res.translate
          });
          break;
          case 'faci':
          this.setData({
            faciTran:res.data.res.translate
          });
          break;
          case 'fami':
          this.setData({
            famiTran:res.data.res.translate
          });
          break;
        }
      }
    });
  },
  translateCn(e) {
    let name = e.currentTarget.dataset.name;
    const desc = this.data.hotelBaseInfo.desc;
    const faci = this.data.hotelBaseInfo.faci;
    const fami = this.data.hotelBaseInfo.fami;
    switch (name) {
      case 'desc':
      this.getTranslate(desc,'desc');
      break;
      case 'faci':
      this.getTranslate(faci,'faci');
      break;
      case 'fami':
      this.getTranslate(fami,'fami');
      break;
    }
  }

})
