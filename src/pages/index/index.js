//index.js
const hotelService = require('../../utils/hotelService.js');
const showToast = require('../../utils/toast.js');
const api = require('../../utils/api.js');
const app = getApp();



Page({
  data:{
    checkin: '',
    checkout: '',
    calEvent: null,
    areaEvent: null,
    brandEvent: null,
    current: 0,
    area: {nameCn: ''}, //选择城市
    areaId: null,//城市Id
    selectBrandArray: [],//用户选择品牌数组
    brandNameCnArray: [], //品牌中文数组
    lowVersionShare: !wx.canIUse('button.open-type.share'), //低版本转发兼容
    privilegeList:['1', '3', '13', '9', '6', '14', '2', '4', '5', '7', '10', '8', '49', '12', '11', '16', '24'], //优待品牌ID
    showModalData:{status:false} //模态框状态默认隐藏
  },
  onLoad() {

    //监听城市
    this.areaEvent = app.pubsub.subscribe('selectArea', (msg, area) => {
      this.setData({
        area,
        brandNameCnArray: []
      });
      wx.removeStorageSync('hotelBrandList');
    });
    //监听日历
    this.calEvent = app.pubsub.subscribe('calSelectDate',(msg, data) => {
      let checkin = data.start;
      let checkout = data.end;

      let dateTxt = hotelService.getCheckinAndCheckoutTxt(checkin, checkout);
      this.setData({
        checkinTxt: dateTxt.checkinTxt,
        checkoutTxt: dateTxt.checkoutTxt,
        days: dateTxt.days
      });
      wx.setStorageSync('hotelDate', {
        checkin,
        checkout
      });
    });
    //监听酒店品牌
    this.brandEvent = app.pubsub.subscribe('selectBrandList', (msg, selectBrandArray) => {
      let brandNameCnArray = [];
      for(let v of selectBrandArray){
        brandNameCnArray.push(v.nameCn);
      };
      this.setData({
        selectBrandArray,
        brandNameCnArray
      })
    })
  },
  onReady() {
    const date = hotelService.getCheckinAndCheckout(this.checkin, this.checkout);

    // 设置全局数据
    this.checkin = date.checkin;
    this.checkout = date.checkout;

    const dateTxt = hotelService.getCheckinAndCheckoutTxt(this.checkin, this.checkout);

    let area = wx.getStorageSync('hotelArea');

    let brand = wx.getStorageSync('hotelBrandList');
    let brandNameCnArray = [];
    for(let v of brand){
      brandNameCnArray.push(v.nameCn);
    }

    // 设置默认城市为新加坡
    if(!area) {
      area = app.globalData.hotelDefaultArea;
      wx.setStorageSync('hotelArea',area);
    }

    //请求品牌优待
    api.wxRequest({
      url: 'gdsHotel/exclusiveBrandList/',
      success: (res) => {
        let exclusiveBrandList = res.data.res;
        this.setData({
          exclusiveBrandList
        });
      }
    });

    this.setData({
      checkinTxt: dateTxt.checkinTxt,
      checkoutTxt: dateTxt.checkoutTxt,
      days: dateTxt.days,
      area,
      brandNameCnArray
    })
  },
  showPrivilege(e){
    let brandId = e.currentTarget.dataset.brandId;
    let title = '';
    let content = [];
    for(let v of this.data.exclusiveBrandList){
      if(v.id == brandId){
        title = v.nameCn + v.name;
        content = v.exclusiveInfoList;
        break;
      }
    }
    let showModalData = {
      status:true,
      title,
      content,
      confirmText:'我已了解'
    };
    this.setData({
      showModalData
    })
  },
  hideShowModal(){
    let showModalData = {
      status:false
    };
    this.setData({
      showModalData
    })
  },
  selectArea() {
    wx.navigateTo({
      url: '/pages/hotel/areaList/areaList'
    });
  },
  selectDate() {
    wx.navigateTo({
      url: '/pages/calendar/calendar?begin=' + this.checkin + '&end=' + this.checkout
    });
  },
  selectBrands() {

    wx.navigateTo({
      url: '/pages/hotel/brandList/brandList?id='+this.data.area.id
    });

  },
  hotelListPage() {

    wx.navigateTo({
      url: '/pages/hotel/list/list?areaName=' + this.data.area.nameCn
    });

  },
  advantage() {
    wx.navigateTo({
      url: '/pages/hotel/advantage/advantage'
    })
  },
  lowVersionShare() {
    wx.showModal({
      title: '转发',
      content: '请点击右上角[...]里面的转发'
    })
  },

  onShareAppMessage(res) {

    return {
      imageUrl:'https://file.36dong.com/badazhou/weixinxcx/shareImage.jpg?1326',
      title: '八大洲旅游-精选奢华酒店预订',
      path: '/pages/index/index'
    };
  },
  onTitleToast () {
    showToast.toast('请输入城市', false);
  },
  onUnload() {
    app.pubsub.unsubscribe(this.calEvent);
    app.pubsub.unsubscribe(this.areaEvent);
    app.pubsub.unsubscribe(this.brandEvent);
  }
});

