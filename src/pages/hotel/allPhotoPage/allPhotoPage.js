const api = require('../../../utils/api.js');



Page({
  imageArr: [],
  typeArr: [],

  onLoad: function (options) {
    const no = options.no;
    const hotelName = options.hotelName;

    // 动态设置标题
    wx.setNavigationBarTitle({
      title: hotelName
    });

    api.wxRequest({
      url: '/gdsHotel/detail/' + no,
      success: (res) => {
        this.imageArr = res.data.res.imageList;
        let imgCategory = [{name: 'ALL', checked: true, num: this.imageArr.length}];

        //图片类型名字去重
        for(let v of this.imageArr) {
          let isTypeExist = false;
          for(let vv of imgCategory) {
            if(v.type == vv.name) {
              isTypeExist = true;
              break;
            }
          }
          if(!isTypeExist && v.type) {
            imgCategory.push({name: v.type, checked: false});
          }
        }

        for(let i in imgCategory){
          if(i == 0){
            imgCategory[i].num = this.imageArr.length;
          }else{
            let typeArr = this.imageArr.filter(function(item){
              return item.type === imgCategory[i].name;
            });
            imgCategory[i].num = typeArr.length;
          }
        }
        this.setData({
          imageArr: this.imageArr,
          imgCategory
        });

        this.typeArr = this.imageArr;
      }
    });
  },
  selectImgCategory(e) {

    let index = e.currentTarget.dataset.index;
    let imgCategory =this.data.imgCategory;


    imgCategory.forEach( (v, i) => {
      v.checked = (i == index) ? true : false;
    });

    this.typeArr = [];

    if(imgCategory[index].name === 'ALL'){
      this.typeArr = this.imageArr;
    }else{
      this.typeArr = this.imageArr.filter(function(item){
        return item.type === imgCategory[index].name;
      });
    }
    this.setData({
      imageArr: this.typeArr,
      imgCategory
    })
  },
  preview(e) {

    let urls = [];
    this.typeArr.forEach( function(e, i) {
      urls.push(e.url);
    });

    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  }


})
