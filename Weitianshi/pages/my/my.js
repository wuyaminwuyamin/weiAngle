Page({
    data: {
        integrity:30,
        resourcesIndex:9.9,
        user:""
    },
    onLoad: function () {
        var that = this
        var user_id = wx.getStorageSync('user_id');
        console.log(user_id)
        that.setData({
            user_id: user_id,
        })
        //我的个人信息
        wx.request({
          url: 'https://dev.weitianshi.com.cn/api/user/getUserAllInfo',
          data: {
              user_id:user_id
          },
          method: 'POST',
          success: function(res){
            console.log(res)
            var user=res.data.user_info;
            console.log(user)
            that.setData({
                user:user
            })
          },
          fail: function(res) {
            console.log(res)
          },
        })
    },
    //进入个人详情
    userInfo:function(){
        wx.navigateTo({
            url:"../userDetail/userDetail"
        })
    },
    //进入个人详情中转编辑页面
    resourcesIndex:function(){
        console.log(1)
        wx.navigateTo({
          url: 'myInfoEdit/myInfoEdit',
        })
    }
});