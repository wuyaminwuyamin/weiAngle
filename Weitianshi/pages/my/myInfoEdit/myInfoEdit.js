// pages/my/myInfoEdit/myInfoEdit.js
Page({
  data: {
    baseInfo: 50
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  baseInfo: function () {
    wx.navigateTo({
      url: '../baseInfo/baseInfo',
    })
  },
  projectFinance: function () {
    wx.navigateTo({
      url: '../projectFinance/projectFinance',
    })
  },
  findProject: function () {
    wx.navigateTo({
      url: '../../yourProject/yourProject',
    })
  },
  resourceEnchange: function () {
    wx.navigateTo({
      url: '../../resourceEnchange/resourceEnchange',
    })
  },
  investCase:function(){
      wx.navigateTo({
      url: '../investCase/investCase',
    })
  }



})