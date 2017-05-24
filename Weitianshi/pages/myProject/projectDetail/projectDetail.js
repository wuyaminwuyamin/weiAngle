var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 1,//选项卡
    firstName: "代",
    id: "",
    page: 0,
    user_id: 0,
    industy_sort: [],
    bp_title: "",//bp名称
    ipo_release: "",//
    pro_company_name: "",//公司的名称
    pro_company_start_name: "",//
    pro_goodness: "",//项目亮点
    projectName: "",
    companyName: "",
    pro_company_start_time: "",//项目创建时间
    pro_name: "",//项目名称
    pro_source: "",//项目来源
    pro_intro: "",//项目介绍
    stock: 0,
    page_end: false,
    pro_status: {},//运营状态
    loadMorecheck: true//下拉加载更多判断
  },
  onLoad: function (options) {
    //  投资人数据
    var that = this;
    var id = options.id;
    var index = options.index;
    var user_id = wx.getStorageSync('user_id');
    var page = this.data.page;
    var avatarUrl = wx.getStorageSync('avatarUrl');
    var investors = wx.getStorageSync('investors') || '';//所有项目对应四位投资人
    that.setData({
      index: index,
      id: id,
      user_id: user_id,
      avatarUrl: avatarUrl,
      investor: investors[index],
      currentTab: options.currentTab
    });
    var investor = this.data.investor;
    console.log(investor)
    var industry_tag = [];
    var scale_tag = [];
    var stage_tag = [];
    var pro_goodness = "";
    if (investors != '') {
      for (var i = 0; i < investor.length; i++) {
        industry_tag.push(investor[i].industry_tag);
        scale_tag.push(investor[i].scale_tag);
        stage_tag.push(investor[i].stage_tag);
      }
      that.setData({
        industry_tag: industry_tag,
        stage_tag: stage_tag,
        scale_tag: scale_tag
      });
    }
    // console.log(investor)
    // console.log(industry_tag)
    //项目详情(不包括投资人)
    var id = wx.getStorageSync('user_id');
    if (user_id == id) {
      console.log(user_id);
      wx.request({
        url: url + '/api/project/showProjectDetail',
        data: {
          user_id: user_id,
          pro_id: this.data.id,
        },
        method: 'POST',
        success: function (res) {
          var project = res.data.data;
          // console.log(project);
          var user = res.data.user;
          var bp_title = project.bp_title;
          var pro_goodness = res.data.data.pro_goodness;
          var pro_source = project.pro_source;
          var pro_company_name = project.pro_company_name;
          var pro_company_start_time = project.pro_company_start_time;
          console.log(pro_company_start_time);
          var pro_name = project.pro_name;
          var pro_statusObject = project.pro_status;
          var pro_status = pro_statusObject.status_name;
          console.log(pro_status);
          var industy_sort = [];
          var firstName = user.user_name.substr(0, 1);
          that.setData({
            project: project,
            user: user,
            firstName: firstName
          });
          console.log(user)
          var pro_industry = project.pro_industry;
          for (var i = 0; i < pro_industry.length; i++) {
            industy_sort.push(pro_industry[i].industry_name)
          }
          that.setData({
            industy_sort: industy_sort,
            pro_goodness: pro_goodness
          });
        },
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    // console.log("开启了下拉刷新");
    wx.stopPullDownRefresh()
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
  //进入投资人用户详情
  detail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //触底加载
  loadMore: function () {
    var that = this;
    var page = this.data.page;
    var user_id = this.data.user_id;
    var pro_id = this.data.id;
    var page_end = this.data.page_end;
    var loadMorecheck = this.data.loadMorecheck;
    if (loadMorecheck) {
      console.log(
        user_id, pro_id
      )
      if (page_end == false) {
        wx.showToast({
          title: 'loading...',
          icon: 'loading'
        })
        page++;
        that.setData({
          page: page,
        });
        wx.request({
          url: url + '/api/project/getProjectMatchInvestors',
          data: {
            user_id: user_id,
            pro_id: pro_id,
            page: page
          },
          method: 'POST',
          success: function (res) {
            var investor2 = res.data.data;
            console.log(investor2)
            that.setData({
              investor2: investor2,
              page_end: res.data.page_end
            });
            wx.hideToast({
              title: 'loading...',
              icon: 'loading'
            })
          }
        })
      } else {
        rqj.errorHide(that, "没有更多了", 3000)
      }
    }
    this.setData({
      loadMorecheck: false
    });
  },
  //维护项目
  maintainProject() {
    var id = this.data.id;
    var user_id = this.data.user_id;
    wx.navigateTo({
      url: '/pages/myProject/editProject/editProject?pro_id=' + id + "&&user_id=" + user_id,
    })
  },
  //分享当前页面
  onShareAppMessage: function () {
    var pro_intro = this.data.project.pro_intro;
    return {
      title: pro_intro,
      path: '/pages/myProject/projectDetail/projectDetail?pro_id' + this.data.id
    }
  },
  //跳转到我的页面
  toMy: function () {
    wx.switchTab({
      url: '/pages/my/my/my',
    })
  }
});