var app=getApp();
var url=app.globalData.url;
Page({
    data: {
        integrity:30,
        resourcesIndex:9.9,
        user:""
    },
    onLoad: function (options) {
        var that = this
        var user_id = options.id;
        var view_id=wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
        })
        //我的个人信息
        wx.request({
          url: url+'/api/user/getUserAllInfo',
          data: {
              user_id:user_id,
              view_id:view_id,
              share_id:0,
          },
          method: 'POST',
          success: function(res){
            console.log(res)
            var user=res.data.user_info;
            var invest=res.data.invest_info;
            var resource=res.data.resource_info;
            var project_info=res.data.project_info;
            var invest_case=res.data.invest_case;
            console.log(invest_case)
            that.setData({
                user:user,
                invest:invest,
                resource:resource,
                project_info:project_info,
                invest_case:invest_case
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