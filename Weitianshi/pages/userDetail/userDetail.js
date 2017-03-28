// pages/userDetail/userDetail.js
Page({
  data:{

  },
  onShow:function(options){
      var user_id=options.user_id;
      // 获取用户详情
      wx.request({
        url: 'https://www.weitianshi.com.cn/api/user/getUserAllInfo',
        data: {
          user_id:user_id
        },
        method: 'POST',
        success: function(res){
          console.log(res)
        },
        fail: function(res) {
          console.log(res)
        }
      })
  },
})