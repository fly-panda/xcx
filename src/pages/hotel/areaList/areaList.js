const api = require('../../../utils/api.js');
const app = getApp();


Page({
  //热门城市默认加载第一项
  index: 0,
  hotAllCityList: [],
  hotCityList: {},
  hotArea: [],

  data: {
    hotCityListShow: true,
    keywordRelatedShow: false,
    keywordRelatedHeight: 0
  },

  onReady() {
    this.index = 0;
    this.hotCityList = {};
    this.hotArea = [];

    api.wxRequest({
      url: 'gdsHotel/topCityList',
      success: (res) => {

        this.hotAllCityList = res.data.res;
        this.hotCityList = this.hotAllCityList[this.index];

        for(let i in this.hotAllCityList){
          let area = i == 0 ? {typeName: this.hotAllCityList[i].typeName,selected: true} : {typeName: this.hotAllCityList[i].typeName,selected: false};
          this.hotArea.push(area);
        }
        this.setData({
          hotCityList:this.hotCityList,
          hotArea: this.hotArea
        });
      }
    });


    wx.getSystemInfo({
      success: (res) => {
        let keywordRelatedHeight = (res.windowHeight -55);
        this.setData({
          keywordRelatedHeight: keywordRelatedHeight
        })
      }
    })
  },
  selectSearchTxt(e) {

    if(e.detail.value != ""){
      this.setData({
        keywordRelatedShow: true,
        hotCityListShow: false
      });

      api.wxRequest({
        url: 'gdsHotel/autoCompleteCityList?keyword='+e.detail.value,
        success: (res) => {
          this.setData({
            areaList:res.data.res
          });
        }
      })
    }else{
      this.setData({
        hotCityListShow: true,
        keywordRelatedShow: false
      });

    }
  },

  selectArea(e) {

    wx.setStorageSync('hotelArea',e.currentTarget.dataset.area );

    app.pubsub.publish('selectArea', e.currentTarget.dataset.area);
    setTimeout(wx.navigateBack, 300);
  },

  relateArea(e){
    this.index = e.currentTarget.dataset.index;
    for(let i in this.hotArea){
      i == this.index ? this.hotArea[i].selected = true : this.hotArea[i].selected = false ;
    }
    this.hotCityList = this.hotAllCityList[this.index];
    this.setData({
      hotArea: this.hotArea,
      hotCityList: this.hotCityList
    })
  }

})
