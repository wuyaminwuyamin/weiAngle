Page({
    data: {
        integrity:30,
        resourcesIndex:9.9
    },
    onLoad: function () {
        var that = this
        var user_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
        })
        //我的个人信息
        wx.request({
            url: 'https://www.weitianshi.com.cn/api/project/showProjectDetail',
            data: {
                user_id: user_id,
                pro_id: "Er6ZGQr4",
                page:1
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var user = res.data.user;
                var firstName = user.user_name.substr(0, 1);
                that.setData({
                    user: user,
                    firstName: firstName
                });
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