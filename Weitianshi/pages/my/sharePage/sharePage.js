var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    user: "",
    followed_user_id: "",
    share_id:""
  },
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var followed_user_id = options.user_id;
    var share_id = options.share_id;
    that.setData({
      followed_user_id: followed_user_id,
      share_id:0
    })
    //登录态维护
    app.loginPage(function (user_id) {
      var view_id = user_id;//查看者的id
      wx.setStorageSync('user_id', user_id);
      //载入被分享者的个人信息
      wx.request({
        url: url + '/api/user/getUserAllInfo',
        data: {
          share_id: share_id,//分享者id
          user_id: followed_user_id,//被分享者id
          view_id: view_id,//查看者的id
        },
        method: 'POST',
        success: function (res) {
          var user = res.data.user_info;
          var invest = res.data.invest_info;
          var resource = res.data.resource_info;
          var project_info = res.data.project_info;
          var invest_case = res.data.invest_case;
          var button_type = res.data.button_type;
          console.log(button_type)
          that.setData({
            user: user,
            invest: invest,
            resource: resource,
            project_info: project_info,
            invest_case: invest_case,
            button_type: button_type
          })

          if (button_type == 0) {
            console.log("是好友或者是我")
          } else if (button_type == 1) {
            console.log("我分享出去的名片")
          } else if (button_type == 2) {
            console.log("正常添加方式")
          }
          wx.setNavigationBarTitle({
            title: res.data.user_info.user_real_name + "的投资名片",
          })
        },
        fail: function (res) {
          console.log(res)
        },
      })
      // 判断是否绑定过用户
      if (user_id == 0) {
        that.setData({
          bindUser: 0
        })
      } else {
        that.setData({
          bindUser: 1
        })
      }
      console.log(share_id, followed_user_id, view_id)
      //如果进入的是自己的名片里
      if (user_id == followed_user_id) {
        wx.switchTab({
          url: '/pages/my/my/my',
        })
      }
      that.setData({
        user_id: user_id,
      })
    })
  },
  
  // 添加人脉
  addNetwork: function () {
    var user_id = this.data.user_id;//我的id,查看者的id
    var followed_user_id = this.data.followed_user_id;//当前被查看的用户id
    var bindUser = this.data.bindUser;
    let button_type = this.data.button_type;
    console.log(button_type)
    if (bindUser == 0) {
      wx.showModal({
        title: "提示",
        content: "请先绑定个人信息",
        success: function (res) {
          wx.setStorageSync('followed_user_id', followed_user_id);
          if (res.confirm == true) {
            wx.navigateTo({
              url: '/pages/register/personInfo/personInfo'
            })
          }
        }
      })
    } else if (bindUser == 1) {
      console.log(followed_user_id)
      if (button_type == 1) {
        wx.request({
          url: url + '/api/user/followUser',
          data: {
            follow_user_id: user_id,
            followed_user_id: followed_user_id
          },
          method: 'POST',
          success: function (res) {
            // console.log("button_type=1")
          }
        })
      } else if (button_type == 2) {
        wx.request({
          url: url + '/api/user/UserApplyFollowUser',
          data: {
            user_id: followed_user_id,
            applied_user_id: user_id
          },
          method: 'POST',
          success: function () {
            console.log("button_type=2")
          }
        })
      }
    } else {
      showModal({
        title: "错误提示",
        content: "bindUser部分出问题了"
      })
    }
  }
  ,
  //分享页面部分
  onShareAppMessage: function () {
    var id = this.data.followed_user_id;
    return app.sharePage(id)
  }
}); 