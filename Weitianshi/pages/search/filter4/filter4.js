// var rqj = require('../../Template/Template.js')
var app = getApp();
// 所属领域
var url = app.globalData.url;
var initialArr = {};//初始数组
var save = true;//是否删除缓存
Page({
    data: {
      enchange: [],//接口给的标签
      checked: [],//已经选中的标签的值
      checkedId: [],//已经选中标签的id
      target: [],//接口给的标签
      t_checked: [],//已经选中的标签的值
      t_checkedId: [],//已经选中标签的id
      error: "0",
      error_text: "",
  },

  onLoad: function (options) {
    var that = this;
    var current = options.current;//current=1:从my页面跳转过来的
    this.setData({
      current: current
    })
      wx.request({
        url: url + '/api/category/getResourceCategory',
        data: {},
        method: 'POST',
        success: function (res) {
          console.log(res);
          var industryData = res.data.data;
          console.log(industryData);
          var industryData_name =[];
          var industryData_id = [];
          for(let i =0 ; i <industryData.length;i++){
            industryData_name.push(industryData[i].resource_name);
            industryData_id.push(industryData[i].resource_id)
          }
         
          // var industryScreen = res.data.
          // var res_find = resource_data.res_find;//寻求的资源
          // var res_give = resource_data.res_give; //可提供的资源
          // var describe = resource_data.res_desc;//具体描述
          // var enchange = res.data.data;//当前可提供资源的object
          // // console.log(enchange);
          // var target = res.data.data;//当前在寻求资源的object
          // var res_find_name = [];//寻求的资源名称和id
          // var res_find_id = []; //提供的名称和id
          // var res_give_name = [];//可提供的资源添加名称和id
          // var res_give_id = [];

          // if (res_find) { // 可寻求的资源
          //   // 遍历 可寻求资源的长度,遍历取出可提供的名字和id
          //   for (var i = 0; i < res_find.length; i++) {
          //     // 将取出的名字和id添加到对应的数组中
          //     res_find_name.push(res_find[i].resource_name);
          //     res_find_id.push(res_find[i].resource_id);
          //   }
          // }
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