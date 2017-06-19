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

  loadMore: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    var searchCheck = this.data.searchCheck;
    var page_end = this.data.page_end;
    var contacts = this.data.contacts;
    if (searchCheck) {
      if (user_id != '') {
        if (page_end == false) {
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
              console.log("筛选内容");
              console.log(res)
              var page_end = res.data.page_end;
              var newPage = res.data.data;//新请求到的数据
              var search = that.data.search;//现在显示的数据
              console.log("触发刷新")
              console.log(search_page, page_end)
              console.log(res.data);
              newPage.forEach((x) => {
                search.push(x)
              })
              that.setData({
                search: search,
                searchCheck: true,
                page_end: page_end
              })
              wx.hideLoading()
            },
          })
        }
      } else {
        rqj.errorHide(that, "没有更多了", that, 3000)
        that.setData({
          searchCheck: true
        })
      }
    }
  },

  onPullDownRefresh: function () {
    // console.log("开启了下拉刷新");
    wx.stopPullDownRefresh()
  }
})