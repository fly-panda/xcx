function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

function trim(str)
{
  return str.replace(/(^\s*)|(\s*$)/g, '');
}


function login() {

  wx.login({
    success: function (res) {


      // js_code 取sessionkey openId
      wx.setStorageSync('jsCode', res.code);
      wx.getUserInfo({
        success: function (res) {
          const encryptedData = res.encryptedData;
          const iv = res.iv;
          wx.setStorageSync('encryptedData', encryptedData);
          wx.setStorageSync('iv', iv);
          const jsCode = wx.getStorageSync('jsCode');

          // 请求远程连接
          wx.request({
            url: 'https://www.badazhou.com/xiaochengxu/weixin/onLogin',
            data: {
              jsCode: jsCode,
              iv: iv,
              encryptedData: encryptedData
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {


              const data = JSON.parse(trim(res.data));

              if(data.res.code == 1) {
                const third_session = data.res.third_session;
                wx.removeStorageSync('third_session');
                wx.setStorageSync('third_session', third_session);
                console.log('认证成功!!!');
                return true;
              }else {
                return false;
              }


            }
          });
        }
      });
    }
  });
}


module.exports = {
  formatTime: formatTime,
  trim: trim,
  login: login
};
