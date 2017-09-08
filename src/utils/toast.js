

function toast(data){

  let alertMsg =  data.alertMsg;
  let nullHouse = data.nullHouse;

  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  let toast = {alertMsg, nullHouse}

  curPage.setData({
    toast
  })

}


module.exports = {
  toast
}
