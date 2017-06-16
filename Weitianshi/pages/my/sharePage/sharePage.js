var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        user: "",
        followed_user_id: "",
    },
    onLoad: function (options) {
        var that = this;
        console.log(options);
        var followed_user_id = options.user_id;
        var share_id = options.share_id;
        that.setData({
            followed_user_id: followed_user_id,
            share_id: share_id
        })
        //登录态维护
        app.loginPage(function (user_id) {
            var view_id = user_id;
            wx.setStorageSync('user_id', user_id);
            //载入被分享者的个人信息
            wx.request({
                url: url + '/api/user/getUserAllInfo',
                data: {
                    share_id: share_id,
                    user_id: followed_user_id,
                    view_id: view_id,
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    var user = res.data.user_info;
                    var count = res.data.count;
                    var invest = res.data.invest_info;
                    var resource = res.data.resource_info;
                    var project_info = res.data.project_info;
                    var invest_case = res.data.invest_case;
                    var button_type = res.data.button_type;
                    console.log(button_type)
                    that.setData({
                        user: user,
                        invest: invest,
                        resource: resource,
                        project_info: project_info,
                        invest_case: invest_case,
                        button_type: button_type,
                        count: count
                    })

                    if (button_type == 0) {
                        console.log("是好友或者是我")
                    } else if (button_type == 1) {
                        console.log("我分享出去的名片")
                    } else if (button_type == 2) {
                        console.log("正常添加方式")
                    }
                    wx.setNavigationBarTitle({
                        title: res.data.user_info.user_real_name + "的投资名片",
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
            })
            // 如果用户已经注册过并信息完整,bindUser=1,否则bindUser=0
            if (user_id == 0) {
                that.setData({
                    bindUser: 0
                })
            } else {
                //检查用户信息是否完整
                wx.request({
                    url: url + '/api/user/checkUserInfo',
                    data: {
                        user_id: user_id
                    },
                    method: 'POST',
                    success(res) {
                        if (res.data.is_complete == 0) {
                            that.setData({
                                bindUser: 0
                            })
                        } else {
                            that.setData({
                                bindUser: 1
                            })
                        }
                    }
                })
            }
            // console.log("share_id", "user_id", "view_id")
            console.log(share_id, followed_user_id, view_id)
            //如果进入的是自己的名片里
            if (user_id == followed_user_id) {
                wx.switchTab({
                    url: '/pages/my/my/my',
                })
            }
            that.setData({
                user_id: user_id,
            })
        })
    },

    // 添加人脉
    addNetwork: function () {
        var that = this;
        var user_id = this.data.user_id;//我的id,查看者的id
        var followed_user_id = this.data.followed_user_id;//当前被查看的用户id
        var bindUser = this.data.bindUser;
        let button_type = this.data.button_type;
        console.log(button_type)
        if (bindUser == 0) {
            wx.showModal({
                title: "提示",
                content: "请先绑定个人信息",
                success: function (res) {
                    wx.setStorageSync('followed_user_id', followed_user_id);
                    if (res.confirm == true) {
                        wx.setStorageSync("driectAdd", 1)
                        app.infoJump()
                    }
                }
            })
        } else if (bindUser == 1) {
            //直接添加人脉的情况
            if (button_type == 1) {
                wx.request({
                    url: url + '/api/user/followUser',
                    data: {
                        user_id: user_id,
                        followed_user_id: followed_user_id
                    },
                    method: 'POST',
                    success: function (res) {
                        console.log("这里是直接添加人脉")
                        console.log(res)
                        that.setData({
                            button_type: 0
                        })
                    }
                })
                //需要走正常申请流程的情况
            } else if (button_type == 2) {
                wx.request({
                    url: url + '/api/user/UserApplyFollowUser',
                    data: {
                        user_id: user_id,
                        applied_user_id: followed_user_id
                    },
                    method: 'POST',
                    success: function (res) {
                        console.log("这里是走正常申请过程");
                        that.setData({
                            button_type: 3
                        })
                    }
                })
            }
        } else {
            showModal({
                title: "错误提示",
                content: "bindUser部分出问题了"
            })
        }
    },
    // 二维码分享按钮
    shareSth: function (e) {
        console.log(e)
        var QR_id = e.currentTarget.dataset.clickid;
        wx.setStorageSync('QR_id', QR_id)
        console.log(QR_id)
        wx.navigateTo({
            url: '/pages/my/qrCode/qrCode',
        })
    },

    //分享页面部分
    onShareAppMessage: function () {
        var id = this.data.followed_user_id;
        return app.sharePage(id)
    }
}); 