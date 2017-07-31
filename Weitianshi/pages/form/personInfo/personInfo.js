var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {

  },

  onLoad: function (options) {
    console.log(options)
    let user_name = options.name;
    let user_mobile = options.mobile;
    let user_brand = options.brand;
    let user_company = options.company;
    let user_career = options.career;
    let user_email = options.email;
    let type = options.type;
    let that = this;
    that.setData({
      user_name: user_name,
      user_mobile: user_mobile,
      user_brand: user_brand,
      user_company: user_company,
      user_career: user_career,
      user_email: user_email,
      type: type
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  nameEdit: function (e) {
    let user_name = e.detail.value;
    console.log(user_name)
    this.setData({
      user_name: user_name
    })
  },
  save: function () {
    let user_id = wx.getStorageSync('user_id');
    let user_name = this.data.user_name;
    let type = this.data.type;
    // 姓名type:0 手机type:1 品牌type:2 公司type:3 职位type:4 邮箱type:5
    if (type == 0) {
      wx.navigateTo({
        url: '/pages/my/identity/identityEdit/identityEdit?user_name=' + user_name,
      })
    } else if (type == 1){
      wx.navigateTo({
        url: '/pages/my/identity/identityEdit/identityEdit?user_name=' + user_name,
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '/pages/my/identity/identityEdit/identityEdit?user_name=' + user_name,
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '/pages/my/identity/identityEdit/identityEdit?user_name=' + user_name,
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '/pages/my/identity/identityEdit/identityEdit?user_name=' + user_name,
      })
    } else if (type == 5) {
      wx.navigateTo({
        url: '/pages/my/identity/identityEdit/identityEdit?user_name=' + user_name,
      })
    }

  }
})