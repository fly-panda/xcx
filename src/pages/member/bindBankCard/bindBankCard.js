const hotelService = require('../../../utils/hotelService.js');
const api = require('../../../utils/api.js');
const depositCard = require('../../../utils/depositCard.js');
const app = getApp();



Page({
  hotelCardEvent:null,

  data: {
    loadingTxt:'正在加载您的银行卡信息...',
    loadingPage:true,
    isEdit:true,
    isSubmit: false, //表单提交状态
    showSubmit: true, //可以点击提交状态
    formatBankCardNumber: '',//银行卡号
    showToast: {nullHouse: true, alertMsg: ''},  // 弹出框信息,默认状态隐藏
    cardNumberShanchu: true
  },
  onLoad() {

    //监听酒店会员卡
    this.hotelCardEvent = app.pubsub.subscribe('selectCard', (msg, bankCard) => {
      let imgUrl = 'https://file.36dong.com/badazhou/weixinxcx/icon/'+parseInt(bankCard.id)+'.jpg';
      this.setData({
        bankName:bankCard.name,
        imgUrl,
        bgColor:bankCard.bgColor
      });
    });

    this.getCard();
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


  formSubmit: function(e) {

    //获得提交所有数据
    let formData = e.detail.value;


    // 获取银行卡卡号
    let bankCardNumber = formData.bankCardNumber.replace(/[^0-9]/g,'');

    let name = formData.name;

    //匹配卡号码正则
    let cardPattern = /^[0-9]*$/;

    if(!this.data.bankName){
      this.showTipMsg('请选择开户银行');
      return;
    }
    //卡主不为空
    if(!name){
      this.showTipMsg('请输入卡主姓名');
      return;
    }

    // 判断银行卡号
    if(!formData.bankCardNumber) {
      this.showTipMsg('请输入银行卡号');
      return;
    }

    if(bankCardNumber.length < 6) {
      this.showTipMsg('银行卡号不合法');
      return false;
    }

    let cardData = {
      bankName:this.data.bankName,
      name:name,
      no:bankCardNumber
    }

    //防止重复提交
    this.setData({
      isSubmit : true,
      showSubmit: false
    });


    api.wxRequest({
      url: 'vipDepositCard/save',
      method:'POST',
      data:cardData,
      success: (res) => {
        if(res.data.code == 1){
          this.getCard();
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel:false,
            confirmText:'我知道了'
          })
        }
      },
      complete:(res) => {
        this.setData({
          isSubmit : false,
          showSubmit: true
        });
      }
    });

  },
  editCard() {
    let myBankCard = this.data.myBankCard;
    let bankName = myBankCard.bankName;


    let formatBankCardNumber = myBankCard.no.replace(/(\d{4})(?=\d)/g,"$1"+" ");

    this.setData({
      bankName,
      name:myBankCard.name,
      formatBankCardNumber,
      isEdit:true,
      isBankCard:false
    })
  },
  getCard() {
    api.wxRequest({
      url: 'vipDepositCard/defaultDetail',
      success: (res) => {
        if(res.data.code == 1){
          let myBankCard = res.data.res;
          let lastBankNo = myBankCard.no.substr(myBankCard.no.length - 4);
          console.log(lastBankNo);
          let bgColor = '';
          let imgUrl = '';
          for(let v of depositCard.cardList){
            if(v.name == myBankCard.bankName){
              bgColor = v.bgColor;
              imgUrl = v.imgUrl;
              break;
            }
          }


          this.setData({
            myBankCard,
            lastBankNo,
            bgColor,
            imgUrl,
            isEdit:false,
            isBankCard:true
          })
        }

      },
      complete:(res) =>{
        this.setData({
          loadingPage:false
        })
      }
    });
  },
  //格式银行卡卡号
  formatBankCardNumber(e){
    let value = e.detail.value.replace(/(\d{4})(?=\d)/g,"$1"+" ");
    let bankCardNumberLength = e.detail.value.length;
    this.setData({
      formatBankCardNumber: value,
      bankCardNumberLength: bankCardNumberLength
    })
  },
  resetCardNumber() {
    this.setData({
      formatBankCardNumber: '',
      bankCardNumberLength: 0
    })
  },
  selBankCard() {
    wx.navigateTo({
      url:'/pages/member/selBankCard/selBankCard'
    })
  }
})
