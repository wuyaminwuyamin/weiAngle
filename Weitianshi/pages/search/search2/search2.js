// pages/network/search/search.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        empty: 0,
        currentPage: 1,
        searchCheck: true,
        page_end: false,
        contacts: [],
    },

    onLoad: function (options) {
        this.setData({
            currentPage: 1,
            searchCheck: true,
            page_end: false,
            contacts: []
        })
    },

    onShow: function () {

    },
    // 用户详情
    userDetail: function (e) {
        var id = e.currentTarget.dataset.id
        console.log(id);
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
        })
    },
    // 人脉搜索
    searchSth: function (e) {
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
            page_end: false,
            scroll: 0,
            contacts_page: 1
        })
        var find = e.detail.value;
        if (find === '') {
            that.setData({
                contacts: '',
                empty: 0
            })
        } else {
            wx.request({
                url: url + '/api/user/getMyFollowList',
                data: {
                    user_id: user_id,
                    page: 1,
                    filter: {
                        search: find,
                        industry: [],
                        stage: []
                    }
                },
                method: 'POST',
                success: function (res) {
                    var contacts = res.data.data;//所有的用户
                    var page_end = res.data.page_end;
                    that.setData({
                        contacts: contacts,
                        page_end: page_end,
                        currentPage: 1,
                        find: find
                    })
                    if (contacts.length !== 0) {
                        that.setData({
                            empty: 0
                        })
                    } else {
                        that.setData({
                            empty: 1
                        })
                    }
                }
            })
        }
    },
    // 取消
    searchEsc: function () {
        wx.switchTab({
            url: '/pages/contacts/contacts/contacts'
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
    //加载更多
    loadMore: function () {
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var currentPage = this.data.currentPage;
        var searchCheck = this.data.searchCheck;
        var page_end = this.data.page_end;
        var contacts = this.data.contacts;
        var find = this.data.find;
        if (searchCheck) {
            console.log(page_end)
            if (user_id != '') {
                if (page_end == false) {
                    console.log(user_id, currentPage, contacts)
                    currentPage++;
                    this.setData({
                        currentPage: currentPage,
                        searchCheck: false
                    });
                    wx.showLoading({
                        title: 'loading',
                    });
                    wx.request({
                        url: url + '/api/user/getMyFollowList',
                        data: {
                            user_id: user_id,
                            page: currentPage,
                            filter: {
                                search: find,
                                industry: [],
                                stage: []
                            }
                        },
                        method: 'POST',
                        success: function (res) {
                            wx.hideLoading();
                            console.log("newPage")
                            console.log(res);
                            var newPage = res.data.data;
                            var page_end = res.data.page_end;
                            newPage.forEach((x) => {
                                contacts.push(x)
                            })
                            that.setData({
                                contacts: contacts,
                                page_end: page_end,
                                searchCheck: true
                            })
                        },
                    })
                } else {
                    rqj.errorHide(that, "没有更多了", 3000)
                    that.setData({
                        searchCheck: true
                    })
                }
            }
        }
    },
    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    }
})