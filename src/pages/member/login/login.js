const app = getApp();
const api = require("../../../utils/api.js");



Page({
  maxTime: 60,
  currentTime: 60,  // 倒计时时间（单位：秒）
  interval: null,

  data: {
    txtMsg: '免费获取', // 获取验证码按钮信息
    alertMsg: '', // 弹出框信息
    nullHouse: true,  // 弹出框默认状态隐藏
    phoneNum: '', // 默认电话号码为空
    identifyCode: '', // 默认验证码为空
    status: true, // 默认获取验证码按钮为可操作状态
    type: false, // 默认登录按钮为不可操作状态
    phoneFocus: true
  },
  //检测手机号和验证码是否都已经输入
  isFormValid(phoneNum,code) {
    if(phoneNum != '' && code != '') {
      return true;
    }
    return false;
  },

  phoneChange(phone) {
    this.setData({
      phoneNum: phone.detail.value,
      type: this.isFormValid(phone.detail.value, this.data.identifyCode)
    })

  },

  identifyCodeChange(code) {
    this.setData({
      identifyCode: code.detail.value,
      type: this.isFormValid(this.data.phoneNum, code.detail.value)
    })
  },
  // 显示提示消息
  showTipMsg(alertMsg) {

    this.setData({
      nullHouse: false,
      alertMsg: alertMsg
    });
    //1秒之后弹窗隐藏
    setTimeout(() => {
      this.setData({
        nullHouse: true
      })
    },1000);

  },

  //获得验证码按钮状态
  getCode() {

    //获得手机号码并去除误输入的空格
    let phone = this.data.phoneNum.trim();

    //匹配手机号的正则
    let phonePattern = /^1\d{10}$/;

    if(!phone) {
      this.showTipMsg('手机号不为空');
      return;
    }

    if(!phonePattern.test(phone)) {
      this.showTipMsg('手机号不合法');
      return;
    }


    this.setData({
      phoneFocus: false,
      codeFocus: true
    });



    if (this.data.status) {

      api.wxRequest({
        url: 'vipLogin/sendPhoneCode',
        method: 'POST',
        data: {
          phone: this.data.phoneNum
        }
      })

      this.setData({
        status: false,
        txtMsg: this.currentTime + 's后重发'
      });

      this.interval = setInterval(() => {
        if(this.currentTime > 1) {
          this.currentTime--;
          this.setData({
            txtMsg: this.currentTime + 's后重发'
          });
        }else{
          clearInterval( this.interval );
          this.currentTime = this.maxTime;
          this.setData({
            status: true,
            txtMsg: '免费获取'
          });
        }
      }, 1000);

    }
  },
  submit() {

    //获得手机号码并去除误输入的空格
    let phone = this.data.phoneNum.trim();
    let identifyCode = this.data.identifyCode.trim();

    //匹配手机号的正则
    let phonePattern = /^1\d{10}$/;

    if(!phone) {
      this.showTipMsg('请输入手机号');
      return;
    }

    if(!phonePattern.test(phone)) {
      this.showTipMsg('手机号不合法');
      return;
    }

    if(!identifyCode){
      this.showTipMsg('请输入短信验证码');
      return;
    }


    api.wxRequest({
      url: 'vipLogin/loginByPhoneAndVerificationCode',
      method: 'POST',
      data: {
        phone: phone,
        verificationCode: identifyCode
      },
      success: (res) => {

        var rspData = res.data;

        if(rspData.code == 1) {
          let token = rspData.res.token;

          // 将数据存储到storage中
          wx.setStorageSync('accessToken', token);


          // 获取前一个页面，调用onLoad和onReady方法
          let pageList = getCurrentPages();
          let pageLength = pageList.length;

          // 如果pageLength 大于1时，跳转到前一页
          if(pageLength > 1) {
            let prevPage = pageList[pageLength - 2];
            prevPage.onReady();
            wx.navigateBack();
          } else {
            wx.navigateTo({
              url: '/pages/member/member'
            })
          }

        } else {
          this.showTipMsg(rspData.msg);
        }
      }
    })

  }


});
