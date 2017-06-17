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
        var followed_user_id = this.data.followed_user_id;//当前被查看的用户id;
        let button_type = this.data.button_type;
        // button_type==0 互为好友或单项人脉,1.分享出去的页面,直接添加2.需要通过申请去添加人脉3.待处理状态
        console.log(button_type)

        //直接可添加好友的情况
        if (button_type == 1) {
            wx.setStorageSync("driectAdd", 1)
            //判断用户信息是否完整
            wx.request({
                url: url + '/api/user/checkUserInfo',
                data: {
                    user_id: user_id
                },
                method: 'POST',
                success: function (res) {
                    if (res.data.status_code == 2000000) {
                        var complete = res.data.is_complete;

                        if (complete == 1) {
                           //如果信息完整就直接添加人脉
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
                        } else if (complete == 0) {
                            //如果有user_id但信息不全则跳companyInfo页面
                            wx.navigateTo({
                                url: '/pages/register/companyInfo/companyInfo'
                            })
                        }
                    } else {
                        //如果没有user_id则跳personInfo
                        wx.navigateTo({
                            url: '/pages/register/personInfo/personInfo'
                        })
                    }
                },
            });
        } else if (button_type == 2) {
            //走正常申请流程
            wx.request({
                url: url + '/api/user/checkUserInfo',
                data: {
                    user_id: user_id
                },
                method: 'POST',
                success: function (res) {
                    if (res.data.status_code == 2000000) {
                        var complete = res.data.is_complete;

                        if (complete == 1) {
                            //如果信息完整就正常申请添加人脉
                            wx.request({
                                url: url + '/api/user/UserApplyFollowUser',
                                data: {
                                    user_id: user_id,
                                    applied_user_id: followed_user_id
                                },
                                method: 'POST',
                                success: function (res) {
                                    console.log("这里是正常申请添加人脉")
                                    console.log(res)
                                    that.setData({
                                        button_type: 0
                                    })
                                }
                            })
                        } else if (complete == 0) {
                            //如果有user_id但信息不全则跳companyInfo页面
                            wx.navigateTo({
                                url: '/pages/register/companyInfo/companyInfo'
                            })
                        }
                    } else {
                        //如果没有user_id则跳personInfo
                        wx.navigateTo({
                            url: '/pages/register/personInfo/personInfo'
                        })
                    }
                },
            });
        } else {
            showModal({
                title: "错误提示",
                content: "button_type为"+button_type
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