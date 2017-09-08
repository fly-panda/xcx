const hotelService = require('../../../utils/hotelService.js');
const api = require('../../../utils/api.js');

const app = getApp();

Page({
  calEvent: null,
  areaEvent: null,
  brandEvent: null,
  areaId: '',
  selBrandList: [],
  checkin: '',
  checkout: '',
  currentPage: 1,
  perPageNum: 15,
  totalPageNum: 0,
  hotelList: [],

  data: {
    loading: false,
    scrollTop: 0
  },
  onLoad(options) {

    try {

      // 获取设备信息
      const sysInfo = wx.getSystemInfoSync();

      // 设置scrollViewHight
      this.setData({
        scrollViewHight: sysInfo.windowHeight - 122
      });

      // 获取接收参数（一般是从分享的url过来）
      let areaId = options.areaId;
      let checkin = options.checkin;
      let checkout = options.checkout;

      let selBrandList = [];

      // 如果末有接收参数（从前一页过来, 从本地存储中获取）
      if (!areaId) {
        let storageArea = wx.getStorageSync('hotelArea');

        // 如果末找到本地存储，则调用默认值
        areaId = storageArea ? storageArea.id : app.globalData.hotelDefaultArea.id;

        let storageDate = wx.getStorageSync('hotelDate');
        if (storageDate) {
          checkin = storageDate.checkin;
          checkout = storageDate.checkout;
        } else {
          checkin = '';
          checkout = '';
        }

        // 选择的品牌
        let storageBrandList = wx.getStorageSync('hotelBrandList');

        if (storageBrandList) {
          selBrandList = storageBrandList;
        }

      }

      // 判断及处理checkin和checkout是否为合法日期
      let validDate = hotelService.getCheckinAndCheckout(checkin, checkout);

      checkin = validDate.checkin;
      checkout = validDate.checkout;

      // 设置全局数据
      this.checkin = checkin;
      this.checkout = checkout;
      this.areaId = areaId;
      this.selBrandList = selBrandList;

      // 远程获取城市信息
      api.wxRequest({
        url: '/gdsHotel/areaInfo/' + areaId,
        success: (res) => {

          let area = {};

          if (res.data.code == 1) {
            area = res.data.res;
          } else {
            area = app.globalData.hotelDefaultArea;
          }

          let uiDate = hotelService.getCheckinAndCheckoutTxt(checkin, checkout);

          // 设置到页面上
          this.setData({
            area,
            checkinTxt: uiDate.checkinTxt,
            checkoutTxt: uiDate.checkoutTxt,
            selBrandList
          });

          this.getList();
        }
      });


    } catch (e) {


    }


    // 地区修改
    this.areaEvent = app.pubsub.subscribe('selectArea', (msg, area) => {
      this.setData({
        area
      });

      wx.setStorageSync('hotelArea', area);

      wx.removeStorageSync('hotelBrandList');

      // 全局数据
      this.areaId = area.id;
      this.currentPage = 1;
      this.hotelList = [];
      this.selBrandList = [];

      this.setData({
        selBrandList: [],
        scrollTop: 0,
        hotelList: this.hotelList
      });
      this.getList();

    });

    // 日历修改
    this.calEvent = app.pubsub.subscribe('calSelectDate', (msg, data) => {

      let checkin = data.start;
      let checkout = data.end;

      let uiDate = hotelService.getCheckinAndCheckoutTxt(checkin, checkout);
      this.setData({
        scrollTop: 0,
        checkinTxt: uiDate.checkinTxt,
        checkoutTxt: uiDate.checkoutTxt,
        days: uiDate.days
      });
      wx.setStorageSync('hotelDate', {
        checkin,
        checkout
      });

      // 全局数据
      this.currentPage = 1;
      this.hotelList = [];
      this.checkin = checkin;
      this.checkout = checkout;

      this.getList();
    });

    // 品牌修改
    this.brandEvent = app.pubsub.subscribe('selectBrandList', (msg, brandList) => {
      this.setData({
        selBrandList: brandList,
        scrollTop: 0
      });

      // 设置到存储中
      wx.setStorageSync('hotelBrandList', brandList);

      // 全局数据
      this.selBrandList = brandList;
      this.currentPage = 1;
      this.hotelList = [];


      this.getList();
    });

  },




  getList() {

    this.setData({
      loading: true
    });

    // 得到selBrandIdList的值
    let selBrandIdList = [];

    this.selBrandList.forEach((v) => {
      selBrandIdList.push(v.id);
    });


    // api
    api.wxRequest({
      url: '/gdsHotel/search',
      method: 'POST',
      data:{
        areaId: this.areaId,
        perPage: this.perPageNum,
        page: this.currentPage,
        brandIdList: selBrandIdList
      },
      success: (res) => {

        let sysHotelList = res.data.res;

        for (let v of sysHotelList.data){
          v.priceLoading = true;
        }

        this.totalPageNum = Math.ceil(sysHotelList.total / this.perPageNum);

        this.hotelList = this.hotelList.concat(sysHotelList.data);

        this.setData({
          hotelList: this.hotelList,
          loading: false
        });
        // 酒店价格请求
        let hotelNoList = [];

        for (let v of sysHotelList.data){
          hotelNoList.push(v.no);
        }

        api.wxRequest({
          url: '/gdsHotel/priceList',
          method: 'POST',
          data:{
            hotelNoList,
            checkinDate: this.checkin,
            checkoutDate: this.checkout
          },

          success: (res) => {

            let priceList = res.data.res;
            for (let v of sysHotelList.data){
              v.priceLoading = false;
            }
            for (let v of priceList) {
              for (let vv of this.hotelList){
                if (v.no == vv.no){
                  vv.cnyMinAmount = v.cnyMinAmount;
                  break;
                }
              }
            }

            for (let v of this.hotelList) {
              if (!v.cnyMinAmount) {
                v.notAvaliable = true;
              } else {
                v.notAvaliable = false;
              }
            }

            this.setData({
              hotelList: this.hotelList
            });

          }
        });
      }
    });

  },

  onScrollLower() {

    if (this.currentPage < this.totalPageNum) {
      // show loading more
      this.currentPage++;
      this.getList();

    } else {
      // no more end
    }

  },
  // 选择地区
  selectArea() {
    wx.navigateTo({
      url: '/pages/hotel/areaList/areaList'
    });

  },
  // 选择日历
  selectDate() {

    wx.navigateTo({
      url: '/pages/calendar/calendar?begin=' + this.checkin + '&end=' + this.checkout
    });

  },
  // 选择品牌
  selectBrand() {

    wx.navigateTo({
      url: '/pages/hotel/brandList/brandList?id=' + this.areaId
    });
  },
  hotelDetail(e) {

    wx.navigateTo({
      url: '/pages/hotel/detail/detail?no=' + e.currentTarget.dataset.no + '&hotelName=' + e.currentTarget.dataset.name

    });

  },
  onShareAppMessage: function () {

    let shareTitle = area.nameCn + '酒店列表';
    let shareUrl = `/pages/hotel/list/list?areaId=${this.areaId}&&checkin=${this.checkin}&&checkout=${this.checkout}`;

    return {
      title: shareTitle,
      path: shareUrl
    };

  },
  onUnload() {

    app.pubsub.unsubscribe(this.calEvent);
    app.pubsub.unsubscribe(this.areaEvent);
    app.pubsub.unsubscribe(this.brandEvent);

  }
});
