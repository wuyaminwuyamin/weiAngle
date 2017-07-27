var rqj = require('../../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    array: ['是','否']
  },

  onLoad: function (option) {
    let authenticate_id = option.authenticate_id;
    let group_id = option.group_id;
    let that  = this;
    // group_id 18:买方FA 19:卖方FA  6:投资人 3:创业者 8:其他
    that.setData({
      authenticate_id: authenticate_id,
      group_id: group_id
    })
  },

  onShow: function () {
    let user_id = wx.getStorageSync('user_id');
    let that =this;
    wx.request({
      url: url_common + '/api/user/getUserAllInfo',
      data: {
        share_id: 0,
        user_id: user_id,
        view_id: user_id,
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        let user_info = res.data.user_info;
        console.log(user_info.user_real_name);
        that.setData({
          user_info: user_info
        })
      }
   })
  },
  // 上传名片
  scanIDcard:function(){
    console.log("上传名片")
    let user_id = wx.getStorageSync('user_id');
    let group_id = this.data.group_id;
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: url_common + '/api/user/uploadCard', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user_id': user_id,
            'authenticate_id': authenticate_id
          },
          success: function (res) {
            var data = res.data
          }
        })
      }
    })
  },
  // 跳转投资领域
  toIndustry:function(){
    wx.navigateTo({
      url: '/pages/form/industry/industry',
    })
  },
  // 跳转投资轮次
  toScale:function(){
    wx.navigateTo({
      url: '/pages/form/scale/scale',
    })
  },
  // 跳转投资金额
  toStage:function(){
    wx.navigateTo({
      url: '/pages/form/stage/stage',
    })
  },
  // 跳转投资地区
  toArea1:function(){
    wx.navigateTo({
      url: '/pages/form/area1/area1',
    })
  },
  // 申请加入FA行业联盟
  bindFAService:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      bindFAService_index: e.detail.value
    })
  },
  addFAService:function(e){
    this.setData({
      addFAService_index: e.detail.value
    })
  },
  sass:function(e){
    this.setData({
      sass_index: e.detail.value
    })
  },
  partFA:function(e){
    this.setData({
      partFA_index: e.detail.value
    })
  },
  needFA:function(e){
    this.setData({
      needFA_index: e.detail.value
    })
  }

})