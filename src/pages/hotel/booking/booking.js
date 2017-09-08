const hotelService = require('../../../utils/hotelService.js');
const api = require('../../../utils/api.js');
const app = getApp();



Page({
  no: '', //酒店编号
  rateNo: '', //酒店方案编号
  base: '', //酒店基础房价
  rateRoom: '', // 酒店房型
  checkin: '', // 入住时间
  checkout: '', // 离店时间
  acceptCardList: [], //酒店房型接受信用卡
  currencyCode: '', //货币币种
  rateTotal: '', //单间总额
  rateCnyTotal: '', //约合人民币总额
  addPersonRoomIndex: '0',
  person: {}, //定义一个人的对象
  arrivalTime: '', //备注抵店时间
  demand: '', //备注住宿需求
  other: '', //备注其他
  hotelCardEvent:null, //酒店集团会员卡

  data: {
    isChange: false, //switch默认状态off
    isNote: false, //备注默认隐藏
    isSubmit: false, //表单提交状态
    showSubmit: true, //可以点击提交状态
    isAddPerson:false, //添加入住人状态
    isChild:false, //默认不是添加儿童
    formatCardNumber: '',
    showToast: {nullHouse: true, alertMsg: ''},  // 弹出框信息,默认状态隐藏
    roomList: [{value:'1', isSel:true}, {value:'2',isSel:false}],
    childAge: [
      {age:'<1'},
      {age:'1'},
      {age:'2'},
      {age:'3'},
      {age:'4'},
      {age:'5'},
      {age:'6'},
      {age:'7'},
      {age:'8'},
      {age:'9'},
      {age:'10'},
      {age:'11'},
      {age:'12'},
      {age:'13'},
      {age:'14'},
      {age:'15'},
      {age:'16'},
      {age:'17'}
    ],
    personType: [
      {prefixTitleId:'1', value:'先生', isSelPerson: true},
      {prefixTitleId:'2', value:'女士', isSelPerson: false},
      {prefixTitleId:'3', value:'男孩', isSelPerson: false},
      {prefixTitleId:'4', value:'女孩', isSelPerson: false}
    ],

    isOtherCode: false,
    areaCodeList: [
      {
        code: '86',
        value: '中国 +86'
      },
      {
        code: '852',
        value: '香港 +852'
      },
      {
        code: '886',
        value: '台湾 +886'
      },
      {
        code: '853',
        value: '澳门 +853'
      },
      {
        code: '-1',
        value: '其他国家'
      }
    ],
    roomIndex: 0, //房间数从第一个下标开始
    arrivalTimeIndex: 0, //抵店时间从第一个下标开始
    areaCodeIndex:0,  //区号从第一个下标开始
    cardIndex:0, //信用卡类型从第一个下标开始
    cardTypeStatus:true,
    cardExpStatus: true,
    dateMonth: '年份-月份',
    roomNum:[
      {
        room:[{
          personType: [{prefixTitleId:'1', value:'先生', isSelPerson: true}, {prefixTitleId:'2', value:'女士', isSelPerson: false}]
        }]
      }
    ],
    arrivalTimeList:[
      '不确定',
      '00:00 - 01:00',
      '01:00 - 02:00',
      '02:00 - 03:00',
      '03:00 - 04:00',
      '04:00 - 05:00',
      '05:00 - 06:00',
      '06:00 - 07:00',
      '07:00 - 08:00',
      '08:00 - 09:00',
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '12:00 - 13:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
      '17:00 - 18:00',
      '18:00 - 19:00',
      '19:00 - 20:00',
      '20:00 - 21:00',
      '21:00 - 22:00',
      '22:00 - 23:00',
      '23:00 - 00:00',
      '次日00:00 - 01:00',
      '次日01:00 - 02:00',
      '次日02:00 - 03:00',
    ],
    demand:[
      {nameCn: '尽量大床 ', name:'King bed'},
      {nameCn: '尽量双床', name:'Twin bed'},
      {nameCn: '尽量高楼层', name:'Higher Floor'},
      {nameCn: '尽量低楼层', name:'Lower Floor'},
      {nameCn: '尽量安排蜜月布置', name:'Honeymoon'},
      {nameCn: '需要加床', name:'Extra bed'}
    ],
    showModalData:{
      status:false
    }
  },
  onLoad(options) {

    this.no = options.no;
    this.rateNo = options.rateNo;
    this.base = options.base;
    this.rateRoom = options.rateRoom;
    this.checkin = options.checkin;
    this.checkout = options.checkout;
    this.acceptCardList = JSON.parse(options.acceptCardListString);
    this.rateTotal = options.rateTotal;
    this.rateCnyTotal = options.rateCnyTotal;
    this.currencyCode = options.currencyCode;

    //模拟数据

    // this.no = 'atsiae737393';
    // this.rateNo = 'b2954aa47a23a09cf7a260b01e0fb694777f4afe';
    // this.base = 'CNY2482.00';
    // this.rateRoom = 'Rules, Deluxe Room, Guest Room, 1 King Or 2 Double';
    // this.checkin = '2017-10-25';
    // this.checkout = '2017-10-28';
    // this.acceptCardList = [{name: "VISA", code: "VI", weight: 100}, {name: "Mastercard", code: "MC", weight: 99}];
    // this.rateTotal = '2894.01';
    // this.rateCnyTotal = '2894.00';
    // this.currencyCode = 'CNY';

    //监听酒店会员卡
    this.hotelCardEvent = app.pubsub.subscribe('selectCard', (msg, hotelCard) => {
      this.setData({
        hotelCard
      });
    });

    //页面超时跳转
    // let pageTime = setTimeout(this.timeOut, 1800000);


  },
  onReady() {
    //获取用户手机号
    api.wxRequest({
      url: 'vip/detail',
      success: (res) => {
        this.setData({
          phone: res.data.res.phone
        })
      }
    })

    let cardsArray = [];
    for(let v of this.acceptCardList){
      cardsArray.push(v.name);
    }

    let areaCodesArray = [];
    for(let v of this.data.areaCodeList) {
      areaCodesArray.push(v.value);

    }

    //日期的格式转化
    const dateTxt = hotelService.getCheckinAndCheckoutTxt(this.checkin, this.checkout);

    this.setData({
      rateRoom: this.rateRoom,
      checkinTxt: dateTxt.checkinTxt,
      checkoutTxt: dateTxt.checkoutTxt,
      days: dateTxt.days,
      currencyCode: this.currencyCode,
      rateTotal: this.rateTotal,
      rateCnyTotal: this.rateCnyTotal,
      areaCodesArray,
      cardsArray,
      acceptCardList: this.acceptCardList,
      note: this.note
    });
  },
  //超时跳转到酒店详情页
  // timeOut() {
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },
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

    //手机区号
    let phoneAreaCode = this.data.areaCodeList[formData.phoneAreaCode].code;
    if(phoneAreaCode == '-1'){
      if(formData.otherAreaCode){
        phoneAreaCode = formData.otherAreaCode;
      }else{
        this.showTipMsg('手机区号不为空');
        return;
      }
    }

    //获得手机号码并去除误输入的空格
    let phone = formData.phone.trim();

    //房间入住人数组
    let perRoomBookingPersonList = [];

    //匹配包含数字中文的正则
    let namePattern = /[0-9\u4E00-\u9FA5\uF900-\uFA2D]/;

    //获得备注信息
    let remark = '';

    if(this.arrivalTime){
      remark = remark + 'ArrivalTime:'+ this.data.arrivalTimeList[this.arrivalTime].replace('次日', 'Next Day ') +';' ;
    }
    if(this.demand){
      remark = remark + this.demand.join(',')+ ';';
    }
    if(this.other){
      remark = remark + this.other;
    }

    //获得信用卡类型
    let cardTypeIndex = formData.cardType;
    let cardType = this.data.acceptCardList[formData.cardType].code;

    //获得信用卡卡号
    let cardNumber = formData.cardNumber.replace(/[^0-9]/g,'');


    //获得信用卡有效期
    let cardExp = formData.cardExp;
    let cardExpYear = '';
    let cardExpMonth = '';
    if(cardExp !== '年份-月份'){
      cardExpYear = cardExp.substr(0,4);
      cardExpMonth = cardExp.substr(5,2);
    }

    //获得酒店集团卡
    let loyaltyCardNumber = '';

    if(this.data.hotelCard && this.data.hotelCard.no){
      loyaltyCardNumber = this.data.hotelCard.no.replace(/\s+/g,"");
    }


    //匹配信用卡号码正则
    let cardPattern = /^[0-9]*$/;

    //判断手机号
    if(!phone) {
      this.showTipMsg('手机号不为空');
      return;
    }


    //判断房间入住人姓名是否合法
    let roomIndex = parseInt(this.data.roomIndex);
    for(let i = 0; i < (roomIndex+1); i++) {
      let firstName = formData['firstName' + i];
      let lastName = formData['lastName' + i];
      let prefixTitleId = '';

      for(let v of this.data.roomNum[i].room[0].personType){
        v.isSelPerson ? prefixTitleId = v.prefixTitleId : '';
      }

      let tmpArr = [];
      tmpArr.push({firstName, lastName, prefixTitleId});

      let persons = this.data.roomNum[i].room.slice(1);

      perRoomBookingPersonList.push([...tmpArr, ...persons]);

      if(firstName == '' || lastName == '' ) {
        this.showTipMsg('入住人姓名不为空');
        return;
      }

      if(namePattern.test(firstName) || namePattern.test(lastName) || api.isEmoji(firstName) || api.isEmoji(lastName)) {
        this.showTipMsg('入住人姓名为英文/拼音');
        return;
      }
    }


    if(namePattern.test(this.other) || api.isEmoji(this.other)) {
      this.showTipMsg('其他需求请以英文填写');
      return;
    }

    if(!cardTypeIndex){
      this.showTipMsg('信用卡类型不为空');
      return;
    }

    if(!formData.cardNumber) {
      this.showTipMsg('信用卡卡号不为空');
      return;
    }

    if(cardNumber.length < 6) {
      this.showTipMsg('信用卡卡号不合法');
      return false;
    }

    if(cardExp === '年份-月份'){
      this.showTipMsg('信用卡有效期不为空');
      return;
    }


    let postData = {
      no: this.no,
      checkinDate: this.checkin,
      checkoutDate: this.checkout,
      base: this.base,
      rateNo: this.rateNo,
      perRoomBookingPersonList,
      phoneAreaCode,
      phone,
      cardType,
      cardNumber,
      cardExpYear,
      cardExpMonth,
      remark,
      loyaltyCardNumber
    };


    //防止重复提交
    this.setData({
      isSubmit : true,
      showSubmit: false
    });

    api.wxRequest({
      url: 'gdsHotel/booking',
      method: 'POST',
      data: postData,
      success: (res) => {
        if(res.data.code == 1){
          wx.redirectTo({
            url: '/pages/member/hotelOrderList/hotelOrderList'
          })
        }else{
          this.showTipMsg(res.data.msg, 2);
          this.showTipMsg('正在为您重新跳转到酒店页', 1);

          setTimeout(()=> {
            wx.redirectTo({
              url: '/pages/hotel/detail/detail?no='+no
            })
          },3000);
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

  roomTip(){
    let showModalData = {
      status:true,
      title:'入住人信息',
      content:[
        '1. 入住人姓名请与护照中拼音/英文保持一致；',
        '2. 每间客房或套房，默认2成人入住；',
        '3. 携带额外成人或儿童的费用，以酒店家庭政策或第三人费用为准；',
        '4. 单次预订最多选择2间；',
        '5. 每间房间至少填写一位入住人。'
      ],
      confirmText:'我已了解'
    };
    this.setData({
      showModalData
    })
  },
  cardTip(){
    let showModalData = {
      status:true,
      title:'信用卡信息',
      content:[
      '1. 您的信用卡信息将以加密形式提交给酒店，作为此次订房的付款或担保；',
      '2. 酒店会根据您的付款方式进行信用卡预授权或扣除房费。'
      ],
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
  addPersonBtn(e) {
    this.addPersonRoomIndex = e.currentTarget.dataset.roomIndex;
    this.person = {};
    let personType = this.data.personType;
    for(let i in this.data.personType){
      i == 0 ? personType[i].isSelPerson = true : personType[i].isSelPerson = false;
    }
    let childAge = this.data.childAge;

    for(let v of childAge){
      v.isSelAge = false;
    }

    this.setData({
      personType,
      isChild: false,
      isAddPerson: true,
      childAge
    })
  },
  closeBox(){
    this.setData({
      isAddPerson: false
    })
  },
  selPersonType(e) {
    let index = e.currentTarget.dataset.index;
    //房间默认必填项
    let required = e.currentTarget.dataset.required;

    if(required == '1'){
      //获得房间号
      let parentIndex = e.currentTarget.dataset.parentIndex;
      let roomNum = this.data.roomNum;
      let personType = roomNum[parentIndex].room[0].personType;

      for(let i in personType){
        i == index ? personType[i].isSelPerson = true : personType[i].isSelPerson = false;
      }
      this.setData({
        roomNum
      })
    }else{
      let isChild = this.data.isChild;
      let personType = this.data.personType;
      for(let i in personType){
        i == index ? personType[i].isSelPerson = true : personType[i].isSelPerson = false;
      }

      if(personType[index].prefixTitleId == '3' || personType[index].prefixTitleId == '4'){
         isChild = true;
       }else{
         isChild = false;
       }

       this.setData({
         personType,
         isChild
       })
    }
  },
  //获取lastName值
  lastName(e){
    this.person.lastName = e.detail.value;
  },
  //获取firstName值
  firstName(e){
    this.person.firstName = e.detail.value;
  },
  //获取儿童age值
  childAge(e){
    let childAge = this.data.childAge;
    let index = e.currentTarget.dataset.index;
    this.person.age = e.currentTarget.dataset.value;
    for(let i in childAge){
      i == index ? childAge[index].isSelAge = true : childAge[i].isSelAge = false;
    }

    this.setData({
      childAge
    })
  },
  //添加同住人
  addPersonConfirm(){
    //匹配包含中文的正则
    let namePattern = /[0-9\u4E00-\u9FA5\uF900-\uFA2D]/;

    if(!this.person.firstName || !this.person.lastName){
      this.showTipMsg('同住人姓名不为空');
      return;
    }

    if(namePattern.test(this.person.firstName) || namePattern.test(this.person.lastName) || api.isEmoji(this.person.firstName) || api.isEmoji(this.person.lastName)) {
      this.showTipMsg('同住人姓名为英文/拼音');
      return;
    }

    for(let v of this.data.personType){

      if(v.isSelPerson){
        this.person.sex = v.value;
        this.person.prefixTitleId  = v.prefixTitleId;
      }

      if(v.isSelPerson && (v.prefixTitleId == '3' || v.prefixTitleId == '4')){
        if(!this.person.age){
          this.showTipMsg('请选择儿童年龄');
          return;
        }
      }
    }

    let roomNum = this.data.roomNum;

    roomNum[this.addPersonRoomIndex].room.push(this.person);

    this.setData({
      roomNum,
      isAddPerson: false
    });

  },
  //删除同住人
  minusPerson(e){
    let roomIndex = e.currentTarget.dataset.roomIndex;
    let index = e.currentTarget.dataset.index;

    let roomNum = this.data.roomNum;
    roomNum[roomIndex].room.splice(index,1);

    this.setData({
      roomNum,
    });

  },
  //删除酒店会员集团卡
  minusCard(){
    let hotelCard = null;
    this.setData({
      hotelCard
    })
  },
  //格式化信用卡卡号
  formatCardNumber(e){
    let value = e.detail.value.replace(/(\d{4})(?=\d)/g,"$1"+" ");
    this.setData({
      formatCardNumber: value
    })
  },
  areaCodesPickerChange(e) {
    if(e.detail.value == '4'){
      this.setData({
        isOtherCode: true
      })
    }else {
      this.setData({
        isOtherCode: false
      })
    }

    this.setData({
      areaCodeIndex: e.detail.value
    })
  },
  roomChange(e)  {

    let roomNum = this.data.roomNum;
    let roomList = this.data.roomList;
    let index = e.currentTarget.dataset.index;
    for(let i in roomList){
      i == index ? roomList[i].isSel = true : roomList[i].isSel = false;
    }

    switch(index){
      case 0 :{
        roomNum = [
          {
            room:roomNum[0].room
          }
        ];
        break;
      };
      case 1 :{
        roomNum = [
          {
            tag:'房间1',
            room:roomNum[0].room
          },
          {
            tag:'房间2',
            room:[{
              personType: [{prefixTitleId:1, value:'先生', isSelPerson: true}, {prefixTitleId:2, value:'女士', isSelPerson: false}]
            }]
          }
        ];
        break;
      }
    };

    this.setData({
      roomNum,
      roomList,
      roomIndex:index,
      rateTotal: this.rateTotal*(index+1),
      rateCnyTotal: this.rateCnyTotal*(index+1)
    });

  },
  cardsPickerChange(e) {
    this.setData({
      cardIndex: e.detail.value,
      cardTypeStatus: false
    })
  },
  dateMonthChange(e) {
    this.setData({
      dateMonth: e.detail.value,
      cardExpStatus: false
    })
  },
  arrivalTimeChange(e) {
    this.arrivalTime = e.detail.value;
    this.setData({
      arrivalTimeIndex: e.detail.value
    })
  },
  switchChange() {
    this.setData({
      isChange: !this.data.isChange,
      isNote: !this.data.isNote
    })
  },
  noteCheckboxChange(e) {
    this.demand = e.detail.value;
  },
  noteTextArea(e) {
    this.other = e.detail.value;
    //匹配包含数字中文的正则
    let namePattern = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if(namePattern.test(e.detail.value) || api.isEmoji(e.detail.value)) {
      this.showTipMsg('其他需求请英文填写');
      return;
    }
  },
  selHotelCard() {
    wx.navigateTo({
      url:'/pages/member/hotelGroupCard/hotelGroupCard'
    })
  }
})
