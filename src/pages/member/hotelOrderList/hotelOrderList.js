const api = require("../../../utils/api.js");



Page({
  currentPage: null, //请求默认第一页
  totalPageNum: null, //请求总页数
  perPageNum: null, //请求15条数据
  orderList: null, //订单列表
  data:{
    loading: false
  },
  onReady: function () {

    this.currentPage = 1;
    this.totalPageNum = null;
    this.perPageNum = 15;
    this.orderList = [];

    // 设置scroll-view高度
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollViewHight: res.windowHeight
        })
      }
    });

   this.getList();

  },

  getList() {
    this.setData({
      loading: true
    })
    // api
    api.wxRequest({
      url: 'orderGdsHotel/itemList',
      method: 'POST',
      data:{
        perPage:this.perPageNum,
        page: this.currentPage
      },
      success: (res) => {
        let sysOrderListData = res.data.res;

        this.totalPageNum = Math.ceil(sysOrderListData.total / this.perPageNum);

        this.orderList = this.orderList.concat(sysOrderListData.data);

        this.setData({
          orderList:this.orderList,
          loading: false
        });
      }
    });

  },

  onScrollLower(event) {

    if(this.currentPage < this.totalPageNum) {
      // show loading more

      this.currentPage++;
      console.log(this.currentPage);

      this.getList();

    } else {
      // no more end
    }

  },
  detailPage(e) {
    wx.navigateTo({
      url:'/pages/member/hotelOrderDetail/hotelOrderDetail?no=' +e.currentTarget.dataset.no
    })
  }

})
