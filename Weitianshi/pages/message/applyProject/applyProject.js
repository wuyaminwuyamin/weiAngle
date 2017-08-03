var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 1,//选项卡
  },

  onLoad: function (options) {
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    wx.request({
      url: url_common + '/api/message/applyProjectToMe',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
    wx.request({
      url: url_common + '/api/message/applyProjectList',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        let count = res.data.count;
        let applyList = res.data.data;
        console.log(res)
        applyList.forEach((x, index) => {
          applyList[index] = x;
        
        })
        that.setData({
          count: count,
          applyList: applyList
        })
      }
    })
  },
  onShow: function () {

  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

})