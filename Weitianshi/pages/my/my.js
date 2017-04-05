var app=getApp();
var url=app.globalData.url;
Page({
    data: {
        integrity: 30,
        resourcesIndex: 9.9,
        user: "",
        modal: 1,
    },
    onShow: function (options) {
        // console.log(options)
        var that = this
        var user_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: "user_id",
        })
        //我的个人信息
        wx.request({
            url: url+'/api/user/getUserAllInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var user = res.data.user_info;
                var invest = res.data.invest_info;
                var resource = res.data.resource_info;
                var project_info = res.data.project_info;
                var invest_case = res.data.invest_case;
                that.setData({
                    user: user,
                    invest: invest,
                    resource: resource,
                    project_info: project_info,
                    invest_case: invest_case
                })
            },
            fail: function (res) {
                console.log(res)
            },
        })
    },
    //编辑名片
    cardEdit: function () {
        wx.navigateTo({
            url: 'cardEdit/cardEdit',
        })
    },
    //寻找案源
    findProjectEdit: function () {
        wx.navigateTo({
            url: '../yourProject/yourProject',
        })
    },
    //资源对接
    resourceEnchangeEdit: function () {
        wx.navigateTo({
            url: '../resourceEnchange/resourceEnchange',
        })
    },
    //项目融资
    projectFinance: function () {
        wx.navigateTo({
            url: 'projectFinance/projectFinance',
        })
    },
    //投资案例
    investCase: function () {
        wx.navigateTo({
            url: 'investCase/investCase',
        })
    },

    //进入个人详情中转编辑页面
    resourcesIndex: function () {
        console.log(1)
        wx.navigateTo({
            url: 'myInfoEdit/myInfoEdit',
        })
    },
    //交换名片
    cardChange: function () {
        var modal = this.data.modal;
        modal = 0;
        this.setData({
            modal: modal
        })
    },
    //取消交换名片
    toastCancel: function () {
        var modal = this.data.modal;
        modal = 1;
        this.setData({
            modal: modal
        })
    },
    //去完善名片
    toastCertain: function () {
        wx.navigateTo({
            url: 'cardEdit/cardEdit',
        })
        var modal = this.data.modal;
        modal = 1;
        this.setData({
            modal: modal
        })
    }
});