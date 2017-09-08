const api = require("../../../utils/api.js");
const app = getApp();

Page({
  no:'',
  data: {
    loadingTxt:'订单详情正在加载中...',
    loadingPage:true
  },
  onLoad: function (options) {
    this.no = options.no;
    // this.no = '20170825545404';

  },
  onReady: function () {
    //请求订单信息
    api.wxRequest({
      url: 'orderGdsHotelDetail/index/'+ this.no,
      method: 'POST',
      success: (res) => {
        const orderDetail = res.data.res;
        const personList = orderDetail.personList;
        let rateDesc = orderDetail.roomPlanDetail.rateDesc;
        let cancellationDesc = orderDetail.roomPlanDetail.cancellationDesc;

        let exclusiveInfoList = orderDetail.hotelDetail.brandDetail.exclusiveInfoList;

        if(cancellationDesc){
          cancellationDesc = cancellationDesc.split('\n');
        }
        if(rateDesc){
          rateDesc = rateDesc.split('\n');
        }

        this.setData({
          orderDetail,
          personList,
          exclusiveInfoList,
          rateDesc,
          cancellationDesc,
          loadingPage:false
        })

      }
    });

    //请求银行卡信息
    api.wxRequest({
      url: 'vipDepositCard/defaultDetail',
      success: (res) => {
        if(res.data.code != 1){
          this.setData({
            notHasBankCard:true
          })
        }
      }
    });
  },
  cancelOrder() {
    wx.showModal({
      title: '取消订单',
      content: '请认真阅读取消政策，酒店将按取消政策进行免费或付费取消，取消时间均以酒店当地时间为准。',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            isCancel:true
          });
          api.wxRequest({
            url: 'orderGdsHotelCancel/index/'+ this.no,
            method: 'POST',
            success: (res) => {
              if(res.data.code == 1){
                this.onReady();
                // 获取前一个页面，调用onLoad和onReady方法
                let pageList = getCurrentPages();
                let pageLength = pageList.length;

                // 如果pageLength 大于1时，跳转到前一页
                if(pageLength > 1) {
                  let prevPage = pageList[pageLength - 2];
                  prevPage.onReady();
                }
              }else{
                wx.showModal({
                  title: '取消失败',
                  content: res.data.msg
                })
              }
            },
            complete:(res) => {
              this.setData({
                isCancel:false
              });
            }
          });
        } else if (res.cancel) {

        }
      }
    })

  },
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.orderDetail.hotelDetail.businessPhoneNumber
    })
  },
  hotelLocationPage() {
    let name = this.data.orderDetail.hotelDetail.nameCn;
    if(!name){
      name = this.data.orderDetail.hotelDetail.name;
    }

    wx.openLocation({
      name: name,
      address: this.data.orderDetail.hotelDetail.address,
      latitude: this.data.orderDetail.hotelDetail.latitude,
      longitude: this.data.orderDetail.hotelDetail.longitude,
      scale: 28
    })
  },
  makePhoneCall(e) {
    let phoneNumber = e.currentTarget.dataset.phonenumber;
    if(!phoneNumber){
      phoneNumber = app.globalData.telNumber;
    }
    wx.makePhoneCall({
      phoneNumber
    })
  },
  bindBankCard() {
    wx.navigateTo({
      url:'/pages/member/bindBankCard/bindBankCard'
    })
  }
})
