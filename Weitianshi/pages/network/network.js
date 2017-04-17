var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    notIntegrity: 0,
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: user_id
    })
    console.log(user_id)
    // 检查个人信息全不全
    if (user_id) {
      wx.request({
        url: url + '/api/user/checkUserInfo',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            notIntegrity: res.data.is_complete,
          })
        },
        fail: function (res) {
          wx.showToast({
            title: res
          })
        },
      })
    }
    // 获取人脉库信息
    if (user_id) {
      wx.request({
        url: url + '/api/user/getMyFollowList',
        data: {
          // user_id: "V0VznXa0",
          user_id: user_id,
          page: 1
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          var netWork = res.data.data
          that.setData({
            netWork: netWork
          })
        }
      })
    }
  },
  // 用户详情
  userDetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/userDetail/userDetail?id=' + id,
    })
  },
  //我的名片
  myCard: function () {
    var that = this;
    var user_id = this.data.user_id;
    //获取用户信息
    wx.request({
      url: url + '/api/user/getUserAllInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.status_code == 2000000) {
          wx.showModal({
            titel: "友情提示",
            content: "分享名片功能需要在个人页面点击去交换按钮实现",
            showCancel: false,
            success: function (res) {
              if (res.confirm == true) {
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }
            }
          })

        } else {
          wx.showModal({
            title: "友情提示",
            content: "交换名片之前,请先完善自己的名片",
            success: function (res) {
              if (res.confirm == true) {
                wx.navigateTo({
                  url: '../my/cardEdit/cardEdit',
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "对不起没有获取到您的个人信息"
        })
      },
    })
  },
  // 绑定名片
  bindUserInfo: function () {
    var notIntegrity = this.data.notIntegrity;
    var usr_id = this.data.user_id;
    console.log(notIntegrity, usr_id)
    wx.navigateTo({
      url: '../myProject/personInfo/personInfo',
    })
  },
  // 一键拨号
  telephone:function(e){
    var telephone=e.currentTarget.dataset.telephone;
    wx.makePhoneCall({
      phoneNumber: telephone,
    })
  }
})