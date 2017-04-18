var rqj = require('../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    userInfo: {},
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
    financingPage: 1,
    investPage: 1,
    resourcePage: 1
  },
  //载入页面
  onShow: function () {
    var that = this;
    var currentTab = this.data.currentTab
    //融资需求获取数据
    wx.request({
      url: url + '/api/project/projectMarket',
      data: {},
      method: 'POST',
      success: function (res) {
        var financingNeed = res.data.data;
        that.setData({
          financingNeed: financingNeed
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })

    //投资需求获取数据
    wx.request({
      url: url + '/api/investors/investorMarket',
      data: {},
      method: 'POST',
      success: function (res) {
        console.log(res)
        var investNeed = res.data.data;
        that.setData({
          investNeed: investNeed
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
    //资源需求获取数据
    wx.request({
      url: url + '/api/resource/resourceMarket',
      data: {},
      method: 'POST',
      success: function (res) {
        var resourceNeed = res.data.data;
        that.setData({
          resourceNeed: resourceNeed
        })
      },
      fail: function (res) {
        console.log(res)
      },
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
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  // 跳转项目详情(融资需求和投资需求)
  projectDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../yourProject/yourDetail?id=' + id
    })
  },
  // 跳转人物详情
  userDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + id
    })
  },
  // 融资需求触底刷新
  financingNeed: function () {
    var that = this;
    var financingPage = this.data.financingPage;
    financingPage++;
    this.setData({
      financingPage: financingPage
    });
    wx.request({
      url: url + '/api/project/projectMarket',
      data: {
        page: financingPage
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var new_data = res.data.data;
        if (new_data != '') {
          wx.showToast({
            title: 'loading...',
            icon: 'loading'
          })
          var financingNeed = that.data.financingNeed;
          for (var i = 0; i < new_data.length; i++) {
            financingNeed.push(new_data[i])
          }
          that.setData({
            financingNeed: financingNeed
          })
        } else {
          rqj.errorHide(that, '没有更多了', 3000)
        }
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  // 投资需求触底刷新
  investNeed: function () {
    var that = this;
    var investPage = this.data.investPage;
    investPage++;
    this.setData({
      investPage: investPage
    });
    wx.request({
      url: url + '/api/investors/investorMarket',
      data: {
        page: investPage
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var new_data = res.data.data;
        if (new_data != '') {
          wx.showToast({
            title: 'loading...',
            icon: 'loading'
          })
          var investNeed = that.data.investNeed;
          for (var i = 0; i < new_data.length; i++) {
            investNeed.push(new_data[i])
          }
          that.setData({
            investNeed: investNeed
          })
        } else {
          rqj.errorHide(that, '没有更多了', 3000)
        }
      },
      fail: function (res) {
        console.log(res)
      },
    })

  },
   // 资源需求触底刷新
  resourceNeed: function () {
    var that = this;
    var resourcePage = this.data.resourcePage;
    resourcePage++;
    this.setData({
      resourcePage: resourcePage
    });
    wx.request({
      url: url + '/api/resource/resourceMarket',
      data: {
        page: resourcePage
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var new_data = res.data.data;
        if (new_data != '') {
          wx.showToast({
            title: 'loading...',
            icon: 'loading'
          })
          var resourceNeed = that.data.resourceNeed;
          for (var i = 0; i < new_data.length; i++) {
            resourceNeed.push(new_data[i])
          }
          that.setData({
            resourceNeed: resourceNeed
          })
        } else {
          rqj.errorHide(that, '没有更多了', 3000)
        }
      },
      fail: function (res) {
        console.log(res)
      },
    })

  },
  // 返回对接页面
  backToResource: function () {
    wx.switchTab({
      url: '../resource/resource',
    })
  }
});