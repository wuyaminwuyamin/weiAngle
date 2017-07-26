// pages/myProject/pushTo/pushTo.js
var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {

  },


  onLoad: function (options) {
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: "90ky197p",
        type:'push',
        page:1
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
  },
  onShow: function () {

  },
  pushTo: function () {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    //  错误信息提示
    rqj.errorHide(that, "最多可选择五项", 1000)
  },
  // 创建项目
  createProject: function () {
    wx.navigateTo({
      url: '/pages/myProject/publishProject/publishProject',
    })
  }
})