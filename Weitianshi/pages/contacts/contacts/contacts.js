var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        notIntegrity: 0,//检查个人信息是否完整
        contacts_page: 1,//人脉列表的当前分页
        page_end: false,//是否还有下一页
    },
    searchSth: function () {
        wx.navigateTo({
            url: '/pages/search/search2/search2',
        })
    },
    screenSth: function () {
        wx.navigateTo({
            url: '/pages/search/filter4/filter4',
        })
    },
    onShow: function () {
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
            page_end: false,
            scroll: 0,
            contacts_page: 1
        })
        // 检查个人信息全不全
        if (user_id) {
            wx.request({
                url: url + '/api/user/checkUserInfo',
                data: {
                    user_id: user_id
                },
                method: 'POST',
                success: function (res) {
                    that.setData({
                        notIntegrity: res.data.is_complete,
                    })
                },
                fail: function (res) {
                    wx.showToast({
                        title: res
                    })
                },
            })
        }
        // 获取人脉库信息
        if (user_id) {
            wx.request({
                url: url + '/api/user/getMyFollowList',
                data: {
                    // user_id: "V0VznXa0",
                    user_id: user_id,
                    page: 1
                },
                method: 'POST',
                success: function (res) {
                    console.log("我的人脉列表")
                    console.log(res)
                    var contacts = res.data.data;//所有的用户
                    var page_end = res.data.page_end;
                    that.setData({
                        contacts: contacts,
                        page_end: page_end,
                        contacts_page: 1
                    })
                }
            })
        }
    },
    // 用户详情=========================================================================================
    userDetail: function (e) {
        var id = e.currentTarget.dataset.id
        console.log(id);
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
        })
    },
    //我的名片
    myCard: function () {
        var that = this;
        var user_id = this.data.user_id;
        //获取用户信息
        wx.request({
            url: url + '/api/user/getUserAllInfo',
            data: {
                share_id: 0,
                user_id: user_id,
                view_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                if (res.data.status_code == 2000000) {
                    wx.showModal({
                        titel: "友情提示",
                        content: "分享名片功能需要在个人页面点击去交换按钮实现",
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm == true) {
                                wx.switchTab({
                                    url: '/pages/my/my/my',
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: "友情提示",
                        content: "交换名片之前,请先完善自己的名片",
                        success: function (res) {
                            if (res.confirm == true) {
                                wx.navigateTo({
                                    url: '/pages/my/cardEdit/cardEdit',
                                })
                            }
                        }
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: "对不起没有获取到您的个人信息"
                })
            },
        })
    },
    // 绑定名片
    bindUserInfo: function () {
        app.infoJump()
    },
    // 一键拨号
    telephone: function (e) {
        var telephone = e.currentTarget.dataset.telephone;
        wx.makePhoneCall({
            phoneNumber: telephone,
        })
    },
    // 下拉加载
    loadMore: function () {
        var that = this;
        var contacts_page = this.data.contacts_page;
        var user_id = wx.getStorageSync('user_id');
        var page_end = this.data.page_end;
        if (page_end == false) {
            wx.showToast({
                title: 'loading...',
                icon: 'loading'
            })
            contacts_page++;
            that.setData({
                contacts_page: contacts_page
            })
            wx.request({
                url: url + '/api/user/getMyFollowList',
                data: {
                    user_id: user_id,
                    page: contacts_page,
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    var newPage = res.data.data;
                    var contacts = that.data.contacts;
                    var page_end = res.data.page_end;
                    for (var i = 0; i < newPage.length; i++) {
                        contacts.push(newPage[i])
                    }
                    that.setData({
                        contacts: contacts,
                        page_end: page_end,
                    })
                },
                fail: function () {
                    wx.showToast({
                        title: '加载人脉失败',
                    })
                },
            })
        } else {
            rqj.errorHide(that, "没有更多了", 3000)
        }
    }
})