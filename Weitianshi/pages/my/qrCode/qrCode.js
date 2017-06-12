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
          url: url + '/api/wx/getCardQr',
          data: {
            'user_id':user_id,
            'path':'/pages/my/my/my',
            'width':430,
            'auto_color': false,
            'line_color': { "r": "0", "g": "0", "b": "0" }
          },
          method: 'POST',
          success: function (res) {
            var net = res.data;
            var access_token = net.qrcode;
            that.setData({
              access_token: access_token
            })
            var filPath = wx.setStorageSync('access_token', access_token );
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
  savePic: function (res) {
    
    var filePath = wx.getStorageSync('access_token');
    // 查看用户是否授权给小程序,可以保存图片
    wx.getSetting({
      success(res) {
        if (!res['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum()
            }
          })
        }
      }
    })
    wx.saveImageToPhotosAlbum({
      complete(res) {
        console.log("完成")
      }
    })

    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
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