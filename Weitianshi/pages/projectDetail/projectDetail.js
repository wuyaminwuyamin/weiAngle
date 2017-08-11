var rqj = require('../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    firstName: "代",
    id: "",
    page: 0,
    aa: [],
    bpName: "",
    projectName: "",
    companyName: "",
    stock: 0,
    load: 0,
    isChecked: true,
    textBeyond1: false,//项目亮点的全部和收起是否显示标志
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;//当前被查看用户的项目id
    var index = options.index;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id==view_id
    var page = this.data.page;
    var avatarUrl = wx.getStorageSync('avatarUrl');
    app.console(user_id, id)
    that.setData({
      index: index,
      id: id,
      user_id: user_id,
      avatarUrl: avatarUrl,
    });
    //项目详情(不包括投资人)
    wx.request({
      url: url_common + '/api/project/getProjectDetail',
      data: {
        user_id: user_id,
        project_id: this.data.id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        // button_type:0->待处理 1->不显示任何内容(1.自己看自己2.推送的3.已经申请通过的) 2->申请被拒绝 3->申请按钮
        var project = res.data.data;
        var user = res.data.user;
        var firstName = user.user_name.substr(0, 1) || '';
        var pro_industry = project.pro_industry;
        let industy_sort = [];
        let pro_goodness = project.pro_goodness;
        let button_type = res.data.button_type;
        // 项目介绍的标签
        for (var i = 0; i < pro_industry.length; i++) {
          industy_sort.push(pro_industry[i].industry_name)
        }
        that.setData({
          industy_sort: industy_sort,
        })
        if (pro_goodness.length > 50) {
          that.setData({
            textBeyond1: true
          })
        }
        var followed_user_id = res.data.user.user_id;
        that.setData({
          project: project,
          user: user,
          firstName: firstName,
          pro_industry: pro_industry,
          followed_user_id: followed_user_id,
          button_type: button_type
        });

        var is_mine = res.data.data.is_mine;
        //app.console(is_mine)
        if (is_mine == true) {
          //请求投资人详情
          wx.request({
            url: url_common + '/api/project/getProjectMatchInvestors',
            data: {
              user_id: user_id,
              project_id: that.data.id,
              page: page
            },
            method: 'POST',
            success: function (res) {
              app.console(res)
              var investor2 = res.data.data;
              app.console(investor2)
              that.setData({
                investor2: investor2
              });
              setTimeout(function () {
                that.setData({
                  load: 0
                })
              }, 1500)
            },
            fail: function () {
            },
          })
        }
      },
    })

  },
  onShow: function () {
    let user_id = wx.getStorageSync('user_id');
    let that = this;
    wx.request({
      url: url_common + '/api/user/getUserGroupByStatus',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        // 0:未认证1:待审核 2 审核通过 3审核未通过
        let status = res.data.status;
        that.setData({
          status: status
        })
        console.log(status)
      }
    })
  },
  // 用户详情
  userDetail: function (e) {
    app.console(e);
    var id = e.currentTarget.dataset.id
    app.console(id)
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    // app.console("开启了下拉刷新")
    wx.stopPullDownRefresh()
  },
  //分享当前页面
  onShareAppMessage: function () {
    var pro_intro = this.data.project.pro_intro;
    app.console(pro_intro)
    return {
      title: pro_intro,
      path: '/pages/projectDetail/projectDetail?id=' + this.data.id
    }
    app.console(data.project.pro_intro);
  },
  // 项目详情中的显示全部
  allBrightPoint: function () {
    this.setData({
      isChecked: false
    })
  },
  noBrightPoint: function () {
    this.setData({
      isChecked: true
    })
  },
  // 去认证
  toAccreditation: function () {
    console.log("去认证")
    console.log(this.data.status)
    let status = this.data.status;
   app.accreditation(status);
  },
  // 申请查看
  applyProject: function (options) {
    let id = options.currentTarget.dataset.id;
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    // app.applyProjectTo(id);
    app.applyProjectTo(that,id)
  }
})