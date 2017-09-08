const hotelService = require('../../../utils/hotelService.js');
const api = require('../../../utils/api.js');
const app = getApp();

Page({
  no: '',
  hotelName: '',
  checkin: '',
  checkout: '',
  calSelectEvent: null,

  data: {
    loadingTxt:'最低价格、最佳优待、马上就来...',
    loadingPage:true,
    loadingPrice:true,
    indicatorDots: true,
    indicatorColor: '#ffffff',
    indicator: 'rgba(255, 255, 255, .5)', //酒店品牌swiper切换点默认颜色
    indicatorActiv: '#FB5F0A', //酒店品牌swiper切换当前点颜色
    autoplay: false,
    interval: 5000,
    duration: 500
  },

  onLoad: function (options) {

    // 获取接收参数
    this.no = options.no;
    this.hotelName = options.hotelName;
    this.checkin = options.checkin;
    this.checkout = options.checkout;



    this.calSelectEvent = app.pubsub.subscribe('calSelectDate',(msg, data) => {

      this.getRatePlan(data.start, data.end);

    });

  },
  onReady() {

    //动态加载导航标题
    wx.setNavigationBarTitle({
      title: this.hotelName
    });

    // 获取酒店基本信息
    api.wxRequest({
      url: 'gdsHotel/detail/' + this.no,
      success: (res) => {
        const hotelBaseInfo = res.data.res;
        const imageArrNum = hotelBaseInfo.imageList.length;
        const imgUrls = hotelBaseInfo.imageList.slice(0, 5);
        this.setData({
          hotelBaseInfo,
          imageArrNum,
          imgUrls,
          loadingPage:false
        });
      }
    });

    this.getRatePlan(this.checkin, this.checkout);
  },
  getRatePlan(ci, co) {

    this.setData({
      loadingPrice: true
    });

    const date = hotelService.getCheckinAndCheckout(ci, co);

    let checkin = date.checkin;
    let checkout = date.checkout;
    let no = this.no;

    // 设置全局数据
    this.checkin = checkin;
    this.checkout = checkout;

    const nextResultReferenceCode = '';
    const dateTxt = hotelService.getCheckinAndCheckoutTxt(checkin, checkout);

    this.setData({
      checkinTxt: dateTxt.checkinTxt,
      checkoutTxt: dateTxt.checkoutTxt,
      days: dateTxt.days
    });

    let ratePlanList = [];

    const _getRatePlan = (no, checkin, checkout, nextResultReferenceCode) => {

      const paramObj = {no: no, checkinDate: checkin, checkoutDate: checkout,
        nextResultReferenceCode: nextResultReferenceCode};

      api.wxRequest({
        url: '/gdsHotel/ratePlanList',
        data: paramObj,
        success: (res) => {

          const data = res.data;

          if (data.code == 1) {
            const res = data.res;

            const nextResultReferenceCode = res.nextResultReferenceCode;

              // 加入并排序
            ratePlanList = ratePlanList.concat(res.data);

              // 排序
            const ratePlanByRoomList = sortByRoom(ratePlanList);

            ratePlanByRoomList.forEach((v, i) => {
              v.status = (i == 0) ? false : true;
            });


            this.setData({
              ratePlanByRoomList
            });


            // 如果有下一页查询，继续请求下一页
            if (nextResultReferenceCode) {


              return _getRatePlan(no, checkin, checkout, nextResultReferenceCode);
            }
          }
          this.setData({
            loadingPrice: false
          });
        }
      });

    };

    _getRatePlan(no, checkin, checkout, nextResultReferenceCode);

  },
  baseInfoPage() {
    wx.navigateTo({
      url: `/pages/hotel/baseInfo/baseInfo?no=${this.no}&hotelName=${this.hotelName}`
    });
  },
  allPhotoPage() {
    wx.navigateTo({
      url: `/pages/hotel/allPhotoPage/allPhotoPage?no=${this.no}&hotelName=${this.hotelName}`
    });
  },
  selectDate() {
    wx.navigateTo({
      url: '/pages/calendar/calendar?begin=' + this.checkin + '&end=' + this.checkout
    });
  },

  showRealteRoom(e) {
    const index = e.currentTarget.dataset.index;
    const ratePlanByRoomList = this.data.ratePlanByRoomList;
    ratePlanByRoomList.forEach(function(v, i) {
      v.status = (i == index) ? !v.status : true;
    });

    this.setData({
      ratePlanByRoomList
    });
  },
  bookingPage(e) {
    wx.navigateTo({
      url: '/pages/hotel/rateDetail/rateDetail?no=' + this.no +'&rateNo='+e.currentTarget.dataset.no + '&checkin=' + this.checkin + '&checkout=' + this.checkout
    });
  },
  hotelLocationPage() {

    let name = this.data.hotelBaseInfo.nameCn;
    if(!name){
      name = this.data.hotelBaseInfo.name;
    }

    wx.openLocation({
      name: name,
      address: this.data.hotelBaseInfo.address,
      latitude: this.data.hotelBaseInfo.latitude,
      longitude: this.data.hotelBaseInfo.longitude,
      scale: 28
    })

  },
  onShareAppMessage: function (res) {

    let shareTitle = this.data.hotelBaseInfo.nameCn + this.data.hotelBaseInfo.name;
    let shareUrl = `/pages/hotel/detail/detail?no=${this.no}&&checkin=${this.checkin}&&checkout=${this.checkout}`;

    return {
      title: shareTitle,
      path: shareUrl
    };
  },
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber:app.globalData.telNumber
    })
  },



  onUnload() {
    app.pubsub.unsubscribe(this.calSelectEvent);
  }
});



// 方案价格按房型排序
function sortByRoom(ratePlanArr) {
  let roomType = [];

  ratePlanArr.forEach(function(v, i) {

    // 判断roomType 和 bedType 是否存在
    const _tmpRoomObj = {room: v.room, isSuite: v.isSuite, parseRoom: v.parseRoom };

    let isExist = false;

    for (const vv of roomType){
      if (vv.room === _tmpRoomObj.room) {
        isExist = true;
        // 添加到该位置
        vv.roomList.push(v);
        // 跳出循环，非跳出整个函数
        break;
      } else {
        isExist = false;
      }
    }


    if (!isExist) {
      _tmpRoomObj.roomList = [];
      _tmpRoomObj.roomList.push(v);

      roomType.push(_tmpRoomObj);
    }

  });

  // 内部排序价格
  roomType.forEach(function(v, i) {
    // 二组数组按价格排序
    v.roomList = v.roomList.sort(function(a, b) {
      return a.cnyTotal - b.cnyTotal;
    });

    // 记录单项数组起价
    v.minTotalAmount = v.roomList[0].cnyTotal;
  });

  // 内部最低价格再排序
  roomType = roomType.sort(function(a, b) {
    return a.minTotalAmount  - b.minTotalAmount;
  });

  return roomType;
}



