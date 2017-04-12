var app = getApp();
var url = app.globalData.url;
Page({
  data: {},
  onLoad: function (options) {

  },
  case_name: function (e) {
    var that = this;
    var case_name = e.detail.value;
    that.setData({
      case_name: case_name
    })
  },
  case_money: function (e) {
    var that = this;
    var case_money = e.detail.value;
    that.setData({
      case_money: case_money
    })
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
  },
})