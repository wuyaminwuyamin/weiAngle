// pages/my/cardEdit/cardEdit.js
Page({
  data: {},
  onLoad: function (options) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    console.log(user_id)
    that.setData({
      user_id: "user_id",
    })

    //获取用户信息
    wx.request({
      url: 'https://dev.weitianshi.com.cn/api/user/getUserAllInfo',
      data: {
        user_id: "V0VznXa0"
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          user_info: res.data.user_info,
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  nameEdit: function () {
    var that=this;

  },
  mobileEdit:function(){

  },
  companyEdit:function(){

  },
  careerEdit:function(){

  },
  eMailEdit:function(){

  },
  describeEdit:function(){

  },
  save:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})