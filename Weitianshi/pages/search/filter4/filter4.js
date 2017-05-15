// var rqj = require('../../../Template/Template.js')
var app = getApp();
// 所属领域
var url = app.globalData.url;
var initialArr = {};//初始数组
Page({
    data: {
    
  },

  onLoad: function (options) {
    var that = this;
    var current = options.current;//current=1:从my页面跳转过来的
    this.setData({
       current :current
    })
      wx.request({
        url: url + '/api/category/getResourceCategory',
        data: {},
        method: 'POST',
        success: function (res) {
          // console.log(res);
          var industryData = res.data.data;
          // console.log(industryData);
          var industryData_name =[];
          var industryData_id = [];
          for(let i =0 ; i <industryData.length;i++){
            industryData_name.push(industryData[i].resource_name);
            console.log(industryData[i].resource_name);
            industryData_id.push(industryData[i].resource_id)
          }
          console.log(industryData_name);
          console.log(industryData_id);
         
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