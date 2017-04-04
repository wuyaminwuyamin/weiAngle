// pages/network/network.js
Page({
  data: {
    user_id: "QrYqn6Zr",
    pro_id: "Er6ZGQr4",
    investor_arry: []
  },
  onShow: function () {
    var that = this;
    var user_id = this.data.user_id;
    var pro_id = this.data.pro_id;

    wx.request({
      url: 'https://dev.weitianshi.com.cn/api/user/getMyFollowList',
      data: {
        user_id: user_id,
        page: 1
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var investor2 = res.data.data;
        var investor_arry = that.data.investor_arry
        for (var i = 0; i < investor2.length; i++) {
          investor_arry.push(investor2[i])
        }
        that.setData({
          investor_arry: investor_arry,
          page_end: res.data.page_end
        });
        wx.hideToast({
          title: 'loading...',
          icon: 'loading'
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '我是对接',
      path: '/pages/resource/resource'
    }
  },
  myCard:function(){
    wx.navigateTo({
      url: '../my/cardEdit/cardEdit',
    })
  }
})