const api = require('../../../utils/api.js');

Page({

  data: {

  },
  onLoad: function (options) {
    let exclusiveList = JSON.parse(options.exclusiveListString);

    //请求品牌优待
    api.wxRequest({
      url: 'gdsHotel/exclusiveBrandList/',
      success: (res) => {
        let brandList = res.data.res;
        let privilegeList = [];
        exclusiveList.map((v) => {
          for (let vv of brandList){
            if(v.id == vv.id){
              privilegeList.push(vv);
            }
          }
        });
        this.setData({
          privilegeList
        })

      }
    });

  }
})
