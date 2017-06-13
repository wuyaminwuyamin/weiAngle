var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    notIntegrity: 0,//检查个人信息是否完整
    contacts_page: 1,//人脉列表的当前分页
    page_end: false//是否还有下一页
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: user_id,
      page_end: false,
      scroll: 0,
      contacts_page: 0
    })
    // 获取人脉库信息
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
          var contacts = res.data.data;//所有的用户
          console.log(contacts)
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
  addNetWork: function (options) {
    wx.request({
      url: url_common + '/api/message/viewCardMessage',
      data: {
        user_id: user_id,
        page: 1,
        type_id: 3
      },
      method: 'POST',
      success: function (res) {
        var contacts = res.data.data;//所有的用户
        console.log(contacts)
        var page_end = res.data.page_end;
        that.setData({
          contacts: contacts,
          page_end: page_end,
          contacts_page: 1
        })
      }
    })
    if (follow_status == 0) {
      console.log("正常添加"),
        wx.request({
          url: url + '/api/user/UserApplyFollowUser',
          data: {
            user_id: view_id,
            applied_user_id: followed_user_id
          },
          method: 'POST',
          success: function (res) {
            that.setData({
              condition: 2
            })
          }
        })
    } else if (follow_status == 1) {
      that.setData({
        condition: 1
      })
      console.log("单项人脉")
    } else if (follow_status == 2) {
      that.setData({
        condition: 1
      })
      console.log("互为人脉")
    } else if (follow_status == 3) {
      that.setData({
        condition: 2
      })
      console.log("待同意")
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