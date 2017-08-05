var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
    type: 1 //我申請查看的項目
  },

  onLoad: function (options) {
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    // 申请查看我的项目
    wx.request({
      url: url_common + '/api/message/applyProjectToMe',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        console.log("申請查看我的")
        console.log(res)
        let contentList = res.data.data;
        let count1 = res.data.count;
        that.setData({
          count1 :　count1,
          contentList: contentList
        })
      }
    })
    // 我申请查看的项目
    wx.request({
      url: url_common + '/api/message/applyProjectList',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        console.log("我申请查看的项目")
        console.log(res)
        let count = res.data.count;
        let applyList = res.data.data;
        that.setData({
          count: count,
          applyList: applyList
        })
      }
    })
  },
  onShow: function () {
    let that = this;
        that.setData({
          requestCheck: true,
          requestCheckBoolean : true,
          currentPage: 1,
          otherCurrentPage: 1,
          page_end: false, 
          page_endBoolean : false,
          push_page: 1  
        })
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //我申请的项目加载更多
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    var request = {
      url: url_common + '/api/message/applyProjectList',
      data: {
        user_id: user_id,
        page: this.data.currentPage
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "applyList", that.data.applyList)
  },
  // 申请我的项目加载更多
  moreForApply:function(){
    //请求上拉加载接口所需要的参数
    var user_id = wx.getStorageSync("user_id");
    let that = this;
    let contentList = this.data.contentList;

    if (that.data.requestCheckBoolean) {
      if (user_id != '') {
        if (that.data.page_endBoolean == false) {
          wx.showToast({
            title: 'loading...',
            icon: 'loading'
          })
          that.data.push_page++;
          that.setData({
            otherCurrentPage: this.data.push_page,
            requestCheckBoolean: false
          });
          //请求加载数据
          wx.request({
           url: url_common + '/api/message/applyProjectToMe',
            data: {
              user_id: user_id,
              page: this.data.otherCurrentPage
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              var newPage = res.data.data;
              // console.log(newPage);
              var page_end = res.data.page_end;
              console.log(page_end)
              for (var i = 0; i < newPage.length; i++) {
                contentList.push(newPage[i])
              }
              that.setData({
                contentList: contentList,
                page_endBoolean: page_end,
                requestCheckBoolean: true
              })
            }
          })
        } else {
          rqj.errorHide(that, "没有更多了", 3000)
          that.setData({
            requestCheckBoolean: true
          });
        }
      }
    }
  },
  // 点击跳转
  projectDetail: function (e) {
    // 获取我自己的项目id
    var that = this;
    // 获取当前点击的项目id
    var id = e.currentTarget.dataset.project;
    console.log(id);
    // 判斷項目是不是自己的
    wx.request({
      url: url + '/api/project/projectIsMine',
      data: {
        project_id: id
      },
      method: 'POST',
      success: function (res) {
        var that = this;
        var userId = res.data.user_id;
        var user = wx.getStorageSync('user_id');
        if (userId == user) {
          wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + id + '&&index=' + 0
          })
        } else {
          wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + id,
          })
        }
      }
    })
  },
  // 点击同意
  btn:function(e){
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    let record_id = e.currentTarget.dataset.record;
    // status 1:同意  2:拒绝
    let status = e.currentTarget.dataset.status;
    if(status == 1){
      wx.request({
        url: url_common + '/api/message/handleApplyProjectMessage',
        data: {
          user_id : user_id,
          record_id: record_id,
          status: status
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status == 2000000){
            that.setData({
              
            })
          }
        }
      })
    }else if(status ==2){
      wx.request({
        url: url_common + '/api/message/handleApplyProjectMessage',
        data: {
          user_id : user_id,
          record_id: record_id,
          status: status
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
        }
      })
    }
    
  },
  // 点击拒绝
  refuseBtn:function(e){
    console.log(e)
  }
})