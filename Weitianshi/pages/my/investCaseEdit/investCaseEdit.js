var app = getApp();
var url = app.globalData.url;
Page({
  data: {},
  onLoad: function (options) {

  },
  addCase: function () {
    var user_id = wx.getStorageSync('user_id');
    if (user_id) {
      wx.request({
        url: url + '/api/user/createUserProjectCase',
        data: {
          
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        },
      })
    }
  }
})