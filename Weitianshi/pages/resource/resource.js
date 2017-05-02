var rqj = require('../Template/Template.js')
var app = getApp()
var url = app.globalData.url
var num = 0;
Page({
  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
    bind_mobile: 0,//是否已存有个人信息
    myProject: "",//项目融资数据的字段 
    yourProject: "",//寻找项目数据的字段
    res_match: "",//资源对接数据的字段
    investor_page: 1,//投资人分页
    resource_page: 1,//资源分页
    investor_page_end: false,//投资人数据是否完结
    resource_page_end: false,//资源数据是否完结
    hasPublic: 0,//是否发布过投资需求
    hasPublic2: 0,//是否发布过资源需求
    investText: {
      text1: "发布投资需求",
      text2: "快速发布,精准对接优质项目",
      text3: "我的投资需求",
      text4: "投资领域"
    },//投资按钮字段
    resourceText: {
      text1: "发布资源需求",
      text2: "快速发布,精准对接优质项目",
      text3: "我的资源需求",
      text4: "寻求对接的资源"
    },//资源按钮字段
  },
  //载入页面
  onLoad: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var bind_mobile = wx.getStorageSync('bind_mobile');
    //调用应用实例的方法获取全局数据(获取用户信息并向后台进行发送)
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        bind_mobile: bind_mobile,
      });
      wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
    });

    //获取屏幕宽高(用于选项卡切换)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    //首次登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //向后台请求登录状态
          wx.request({
            url: url + '/api/wx/returnLoginStatus',
            data: {
              code: res.code
            },
            method: 'POST',
            success: function (res) {
              //本地存入open_session,bind_mobile,user_id
              wx.setStorageSync('open_session', res.data.open_session);
              wx.setStorageSync('bind_mobile', res.data.bind_mobile);
              wx.setStorageSync('user_id', res.data.user_id);
              var bind_mobile = wx.getStorageSync('bind_mobile');
              var user_id = res.data.user_id;
              if (user_id != 0) {
                //获取我的项目匹配到的投资人
                wx.request({
                  url: url + '/api/project/getMyProject',
                  data: {
                    user_id: user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log(res)
                    var myProject = res.data.data;
                    var length = myProject.length;
                    wx.setStorageSync('proLength', length);
                    that.setData({
                      myProject: myProject,
                      bind_mobile: bind_mobile
                    });

                    //将匹配出来的四个人放入缓存
                    var investors = [];
                    var cards = res.data.data;
                    for (var i = 0; i < cards.length; i++) {
                      investors.push(cards[i].match_investors)
                    }
                    wx.setStorageSync('investors', investors)
                  }
                })
              }
            },
            fail: function () {
              console.log("向后台获取3rd_session失败")
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //显示页面
  onShow: function () {
    var that = this;
    var current = this.data.currentTab;
    var user_industry = [];
    var user_industryId = [];
    var user_area = [];
    var user_areaId = [];
    var user_scale = [];
    var user_scaleId = [];
    var user_stage = [];
    var user_stageId = []

    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: url + '/api/wx/returnLoginStatus',
            data: {
              code: res.code
            },
            method: 'POST',
            success: function (res) {
              var user_id = res.data.user_id;
              var bind_mobile = res.data.bind_mobile;
              wx.setStorageSync('user_id', user_id);
              wx.setStorageSync('bind_mobile', bind_mobile)
              //获取我的项目匹配到的投资人
              if (user_id != 0) {
                wx.request({
                  url: url + '/api/project/getMyProject',
                  data: {
                    user_id: user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    var proLength = wx.getStorageSync('proLength');
                    //判断是否有新的项目
                    if (res.data.data.length !== proLength) {
                      var myProject = res.data.data;
                      wx.setStorageSync('proLength', proLength);
                      //将匹配出来的四个人放入缓存
                      var investors = [];
                      var cards = res.data.data;
                      for (var i = 0; i < cards.length; i++) {
                        investors.push(cards[i].match_investors)
                      }
                      wx.setStorageSync('investors', investors);
                      //刷新数据
                      that.setData({
                        myProject: myProject
                      })
                    }
                    that.setData({
                      bind_mobile: bind_mobile
                    });
                    // console.log(res)
                  }
                })
              }
              //获取用户投资需求
              if (user_id != 0) {
                wx.request({
                  url: url + '/api/investors/checkInvestorInfo',
                  data: {
                    user_id: user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    //循环出用户信息
                    var investor = res.data.data;
                    var industry = investor.industry_tag;
                    if (investor != '') {
                      for (var i = 0; i < industry.length; i++) {
                        user_industry.push(industry[i].industry_name);
                        user_industryId.push(industry[i].industry_id)
                      }
                      var area = investor.area_tag;
                      for (var i = 0; i < area.length; i++) {
                        user_area.push(area[i].area_title);
                        user_areaId.push(area[i].area_id)
                      }
                      var scale = investor.scale_tag;
                      for (var i = 0; i < scale.length; i++) {
                        user_scale.push(scale[i].scale_money)
                        user_scaleId.push(scale[i].scale_id)
                      }
                      var stage = investor.stage_tag;
                      for (var i = 0; i < stage.length; i++) {
                        user_stage.push(stage[i].stage_name)
                        user_stageId.push(stage[i].stage_id)
                      }
                    }
                    that.setData({
                      user_industry: user_industry
                    })
                    // console.log(user_industry,user_industryId,user_area,user_areaId,user_scale,user_scaleId,user_stage,user_stageId)
                  }
                })
              }
              //获取投资需求的匹配项目
              wx.request({
                url: url + '/api/investors/getMatchProjects',
                data: {
                  user_id: user_id
                },
                method: 'POST',
                success: function (res) {
                  if (res.data.status_code !== 440004) {
                    var yourProject = res.data.data.projects;
                    that.setData({
                      yourProject: yourProject,
                      hasPublic: 1,
                      investor_id: res.data.data.investor_id,
                      investor_page: 1,
                      investor_page_end: false,
                    })
                  } else {
                    that.setData({
                      hasPublic: 0
                    })
                  }
                }
              })
              //获取用户资源需求和匹配结果
              if (user_id != 0) {
                wx.request({
                  url: url + '/api/resource/getMatchResource',
                  data: {
                    user_id: user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log(res)
                    if (res.data.status_code != "450002") {
                      wx.setStorage({
                        key: 'resource_data',
                        data: res.data.res_data
                      })
                      var res_match = res.data.res_match;
                      var res_find = res.data.res_data.res_find;
                      var res_find_arry = [];
                      var res_id = res.data.res_data.res_id;
                      if (res_find != '') {
                        for (var i = 0; i < res_find.length; i++) {
                          res_find_arry.push(res_find[i].resource_name)
                        }
                      }
                      res_find = res_find_arry;
                      that.setData({
                        res_match: res_match, //资源需求匹配出来的项目
                        res_find: res_find,//我正在寻求的资源
                        hasPublic2: 1,//是否发布过资源需求
                        res_id: res_id,//用过请求资源需求匹配项目的分页接口
                        resource_page: 1,//初始化分页数
                        resource_page_end: false,//初始化是否还有数据
                      })
                    } else {
                      that.setData({
                        hasPublic2: 0
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              }
            },
            fail: function () {
              console.log("向后台获取3rd_session失败")
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
    var user_id = wx.getStorageSync('user_id');
    var loadData = wx.getStorageSync("loadData");
    if (current == 1) {
      //载入寻找项目数据
      wx.request({
        url: url + '/api/investors/getMatchProjects',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          ;
          if (res.data.status_code !== 440004) {
            var yourProject = res.data.data.projects;
            that.setData({
              yourProject: yourProject,
              hasPublic: 1,
              investor_id: res.data.data.investor_id
            })
          } else {
            that.setData({
              hasPublic: 0
            })
          }
        }
      })
    }


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
  //点击发布融资项目
  myProject: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var bind_mobile = wx.getStorageSync('bind_mobile');
    that.setData({
      bind_mobile: bind_mobile
    });
    // console.log(bind_mobile, this.data.bind_mobile)
    if (bind_mobile == 0) {
      wx.navigateTo({
        url: '../myProject/personInfo/personInfo'
      })
    } else if (bind_mobile == 1) {
      wx.navigateTo({
        url: "../myProject/publishProject/publishProject"
      })
    }
  },
  //点击发布投资需求
  yourProject: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var bind_mobile = wx.getStorageSync('bind_mobile');
    that.setData({
      bind_mobile: bind_mobile
    });
    // console.log(bind_mobile, this.data.bind_mobile);
    if (bind_mobile == 0) {
      wx.navigateTo({
        url: '../myProject/personInfo/personInfo'
      })
    } else if (bind_mobile == 1) {
      wx.navigateTo({
        url: "../yourProject/yourProject"
      })
    }
  },
  //点击发布资源需求
  resourceNeed: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var bind_mobile = wx.getStorageSync('bind_mobile');
    that.setData({
      bind_mobile: bind_mobile
    });
    // console.log(bind_mobile, this.data.bind_mobile);
    if (bind_mobile == 0) {
      wx.navigateTo({
        url: '../myProject/personInfo/personInfo'
      })
    } else if (bind_mobile == 1) {
      wx.navigateTo({
        url: "../resourceEnchange/resourceEnchange"
      })
    }
  },
  // 跳转人物详情
  userDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + id
    })
  },
  //点击项目融资详情
  detail: function (e) {
    var thisData = e.currentTarget.dataset;
    var index = thisData.index;
    wx.navigateTo({
      url: '../myProject/projectDetail/projectDetail?id=' + thisData.id + '&&index=' + index
    })
  },
  //点击融资项目匹配出来的投资人
  investorDetial(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userDetail/userDetail?id=' + id,
    })
  },
  //点击项目投资详情
  yourDetail: function (e) {
    var thisData = e.currentTarget.dataset;
    var index = thisData.index;
    wx.navigateTo({
      url: '../yourProject/yourDetail?id=' + thisData.id + '&&index=' + index
    })
  },

  //寻找项目触底刷新
  yourPayProject: function () {
    var that = this;
    var investor_id = this.data.investor_id;
    var investor_page = this.data.investor_page;
    var user_id = wx.getStorageSync('user_id');
    var investor_page_end = this.data.investor_page_end
    // console.log(user_id)
    if (user_id != '') {
      if (investor_page_end == false) {
        wx.showToast({
          title: 'loading...',
          icon: 'loading'
        })
        investor_page++;
        that.setData({
          investor_page: investor_page
        });
        wx.request({
          url: url + '/api/investors/withPageGetMatchProjects',
          data: {
            investor_id: investor_id,
            page: investor_page,
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            var newPage = res.data.data;
            var yourProject = that.data.yourProject;
            for (var i = 0; i < newPage.length; i++) {
              yourProject.push(newPage[i])
            }
            that.setData({
              yourProject: yourProject,
              investor_page_end: res.data.investor_page_end
            })
          }
        })
        return;
      } else {
        rqj.errorHide(that, "没有更多了", 3000)
      }
    }
  },

  // 资源对接触底刷新
  // resourceProject: function () {
  //   var that = this;
  //   var res_id = this.data.res_id;
  //   var resource_page = this.data.resource_page;
  //   var user_id = wx.getStorageSync('user_id');
  //   var resource_page_end = this.data.resource_page_end;
  //   var res_match = this.data.res_match;
  //   if (user_id != '') {
  //     if (resource_page_end == false) {
  //       wx.showToast({
  //         title: 'loading...',
  //         icon: 'loading'
  //       })
  //       resource_page++;
  //       that.setData({
  //         resource_page: resource_page
  //       });
  //       wx.request({
  //         url: url + '/api/resource/getMatchResourceForPage',
  //         data: {
  //           res_id: res_id,
  //           page: resource_page,
  //         },
  //         method: 'POST',
  //         success: function (res) {
  //           that.callback(res)
  //           console.log(res)
  //           var newPage = res.data.res_match;
  //           var resource_page_end = res.data.page_end;
  //           var res_match = that.data.res_match;
  //           for (var i = 0; i < newPage.length; i++) {
  //             res_match.push(newPage[i])
  //           }
  //           that.setData({
  //             res_match: res_match, //资源需求匹配出来的项目
  //             resource_page_end: resource_page_end,
  //           })
  //         }
  //       })
  //       return
  //     } else {
  //       rqj.errorHide(that, "没有更多了", 3000)
  //     }
  //   }
  // },
  resourceProject: function () {
    num++;
    var that = this;
    var res_id = this.data.res_id;
    var resource_page = this.data.resource_page;
    var user_id = wx.getStorageSync('user_id');
    var resource_page_end = this.data.resource_page_end;
    var res_match = this.data.res_match;
    if (user_id != '') {
      console.log("第1次");
      console.log(num);
      console.log(resource_page_end);
      if (resource_page_end == false) {
        console.log("第2次");
        console.log(num);
        wx.showToast({
          title: 'loading...',
          icon: 'loading'
        })
        resource_page++;
        that.setData({
          resource_page: resource_page
        });
        wx.request({
          url: url + '/api/resource/getMatchResourceForPage',
          data: {
            res_id: res_id,
            page: resource_page,
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            console.log("第3次");
            console.log(num);
            var newPage = res.data.res_match;
            var resource_page_end = res.data.page_end;
            var res_match = that.data.res_match;
            console.log(resource_page_end);
            for (var i = 0; i < newPage.length; i++) {
              res_match.push(newPage[i])
            }
            that.setData({
              res_match: res_match, //资源需求匹配出来的项目
              resource_page_end: resource_page_end,
            })
          }
        })
      } else {
        rqj.errorHide(that, "没有更多了", 3000)
      }
      //rqj.loadMore(url,that,'/api/resource/getMatchResourceForPage',resource_page,res_id,user_id,resource_page_end)
    }
  },
  callback: function (res, that) {
    console.log("这里是回调函数");
    console.log(res);
    var newPage = res.data.res_match;
    var resource_page_end = res.data.page_end;
    var res_match = that.data.res_match;
    for (var i = 0; i < newPage.length; i++) {
      res_match.push(newPage[i])
    }
    that.setData({
      res_match: res_match, //资源需求匹配出来的项目
      resource_page_end: resource_page_end,
    })
  },
  //分享当前页面
  onShareAppMessage: function () {
    var user_id = wx.getStorageSync('user_id');
    return {
      title: '微天使帮您精准对接投融资需求',
      path: '/pages/resource/resource'
    }
  }
});