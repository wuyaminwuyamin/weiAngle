var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
Page({
    data: {
        user: "",
        followed_user_id: "",
    },
    onLoad: function (options) {
        var that = this;
        var followed_user_id = options.user_id;
        that.setData({
            followed_user_id: followed_user_id,
        })
        //登录态维护
        app.loginPage(function (user_id) {
            var view_id = user_id;
            wx.setStorageSync('user_id', user_id);
            //载入被分享者的个人信息
            wx.request({
                url: url + '/api/user/getUserAllInfo',
                data: {
                    share_id: followed_user_id,
                    user_id: followed_user_id,
                    view_id: view_id,
                },
                method: 'POST',
                success: function (res) {
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
                    wx.setNavigationBarTitle({
                        title: res.data.user_info.user_real_name + "的投资名片",
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
            })
            // 判断是否绑定过用户
            if (user_id == 0) {
                that.setData({
                    bindUser: 0
                })
            } else {
                that.setData({
                    bindUser: 1
                })
            }
            // console.log("share_id", "user_id", "view_id")
            console.log(followed_user_id, followed_user_id, view_id)
            //如果进入的是自己的名片里
            if (user_id == followed_user_id) {
                wx.setNavigationBarTitle({
                    title: res.data.user_info.user_real_name + "的投资名片",
                })
                wx.switchTab({
                    url: '/pages/my/my/my',
                })
            }
            that.setData({
                user_id: user_id,
            })
        })
    },
    //载入分享者的个人信息 
    getSharedInfo: function (share_id, user_id, view_id) {
        wx.request({
            url: url + '/api/user/getUserAllInfo',
            data: {
                share_id: share_id,
                user_id: user_id,
                view_id: view_id,
            },
            method: 'POST',
            success: function (res) {
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
    // 添加人脉
    addNetwork: function () {
        var user_id = this.data.user_id;
        var followed_user_id = this.data.followed_user_id;
        var bindUser = this.data.bindUser;

        if (bindUser == 0) {
            wx.showModal({
                title: "提示",
                content: "请先绑定个人信息",
                success: function (res) {
                    wx.setStorageSync('followed_user_id', followed_user_id);
                    if (res.confirm == true) {
                        wx.navigateTo({
                            url: '/pages/register/personInfo/personInfo'
                        })
                    }
                }
            })
        } else if (bindUser == 1) {
            wx.request({
                url: url + '/api/user/followUser',
                data: {
                    follow_user_id: user_id,
                    followed_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    if (res.data.status_code == 2000000) {
                        wx.showModal({
                            title: "提示",
                            content: "添加人脉成功",
                            showCancel: false,
                            confirmText: "到人脉库",
                            success: function (res) {
                                wx.switchTab({
                                    url: '/pages/contacts/contacts/contacts',
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: "您已经添加过此人脉",
                            showCancel: false,
                            confirmText: "到人脉库",
                            success: function () {
                                wx.switchTab({
                                    url: '/pages/contacts/contacts/contacts',
                                })
                            }
                        })
                    }
                },
                fail: function (res) {
                    wx.showModal({
                        title: "错误提示",
                        content: "添加人脉失败" + res
                    })
                },
            })
        } else {
            showModal({
                title: "错误提示",
                content: "bindUser部分出问题了"
            })
        }
    },
    //分享页面部分
    onShareAppMessage: function () {
        var id = this.data.followed_user_id;
        var shareId=this.data.view_id; 
        return app.sharePage(shareId,id)
    }
}); 