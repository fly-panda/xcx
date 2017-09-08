
const moment = require('moment.min.js');


/**
 * 获取处理后的checkin和checkout和days
 */
function getCheckinAndCheckoutTxt(checkin, checkout) {
  const checkinTxt = checkin.substr(5).replace('-', '月') + '日';
  const checkoutTxt = checkout.substr(5).replace('-', '月') + '日';

  const days = moment(checkout).diff(moment(checkin), 'days');
  const date = {
    checkinTxt:checkinTxt,
    checkoutTxt:checkoutTxt,
    days:days
  };
  return date;
}


/**
 * 传checkin和checkout则从checkin和checkout获取时间，
 * 末传将尝试从storage获取时间
 * 如果都末有时间，则根据系统时间
 */
function getCheckinAndCheckout(checkin = '', checkout = '') {

  const sysDate = moment().format('YYYY-MM-DD');

  // 如果没传checkin和checkout，尝试从缓存中获取。
  if (!checkin && !checkout) {
    const storageCheckinAndCheckout = wx.getStorageSync('hotelDate');
    if (storageCheckinAndCheckout) {
      checkin = storageCheckinAndCheckout.checkin;
      checkout = storageCheckinAndCheckout.checkout;
    }
  }

  if (checkin && checkout) {
    // 时间和系统时间进行对比
    const days = moment(checkin).diff(moment(sysDate), 'days');

    if (days < 0){
      checkin = sysDate;
      checkout = moment(sysDate).add(1, 'days').format('YYYY-MM-DD');
    }

  } else {
    // 系统时间和系统时间加1天
    checkin = sysDate;
    checkout = moment(sysDate).add(1, 'days').format('YYYY-MM-DD');
  }

  return {checkin, checkout};
}


module.exports = {
  getCheckinAndCheckoutTxt,
  getCheckinAndCheckout
};
