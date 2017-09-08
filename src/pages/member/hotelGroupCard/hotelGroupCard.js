const api = require('../../../utils/api.js');
const app = getApp();


Page({
  data: {
    loading:true,
    isAddCard: false,
    selType: null,
    isSubmit: false,
    showSubmit: true
  },
  onReady() {
    //获取支持的卡片
    api.wxRequest({
      url: 'vipHotelCard/typeList',
      success: (res) => {
        this.setData({
          cardType: res.data.res
        })
      }
    });


    this.getCardList();

  },

  // 获取我的酒店集团会员卡
  getCardList() {

    api.wxRequest({
      url: 'vipHotelCard/itemList',
      success: (res) => {
        let cardList = res.data.res;
        for(let v of cardList){
          v.no = v.no.replace(/(\d{4})(?=\d)/g,"$1"+" ");
        }

        this.setData({
          loading:false,
          cardList
        })
      }
    });

  },

  //显示添加模态框
  showModal() {
    let cardType = this.data.cardType;
    for(let v of cardType) {
      v.isSel = false;
    }
    this.setData({
      isAddCard: true,
      cardNumber: '',
      cardType,
      selType:''
    })
  },
  //关闭模态框
  hideModal(){
    this.setData({
      isAddCard: false
    })
  },
  //选择需要用的酒店会员卡
  selCard(e){
    let index = e.currentTarget.dataset.index;
    let hotelCard = this.data.cardList[index];

    app.pubsub.publish('selectCard', hotelCard);
    setTimeout(wx.navigateBack, 300);

  },
  //选择添加卡片的类型
  selCardType(e){
    let selType = this.data.selType;
    let cardType = this.data.cardType;
    for(let i in cardType){
      if(i == e.currentTarget.dataset.index){
        selType = cardType[i];
      }
    }

    this.setData({
      cardType,
      selType
    })
  },
  //格式化会员卡号
  formatCardNumber(e){
    let cardNumber = e.detail.value.replace(/(\d{4})(?=\d)/g,"$1"+" ");
    this.setData({
      cardNumber
    })
  },
  //显示提示信息模态框
  showTipMsg(msg) {
    this.setData({
      showToastData: {
        status:true,
        msg
      }
    });
    //1秒之后弹窗隐藏
    setTimeout(()=> {
      this.setData({
        'showToastData.status': false
      })
    }, 1000);
  },
  //获取用户输入的卡的名字
  cardName(e){
    let cardName = e.detail.value;
    this.setData({
      cardName
    })
  },
  //增加酒店会员卡片
  add(){
    let cardList = this.data.cardList;
    //判断选择的卡种
    let selType = this.data.selType;
    let cardName = selType.value;
    let cardNumber = this.data.cardNumber.replace(/\s+/g,"");

    if(!selType){
      this.showTipMsg('请选择会员卡类型');
      return;
    }

    //判断其他卡
    if(selType.id == '0'){
      if(!this.data.cardName){
        this.showTipMsg('请输入会员卡名称');
        return;
      }
      cardName = this.data.cardName;
    }

    //判断卡号是否为空
    if(!cardNumber){
      this.showTipMsg('请输入会员卡号');
      return;
    }

    //判断卡号是否合法

    //匹配卡号码正则
    let cardPattern = /^[0-9]*$/;

    if(!cardPattern.test(cardNumber)){
      this.showTipMsg('会员卡号不合法');
      return;
    }


    //防止重复提交
    this.setData({
      isSubmit : true,
      showSubmit: false
    });


    api.wxRequest({
      url: 'vipHotelCard/save',
      method:'POST',
      data:{
        id:0,
        no:cardNumber,
        typeId:selType.id,
        name:cardName
      },
      success: (res) => {
        if(res.data.code == 1){
          this.getCardList();
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

    this.setData({
      isAddCard: false
    })

  },
  //删除酒店会员卡
  delect(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确认删除这张酒店集团会员卡',
      success: (res) => {
        if (res.confirm) {
          api.wxRequest({
            url: 'vipHotelCard/delete/'+id,
            success: (res) => {
              if(res.data.code == 1){
                this.getCardList();
              }else{
                wx.showModal({
                  title: '删除卡片',
                  content: res.data.msg,
                  showCancel:false,
                  confirmText:'我知道了'
                })
              }
            }
          });
        }
      }
    })

  }

})
