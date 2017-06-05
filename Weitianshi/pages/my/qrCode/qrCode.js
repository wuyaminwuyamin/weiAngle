var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    dataUrl :""
  },
  onShow: function () {
    var that = this
    app.loginPage(function (user_id) {
      console.log("这里是cb函数")
      that.setData({
        user_id: user_id
      })
      //分享至群打点准备
      wx.showShareMenu({
        withShareTicket: true,
      })
      if (user_id != 0) {
        //载入我的个人信息
        wx.request({
          url: url + '/api/user/getUserAllInfo',
          data: {
            share_id: 0,
            user_id: user_id,
            view_id: user_id,
          },
          method: 'POST',
          success: function (res) {
            console.log("我的getUserAllInfo信息")
            console.log(res);
            var user = res.data.user_info;
            var invest = res.data.invest_info;
            var user_name = res.data.user_info.user_real_name;
            //设置缓存==========
            wx.setStorage({
              key: 'resource_data',
              data: res.data.resource_info
            })

            wx.setNavigationBarTitle({
              title: user_name + "的投资名片",
            })
            that.setData({
              user: user,
              invest: invest
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
        // 获取二维码接口
        wx.request({
          url: url + '/api/wx/getQrAccessToken',
          data: {
          },
          method: 'POST',
          success: function (res) {
            var access_token = res.data.access_token;
            console.log(access_token)
            wx.request({
              url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + access_token,
              data: {
                'path': "/pages/my/my/my",
                'width': 430,
                auto_color: false,
                line_color: { "r": "0", "g": "0", "b": "0" }
              },
              method: 'POST',
              success: function (res) {
               var img = res
                console.log(1)
                var dataUrl = res.data;
                console.log(dataUrl);
              },
            })

          },
          fail: function (res) {
            console.log(res)
          }
        })
      } else {
        app.noUserId()
      }
    })
  },
  sharePic: function () {
    console.log("1")
  },
  savePic: function () {
    console.log(2)
    wx.saveImageToPhotosAlbum({
      success(res) {
        console.log("成功")
      }
    })
  },
  //分享页面
  onShareAppMessage: function () {
    var id = wx.getStorageSync('user_id');
    return app.sharePage(id)
  },

  //取消分享
  cancelShare: function () {
    this.setData({
      modal: 0
    })
  },

})