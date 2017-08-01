// pages/myProject/pushTo/pushTo.js
var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {

  },


  onLoad: function (options) {
    // pushed_user_id == 推送给谁
    let pushed_user_id = options.pushId;
    console.log(pushed_user_id)
    let that = this;
    that.setData({
      pushed_user_id: pushed_user_id
    })
   
  },
  onShow: function () {
    var that = this;
    app.initPage(that);
    let user_id = wx.getStorageSync('user_id');
    let pushed_user_id = this.data.pushed_user_id;
    that.setData({
      user_id: user_id,
      scroll: 0,
      requestCheck: true,
      currentPage: 1,
      page_end: false,
    })
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id,
        type: 'push',
        pushed_user_id: pushed_user_id,
        page: 1
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let dataList = res.data.data;
        let pushTimes = res.data.push_times;
        var page_end = res.data.page_end;
        dataList.forEach((x, index) => {
          dataList[index] = x;
          console.log(dataList[index].pro_intro)
        })
        // is_exclusive是否独家 1独家 2非独家 0其他
        that.setData({
          dataList: dataList,
          pushTimes: pushTimes,
          pushed_user_id: pushed_user_id
        })
      }
    })
  },
 
  // 创建项目
  createProject: function () {
    wx.navigateTo({
      url: '/pages/myProject/publishProject/publishProject',
    })
  },
  // 选中项目
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let checkBoxId = e.detail.value;
    let checkArray = [];
    checkArray.push(checkBoxId);
    console.log(checkArray)


    
  },
  pushTo: function () {
    let user_id = wx.getStorageSync('user_id');
    let pushed_user_id = this.data.pushed_user_id;
    let time = this.data.pushTimes;
    let that = this;
    wx.request({
      url: url + '/api/project/pushProjectToUser',
      data: {
        user_id: user_id,
        pushed_user_id: "90ky197p",
        pushed_project: ['xpEv2arq']
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.request({
          url: url_common + '/api/project/getMyProjectList',
          data: {
            user_id: user_id,
            type: 'push',
            pushed_user_id: pushed_user_id
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            let dataList = res.data.data;
            let pushTimes = res.data.push_times;
            that.setData({
              pushTimes: pushTimes
            })
            console.log(pushTimes)
          }
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
    })

    //  错误信息提示
    // rqj.errorHide(that, "最多可选择五项", 1000)
  },
  //上拉加载
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    let pushed_user_id = this.data.pushed_user_id;
    var request = {
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id,
        page: this.data.currentPage,
        type: 'push',
        pushed_user_id: pushed_user_id

      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "dataList", that.data.dataList)
  },
})