var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
// pages/message/message/message.js
Page({
  data: {
    item: [{
      message_name: '',
      count: ''
    }]
  },
  beAddedContacts: function (e) {
    wx.navigateTo({
      url: '/pages/message/beAddedContacts/beAddedContacts',
    })
  },
  onLoad: function (options) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/message/messageType',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        var dataLength = data.length - 1;
        var message_name = data[dataLength].message_name;
        var count = data[dataLength].count;
        data.forEach((x) => {
          message_name = x.message_name;
          count = x.count;
        })
        that.setData({
          message_name: message_name,
          count: count
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})