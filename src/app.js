const pubsub = require('./utils/pubsub.min.js');

App({

  pubsub: pubsub,

  globalData: {
    hotelDefaultArea: {id: '223', name: 'Singapore', nameCn: '新加坡'},
    telNumber:'4000882020'
  }

});
