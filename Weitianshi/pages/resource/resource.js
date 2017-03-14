var app = getApp()
Page({
  data: {
    userInfo: {},
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
    bind_mobile: 0,//是否已存有个人信息
    myProject: "",
    yourProject: "",
    findTarget: "",//寻找项目的匹配的标准
    load: 1,
    text: "你好",
    finding: [
      "众创空间",
      "投后服务"
    ],
    investor_page: 1,//投资人分页
    //资源对接
    others: [
      {
        id: "other_id",
        picUrl: "",
        name: "代用名",
        position: "职位名称",
        company: "杭州投着乐网络科技有限公司",
        offer: ["企业服务", "智能", "大数据", "金融", "saas"],
        search: ["大数据", "智能", "大数据", "saas"]
      },
      {
        id: "other_id",
        picUrl: "",
        name: "代用名",
        position: "职位名称",
        company: "杭州投着乐网络科技有限公司",
        offer: ["企业服务", "智能", "大数据", "金融", "saas"],
        search: ["大数据", "智能", "大数据", "saas"]
      }
    ]
  },
  //载入页面
  onLoad: function (option) {
    // console.log("this is onLoad")
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var bind_mobile = wx.getStorageSync('bind_mobile');
    //调用应用实例的方法获取全局数据(获取用户信息并向后台进行发送)
    app.getUserInfo(function (userInfo) {
      //更新数据
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
          //向后台请求数据
          //console.log(res.code)
          wx.request({
            url: 'https://www.weitianshi.com.cn/api/wx/returnLoginStatus',
            data: {
              code: res.code
            },
            method: 'POST',
            success: function (res) {
              //本地存入open_session,bind_mobile,user_id
              wx.setStorageSync('open_session', res.data.open_session);
              wx.setStorageSync('bind_mobile', res.data.bind_mobile);
              wx.setStorageSync('user_id', res.data.user_id);
              //
              var bind_mobile = wx.getStorageSync('bind_mobile');
              var user_id = wx.getStorageSync('user_id');
              // console.log("维护登录状态成功,已将bind_mobile,user_id,open_session存入缓存")
              // console.log(res.data.bind_mobile, res.data.user_id, res.data.open_session)

              if (user_id !== 0) {
                // console.log("请求了列表信息")
                // console.log(user_id)
                //获取当前页面信息
                wx.request({
                  url: 'https://www.weitianshi.com.cn/api/project/getMyProject',
                  data: {
                    user_id: user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    var myProject = res.data.data;
                    var length = myProject.length;
                    // console.log(length)
                    wx.setStorageSync('proLength', length);
                    that.setData({
                      myProject: myProject,
                      bind_mobile: bind_mobile
                    });
                    // console.log(res)

                    //将匹配出来的四个人放入缓存
                    var investors = [];
                    var cards = res.data.data;
                    for (var i = 0; i < cards.length; i++) {
                      investors.push(cards[i].match_investors)
                    }
                    wx.setStorageSync('investors', investors)
                  },
                  fail: function () {
                    // fail
                  },
                  complete: function () {
                    // complete
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
    // console.log("this is onShow")
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var bind_mobile = wx.getStorageSync('bind_mobile');
    var y_domainValue = wx.getStorageSync('y_domainValue');
    var current = this.data.currentTab;
    // console.log(user_id)
    that.setData({
      y_domainValue: y_domainValue
    })
    //请求列表信息
    if (user_id !== 0) {
      // console.log("请求了列表信息");
      // console.log(user_id)
      //获取当前页面信息
      wx.request({
        url: 'https://www.weitianshi.com.cn/api/project/getMyProject',
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
    if (current == 1) {
      //载入寻找项目数据
      wx.request({
        url: 'https://www.weitianshi.com.cn/api/investors/getMatchProjects',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          // var scale=4;
          if (res.data.status_code !== 440004) {
            var yourProject = res.data.data.projects;
            // var pro_scale=yourProject.pro_scale;
            // var new_scale=[]
            // for(var i=0;i<pro_scale.length;i++){
            //   var isSame=0;
            //     if(pro_scale.scale_id==4){

            //     }
            // }
            // console.log(yourProject);
            console.log(rel.data.data.investor_id)
            that.setData({
              yourProject: yourProject,
              hasPublic: 1,
              investor_id:rel.data.data.investor_id
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
    // console.log(user_id, current);
    if (current == 1) {
      //载入寻找项目数据
      wx.request({
        url: 'https://www.weitianshi.com.cn/api/investors/getMatchProjects',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          // console.log(res);
          // var scale=4;
          if (res.data.status_code !== 440004) {
            var yourProject = res.data.data.projects;
            // var pro_scale=yourProject.pro_scale;
            // var new_scale=[]
            // for(var i=0;i<pro_scale.length;i++){
            //   var isSame=0;
            //     if(pro_scale.scale_id==4){

            //     }
            // }
            // console.log(yourProject);
            that.setData({
              yourProject: yourProject,
              hasPublic: 1,
              investor_id:res.data.data.investor_id
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
        url: '../myProject/personInfo'
      })
    } else if (bind_mobile == 1) {
      wx.navigateTo({
        url: "../myProject/myProject"
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
        url: '../myProject/personInfo'
      })
    } else if (bind_mobile == 1) {
      wx.navigateTo({
        url: "../yourProject/yourProject"
      })
    }
  },

  //点击项目融资详情
  detail: function (e) {
    var thisData = e.currentTarget.dataset;
    var index = thisData.index;
    wx.navigateTo({
      url: '../myProject/myDetail?id=' + thisData.id + '&&index=' + index
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
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    var that = this;
    var investor_id = this.data.investor_id;
    var investor_page = this.data.investor_page;
    var user_id = wx.getStorageSync('user_id');
    // console.log(user_id)
    if (user_id != '') {
      investor_page++;
      that.setData({
        investor_page: investor_page
      });
      wx.request({
        url: 'https://www.weitianshi.com.cn/api/investors/withPageGetMatchProjects',
        data: {
          investor_id: investor_id,
          page: investor_page,
        },
        method: 'POST',
        success: function (res) {
          // console.log(res)
          var newPage = res.data.data;
          // console.log(newPage)
          var yourProject = that.data.yourProject;
          for (var i = 0; i < newPage.length; i++) {
            yourProject.push(newPage[i])
          }
          that.setData({
            yourProject: yourProject
          })
          wx.hideToast({
            title: 'loading...',
            icon: 'loading'
          })
        }
      })
    }
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