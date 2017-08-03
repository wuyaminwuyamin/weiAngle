var rqj = require('../../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {

  },

  onLoad: function (options) {
    console.log(options)
    let group_id = options.group_id;
    let user_id = wx.getStorageSync('user_id');
    let authenticate_id = options.authenticate_id;
    let that = this;
    let type = options.type;
    wx.request({
      url: url_common + '/api/user/getUserGroupByStatus',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        // 0:未认证1:待审核 2 审核通过 3审核未通过
        console.log(res)
        let status = res.data.status;
        let group_title = res.data.group.group_title;
        that.setData({
          status: status,
          group_title: group_title,
        })
      }
    })
    that.setData({
      type: type,
      authenticate_id: authenticate_id
    })
  },

  onShow: function () {

  },

  btnYes: function () {
    let type = this.data.type;
    let authenticate_id = this.data.authenticate_id;
    
    if (type) {
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateBack({
        delta: 3
      })
    }
 
  }
})