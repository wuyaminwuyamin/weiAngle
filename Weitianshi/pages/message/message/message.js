var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
// pages/message/message/message.js
Page({
    data: {
        messageList: [
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            }
        ]
    },
    onShow:function(){
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var messageList = this.data.messageList;
        wx.request({
            url: url_common + '/api/message/messageType',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var data = res.data.data;
                data.forEach((x, index) => {
                    messageList[index].message_name = x.message_name;
                    if(x.count){
                        messageList[index].count = x.count
                    }
                })
                that.setData({
                    messageList: messageList
                })
            }
        })
    },

    //跳转到人脉申请页面
    beAddedContacts: function (e) {
        wx.navigateTo({
            url: '/pages/message/beAddedContacts/beAddedContacts',
        })
    },
})