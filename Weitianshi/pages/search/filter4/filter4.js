// var rqj = require('../../Template/Template.js')
var app = getApp();
// 所属领域
var url = app.globalData.url;
var initialArr = {};//初始数组
Page({
  data: {
    industryData: [],
    industryId: [],
    industryName: [],
    stageData :[],
    stageId:[],
    stageName:[]
  },

  onLoad: function (options) {
    var that = this;
    var options = options;
    var industryData = wx.getStorageSync('industry');//获取所属领域的全部信息
    var stageData = wx.getStorageSync('stage');//获取轮次信息
    // console.log(stageData);
    var stageData_name = [];
    var stageData_id = [];
    var stage
    for (let i = 0; i < stageData.length; i++) {
      stageData_name.push(stageData[i].stage_name);
      console.log(stageData[i].stage_name);
      stageData_id.push(stageData[i].stage_id)
    }
    that.setData({
      industryData : industryData,
      stageData: stageData
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

  onPullDownRefresh: function () {
    // console.log("开启了下拉刷新");
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {

  },

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