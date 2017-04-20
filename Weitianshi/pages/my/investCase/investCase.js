var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    buttonOne: {
      text: "添加案例"
    }
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    this.setData({
      user_id: user_id
    })
    //载入我的个人信息
    if (user_id) {
      wx.request({
        url: url + '/api/user/getUserAllInfo',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          var invest_case = res.data.invest_case;
          wx.setStorageSync('invest_case', invest_case)
          that.setData({
            invest_case: invest_case,
          })
        },
        fail: function (res) {
          console.log(res)
        },
      })
    } else {
      app.noUserId()
    }
  },
  //编辑案例
  edit: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../investCaseEdit/investCaseEdit?index=' + index,
    })
  },
  // 按钮一号
  buttonOne: function () {
    wx.navigateTo({
      url: '../investCaseEdit/investCaseEdit',
    })
  }
})