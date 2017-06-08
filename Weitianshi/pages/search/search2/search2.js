// pages/network/search/search.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    empty: 0
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {

  },
  userDetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
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
    console.log(find)
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
            contacts_page: 1
          })
          console.log(contacts.length)
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
  // 下拉加载
  // loadMore: function () {
  //   var that = this;
  //   var contacts_page = this.data.contacts_page;
  //   var user_id = wx.getStorageSync('user_id');
  //   var page_end = this.data.page_end;
  //   if (page_end == false) {
  //     wx.showToast({
  //       title: 'loading...',
  //       icon: 'loading'
  //     })
  //     contacts_page++;
  //     that.setData({
  //       contacts_page: contacts_page
  //     })
  //     wx.request({
  //       url: url + '/api/user/getMyFollowList',
  //       data: {
  //         user_id: user_id,
  //         page: contacts_page,
  //         filter: {
  //           search: "",
  //           industry: [],
  //           stage: []
  //         }
  //       },
  //       method: 'POST',
  //       success: function (res) {
  //         console.log(res)
  //         var newPage = res.data.data;
  //         var contacts = that.data.contacts;
  //         console.log(newPage);
  //         var page_end = res.data.page_end;
  //         for (var i = 0; i < newPage.length; i++) {
  //           console.log(i)
  //           contacts.push(newPage[i])
  //         }
  //         that.setData({
  //           contacts: contacts,
  //           page_end: page_end,
  //         })
  //       },
  //       fail: function () {
  //         wx.showToast({
  //           title: '加载人脉失败',
  //         })
  //       },
  //     })
  //   } else {
  //     rqj.errorHide(that, "没有更多了", 3000)
  //   }
  // },

  // onUnload: function () {

  // },

  onPullDownRefresh: function () {
    // console.log("开启了下拉刷新");
    wx.stopPullDownRefresh()
  }
})