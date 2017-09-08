const api = require('../../../utils/api.js');
const app = getApp();



Page({
  brandList: {},
  brandStorageKey: 'hotelBrandList', // 本地存储品牌名称

  data:{
    showModalData:{status:false} //模态框状态默认隐藏
  },

  onLoad(options) {

    let id = options.id;

    api.wxRequest({
      url: '/gdsHotel/brandList/'+id,
      success:(res) => {
        this.brandList = res.data.res;

        let exclusiveList = this.brandList.filter((v)=> v.isExclusive == '1');

        let storageBrandList = wx.getStorageSync(this.brandStorageKey);

        if(storageBrandList) {
          this.brandList.map((v) => {
            for (let vv of storageBrandList){
              if(v.id == vv.id){
                v.checked = true;
              }
            }
          })
        }
        this.setData({
          brandList: this.brandList,
          exclusiveList
        });
      }
    });

  },
  onReady() {

    // 获取设备信息
    const sysInfo = wx.getSystemInfoSync();
    // 设置scrollViewHight
    this.setData({
      scrollViewHight: sysInfo.windowHeight - 111
    });
  },

  selectSingleBrand(e) {

    let index = e.currentTarget.dataset.index;
    this.brandList[index].checked = !this.brandList[index].checked;

    this.setData({
      brandList:this.brandList
    })
  },
  confirmBrands(e) {

    let selBrandList = this.brandList.filter((v) => {
      return v.checked;
    });

    wx.setStorageSync(this.brandStorageKey, selBrandList);


    app.pubsub.publish('selectBrandList', selBrandList);

    setTimeout(wx.navigateBack, 300);

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
  privilegeInfo() {
    let exclusiveListString = JSON.stringify(this.data.exclusiveList);
    wx.navigateTo({
      url:'/pages/hotel/privilegeList/privilegeList?exclusiveListString='+exclusiveListString
    })
  }
})
