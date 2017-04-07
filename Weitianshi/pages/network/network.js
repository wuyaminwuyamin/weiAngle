var app = getApp();
var url = app.globalData.url;
Page({
  data: {

  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id')
    that.setData({
      user_id:user_id
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
    wx.navigateTo({
      url: '../my/cardEdit/cardEdit',
    })
  },
  bindUserInfo:function(){
    wx.navigateTo({
      url: '../myProject/personInfo/personInfo',
    })
  }
})