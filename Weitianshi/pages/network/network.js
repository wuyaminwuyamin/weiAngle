var app = getApp();
var url = app.globalData.url;
Page({
  data: {

  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id')
    that.setData({
      user_id: user_id
    })
    console.log(user_id)
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
  onShareAppMessage: function () {
    return {
      title: '我是对接',
      path: '/pages/resource/resource'
    }
  },
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
        var name = res.data.user_info.user_real_name;
        var mobile = res.data.user_info.user_real_mobile;
        var career = res.data.user_info.user_company_career;
        var company = res.data.user_info.user_company_name
        if (name != '' && mobile != '' && career != '' && company != '') {
          wx.navigateTo({
            url: '../my/sharePage/sharePage?user_id=' + user_id,
          })
        } else {
          wx.showModal({
            title: "提示",
            content: "请先完善个人信息",
            success: function () {
              wx.navigateTo({
                url: '../my/cardEdit/cardEdit',
              })
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
  bindUserInfo: function () {
    wx.navigateTo({
      url: '../myProject/personInfo/personInfo',
    })
  }
})