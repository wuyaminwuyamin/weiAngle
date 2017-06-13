var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        contacts_page: 1,//当前分页
        page_end: false//是否还有下一页
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
        //向后台发送信息取消红点
        wx.request({
            url: url_common + '/api/message/setMessageToRead',
            data: {
                user_id: user_id,
                type_id: 3
            },
            method: "POST",
            success: function (res) {
                console.log(res)
            }
        })

        // 获取浏览我的用户信息
        if (user_id) {
            wx.request({
                url: url_common + '/api/message/viewCardMessage',
                data: {
                    user_id: user_id,
                    page: 1,
                    type_id: 3
                },
                method: 'POST',
                success: function (res) {
                    console.log("浏览了我的用户的数据")
                    console.log(res)
                    var contacts = res.data.data;
                    var count = res.data.count;
                    var page_end = res.data.page_end;
                    that.setData({
                        contacts: contacts,
                        page_end: page_end,
                        count: count
                    })
                }
            })
        }
    },
    // 添加人脉
    addNetWork: function (e) {
        var that = this;
        var user_id = wx.getStorageSync('user_id');//获取我的user_id
        var followed_user_id = e.detail.dataset.followedId;//当前用户的user_id
        var index=e.detail.dataset.index;
        var contacts=this.data.contacts;
        console.log(user_id, followed_user_id);

        //添加人脉接口
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
                    //将状态设为"未验证"
                    contacts[index].follow_status=3
                } 
            },
            fail: function (res) {
                wx.showModal({
                    title: "错误提示",
                    content: "添加人脉失败" + res
                })
            },
        })
    },
    // 用户详情
    userDetail: function (e) {
        var id = e.currentTarget.dataset.id
        console.log(id);
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
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
})