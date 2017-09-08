const app = getApp();
const depositCard = require('../../../utils/depositCard.js');

Page({
  data: {
    cardList:depositCard.cardList
  },
  selCard(e) {
    let bankCard = this.data.cardList[e.currentTarget.dataset.index];

    app.pubsub.publish('selectCard', bankCard);
    setTimeout(wx.navigateBack, 300);
  }
})
