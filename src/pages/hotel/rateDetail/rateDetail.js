const hotelService = require('../../../utils/hotelService.js');
const api = require('../../../utils/api.js');






Page({
  no: '', //酒店编号
  checkin: '', // 入住时间
  checkout: '', // 离店时间
  rateNo: '', //酒店房型方案编号

  data: {
    loadingTxt:'最低价格、最佳优待、马上就来...',
    loadingPage: true,
    isPriceInfoWrap: false,
    isShowPriceListBtn: true,
    isRoomDetailHide:false
  },
  onLoad(options) {

    this.no = options.no;
    this.rateNo = options.rateNo;
    this.checkin = options.checkin;
    this.checkout = options.checkout;

  },
  onReady() {

    // 获取设备信息
    const sysInfo = wx.getSystemInfoSync();

    // 设置scrollViewHight
    this.setData({
      scrollViewHight: sysInfo.windowHeight
    });

    //日期的格式转化
    const dateTxt = hotelService.getCheckinAndCheckoutTxt(this.checkin, this.checkout);
    this.setData({
      checkinTxt: dateTxt.checkinTxt,
      checkoutTxt: dateTxt.checkoutTxt,
      days: dateTxt.days
    });
    // 获取酒店方案信息
    api.wxRequest({
      url: 'gdsHotel/rateRule',
      data: {
        no: this.no,
        checkinDate: this.checkin,
        checkoutDate: this.checkout,
        rateNo: this.rateNo
      },
      success: (res) => {
        const rateRule = res.data.res;
        const ratePlan = rateRule.rate.rateDescription.split('\n');
        const cancel = rateRule.rule.cancellationDesc.split('\n');
        const roomDetail = rateRule.rate.roomDetail ? rateRule.rate.roomDetail.split('\n') : [];
        const extraCharges = rateRule.rate.extraCharges ? rateRule.rate.extraCharges.split('\n') : [];
        const rateTotal = rateRule.rate.total.replace(/[A-Z]/g,"");
        this.setData({
          loadingPage:false,
          rateRule,
          ratePlan,
          roomDetail,
          extraCharges,
          cancel,
          rateTotal
        });
        //如果有优待，获取优待信息
        if(rateRule.isRateCodePrice){
          api.wxRequest({
            url: 'gdsHotel/brandDetail/'+rateRule.hotelDetail.brandId,
            success: (res) => {
              this.setData({
                brandDetail: res.data.res.exclusiveInfoList
              });
            }
          })
        }
      }

    });


  },
  roomDetail() {
    if(this.data.roomDetail.length != 0){
      this.setData({
        isRoomDetailHide: !this.data.isRoomDetailHide
      })
    }
  },
  showPriceList() {
    this.setData({
      isPriceInfoWrap: !this.data.isPriceInfoWrap,
      isShowPriceListBtn: !this.data.isShowPriceListBtn
    })
  },
  hidePriceInfoWrap() {
    this.setData({
      isPriceInfoWrap: !this.data.isPriceInfoWrap,
      isShowPriceListBtn: !this.data.isShowPriceListBtn
    })
  },
  confirmPage() {
    let rateRoom = this.data.rateRule.room;
    let base = this.data.rateRule.rate.base;
    let acceptCardListString = JSON.stringify(this.data.rateRule.acceptCardList);
    let rateTotal = this.data.rateTotal;
    let currencyCode = this.data.rateRule.rate.currencyCode;
    let rateCnyTotal = this.data.rateRule.rate.cnyTotal;


    wx.redirectTo({
      url: '/pages/hotel/booking/booking?no='+ this.no +'&rateNo='+ this.rateNo +'&base='+ base +'&rateRoom='+ rateRoom +'&acceptCardListString='+ acceptCardListString
      +'&checkin='+ this.checkin +'&checkout='+ this.checkout +'&currencyCode='+ currencyCode +'&rateTotal='+ rateTotal +'&rateCnyTotal='+ rateCnyTotal
    });
  },
  bestPrice() {
    wx.navigateTo({
      url:'/pages/hotel/bestPrice/bestPrice'
    })
  },
  getTranslate(q, contentTran) {
    api.wxRequest({
      url: 'gdsHotelTranslate/enToCn',
      method:'post',
      data:{q},
      success: (res) => {
        switch (contentTran) {
          case 'roomDetail':
          this.setData({
            roomDetailTran:res.data.res.translate
          });
          break;
          case 'ratePlan':
          this.setData({
            ratePlanTran:res.data.res.translate
          });
          break;
          case 'extraCharges':
          this.setData({
            extraChargesTran:res.data.res.translate
          });
          break;
          case 'cancel':
          this.setData({
            cancelTran:res.data.res.translate
          });
          break;
        }
      }
    });
  },
  translateCn(e) {
    let name = e.currentTarget.dataset.name;
    const roomDetail = this.data.rateRule.rate.roomDetail;
    const ratePlan = this.data.rateRule.rate.rateDescription;
    const cancel = this.data.rateRule.rule.cancellationDesc;

    const extraCharges = this.data.rateRule.rate.extraCharges;
    switch (name) {
      case 'roomDetail':
      this.getTranslate(roomDetail,'roomDetail');
      break;
      case 'ratePlan':
      this.getTranslate(ratePlan,'ratePlan');
      break;
      case 'extraCharges':
      this.getTranslate(extraCharges,'extraCharges');
      break;
      case 'cancel':
      this.getTranslate(cancel,'cancel');
      break;
    }
  }
})
