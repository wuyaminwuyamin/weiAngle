var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    page_end: false,//是否还有下一页
    currentPage: 1,
    requestCheck: true,
    count: 0
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: user_id,
      page_end: false,
      scroll: 0,
      currentPage: 1
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

    //向后台发送信息取消红点
    wx.request({
      url: url_common + '/api/message/setMessageToRead',
      data: {
        user_id: user_id,
        type_id: 3
      },
      method: "POST",
    })
  },
  // 添加人脉
  addNetWork: function (e) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    var followed_user_id = e.target.dataset.followedid;//当前用户的user_id
    var follow_status = e.currentTarget.dataset.follow_status;
    var index = e.target.dataset.index;
    console.log(e)
    var contacts = this.data.contacts
    console.log(user_id, followed_user_id);
    if (follow_status == 0) {
      //添加人脉接口
      wx.request({
        url: url + '/api/user/UserApplyFollowUser',
        data: {
          user_id : user_id,
          applied_user_id: followed_user_id
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.status_code == 2000000) {
            //将状态设为"未验证"
            contacts.forEach((x) => {
              if (x.user_id == followed_user_id) {
                x.follow_status = 2
              }
            })
            that.setData({
              contacts: contacts
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "错误提示",
            content: "添加人脉失败" + res
          })
        },
      })

    } else if (follow_status == 3) {
      // 同意申請接口
      wx.request({
        url: url + '/api/user/handleApplyFollowUser',
        data: {
          user_id: user_id,
          apply_user_id: apply_user_id
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          console.log("同意申請")
          that.setData({
            follow_status: 1
          })
        }
      })
    }
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
  //下拉加载
  loadMore: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    var requestCheck = this.data.requestCheck;
    var page_end = this.data.page_end;
    var contacts = this.data.contacts;
    if (requestCheck) {
      if (user_id != '') {
        //判断数据是不是已经全部显示了
        if (page_end == false) {
          currentPage++;
          this.setData({
            currentPage: currentPage,
            requestCheck: false
          });
          wx.showLoading({
            title: 'loading',
          })
          wx.request({
            url: url_common + '/api/message/viewCardMessage',
            data: {
              user_id: user_id,
              page: currentPage,
              type_id: 3
            },
            method: 'POST',
            success: function (res) {
              console.log("浏览了我的用户的数据")
              console.log(res)
              wx.hideLoading();
              var newPage = res.data.data
              var page_end = res.data.page_end;
              newPage.forEach((x) => {
                contacts.push(x)
              })
              that.setData({
                contacts: contacts,
                page_end: page_end,
                requestCheck: true
              })
            }
          })
        } else {
          rqj.errorHide(that, "没有更多了", that, 3000)
          that.setData({
            requestCheck: true
          })
        }
      }
    }
  },
})