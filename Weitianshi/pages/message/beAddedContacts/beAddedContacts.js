var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    notIntegrity: 0,//检查个人信息是否完整
    contacts_page: 1,//人脉列表的当前分页
    page_end: false,//是否还有下一页
    type_id: 0
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: user_id
    })
    wx.request({
      url: url_common + '/api/message/messageType',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        var data = res.data.data;
        var count = 0;
        var type_id =0;
        data.forEach((x) => {
         count = x.count;
         type_id = x.type_id;
        })
        that.setData({
          type_id: type_id,
          count: count
        })
        wx.request({
          url: url_common + '/api/message/cardMessage ',
          data: {
            user_id: user_id,
            type_id: type_id
          },
          method: 'POST',
          success: function (res) {
            var contacts = res.data.data;
            console.log(contacts)
            that.setData({
              contacts: contacts,
              contacts_page: 1
            })
          }
        })
      }
    })
  },
  addPerson:function(e){
    var user_id = wx.getStorageSync('user_id');
    var apply_user_id = e.currentTarget.dataset.id
    wx.request({
      url: url +'/api/user/handleApplyFollowUser',
      data:{
        user_id :user_id,
        apply_user_id: apply_user_id
      },
      method:'POST',
      success:function(){
        console.log("yes")
      }
    })
    
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
}) 