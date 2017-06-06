// pages/network/search/search.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad: function (options) {
  
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
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: user_id,
      page_end: false,
      scroll: 0,
      contacts_page: 1
    })
    wx.request({
      url: url + '/api/user/getMyFollowList',
      data: {
        user_id: user_id,
        page: 1
      },
      method: 'POST',
      success: function (res) {
        console.log("我的人脉列表")
        console.log(res)
        var contacts = res.data.data;//所有的用户
        var page_end = res.data.page_end;
        that.setData({
          contacts: contacts,
          page_end: page_end,
          contacts_page: 1
        })
      }
    })
  },
  searchEsc:function(){
    console.log(1)
    wx.switchTab({
      url: '/pages/contacts/contacts/contacts'
    })
  },
  onHide: function () {
  
  },

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