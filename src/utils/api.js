const apiURL = 'https://www.badazhou.com';

const wxRequest = function(param) {


  if(param.url.substr(0, 1) == '/') {
    param.url = param.url.substr(1);
  }

  const url = apiURL + '/' + param.url;

  if(!param.method) {
    param.method = 'GET';
  }

  const method = param.method.toUpperCase();

  let header = param.header || {};

  // 总是把accessToken作为header头传给服务器
  let accessToken = wx.getStorageSync('accessToken');

  if(accessToken) {
    header.Authorization = accessToken;
  }




  wx.request({
    url: url,
    method: method,
    data: param.data || {},
    header: header,
    success(res) {
      // 拦截一下末登录的请求，末登录，跳转到登录页
      if(res.data.code == -1001) {

        wx.navigateTo({
          url: '/pages/member/login/login'
        })

      } else {
        if (param.success) {
          param.success(res);
        }
      }




    },
    fail(res) {
      wx.getNetworkType({
        success: function(res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          if(res.networkType == 'none'){
            wx.showModal({
              title: '网络异常',
              content: '当前网络不可用，请检查网络连接'
            })
          }
        }
      })
      if (param.fail) {
        param.fail(res);
      }
    },
    complete(res) {
      if (param.complete) {
        param.complete(res);
      }
    }
  });
}

function isEmoji (string) {
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return regex.test(string);

}


module.exports = {
  wxRequest,
  isEmoji
};

