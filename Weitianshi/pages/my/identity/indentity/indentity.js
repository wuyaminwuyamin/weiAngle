var rqj = require('../../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    messageList: [
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-maifangFA@2x.png",
        identityName: "我是买方FA",
        indentityExplain: "帮助大企业寻找优质项目的人"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-maifangFA@2x.png",
        identityName: "我是卖方FA",
        indentityExplain: "帮助优秀项目融资陪跑的人"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-touzifang@2x.png",
        identityName: "我是投资方",
        indentityExplain: "拥有资金寻找优秀项目的人"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-chuangyezhe@2x.png",
        identityName: "我是创业者",
        indentityExplain: "正在做一件牛逼的事"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-qita@2x.png",
        identityName: "其他",
        indentityExplain: "政府、公益组织、高校等用户"
      }
    ]
  },

  onLoad: function (options) {
    let that = this;
    console.log("进来了")
    wx.request({
      url: url_common + '/api/category/getGroupIdentify',
      data: {
      },
      method: 'POST',
      success: function (res) {
        let groupIdentityList = res.data.data;
        var messageList = that.data.messageList;
        groupIdentityList.forEach((x, index) => {
         messageList[index].sort = x.sort;
         messageList[index].group_id = x.group_id;
        })
        that.setData({
          messageList: messageList
        })
        console.log(that.data.messageList)
      }
    })
  },

  onShow: function () {

  },
  toIdentityEdit: function (e) {
    wx.navigateTo({
      url: '/pages/my/identity/identityEdit/identityEdit',
    })
  }

})