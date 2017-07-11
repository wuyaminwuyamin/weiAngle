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
        load: 0
    },
    onLoad: function (options) {
        var that = this;
        var id = options.id;//当前被查看用户的项目id
        var index = options.index;
        var user_id = wx.getStorageSync('user_id');//获取我的user_id==view_id
        var page = this.data.page;
        var avatarUrl = wx.getStorageSync('avatarUrl');
        console.log(user_id,id)
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
                var project = res.data.data;
                var user = res.data.user; 
                console.log(user)
                var firstName = user.user_name.substr(0, 1) || '';
                var pro_industry = project.pro_industry;
                let pro_finance_stock_after = Math.round(project.pro_finance_stock_after);
                let industy_sort = [];
                console.log(project.pro_finance_stock_after)
                // 项目介绍的标签
                for (var i = 0; i < pro_industry.length; i++) {
                  industy_sort.push(pro_industry[i].industry_name)
                }
                that.setData({
                  industy_sort: industy_sort,
                  pro_finance_stock_after: pro_finance_stock_after
                })
                var followed_user_id=res.data.user.user_id
                // // 加載個人信息
                // wx.request({
                //   url: url + '/api/user/getUserAllInfo',
                //   data: {
                //     share_id: 0,
                //     user_id: followed_user_id,
                //     view_id: user_id,
                //   },
                //   method: 'POST',
                //   success: function (res) {
                //     console.log(res)
                //     var button_type = res.data.button_type;
                //     let userInfo = res.data.user_info;
                //     console.log(user_id)
                //     console.log(button_type)
                //     that.setData({
                //       button_type: button_type,
                //       userInfo: userInfo
                //     })
                //   }
                // })
                that.setData({
                    project: project,
                    user: user,
                    firstName: firstName,
                    pro_industry: pro_industry,
                    followed_user_id:followed_user_id
                });

                var is_mine = res.data.data.is_mine;
                //console.log(is_mine)
                if (is_mine == true) {
                    //请求投资人详情
                    wx.request({
                        url: url + '/api/project/getProjectMatchInvestors',
                        data: {
                            user_id: user_id,
                            pro_id: that.data.id,
                            page: page
                        },
                        method: 'POST',
                        success: function (res) {
                            console.log(res)
                            var investor2 = res.data.data;
                            console.log(investor2)
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
        });
        
    },
    // 用户详情
    userDetail: function (e) {
        console.log(e);
        var id = e.currentTarget.dataset.id
        console.log(id)
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新")
        wx.stopPullDownRefresh()
    },

    //分享当前页面
    onShareAppMessage: function () {
        var pro_intro = this.data.project.pro_intro;
        console.log(pro_intro)
        return {
            title: pro_intro,
            path: '/pages/projectDetail/projectDetail?id=' + this.data.id
        }
        console.log(data.project.pro_intro);
    },
    // 加人脉
    addPerson: function (e) {
      var that = this
      var followed_user_id = e.currentTarget.dataset.id;//当前用户的
      var view_id = wx.getStorageSync('user_id');//获取我自己的user_id/查看者的id
      //用戶的个人信息
      wx.request({
        url: url_common + '/api/user/getUserAllInfo',
        data: {
          share_id: 0,
          user_id: followed_user_id,
          view_id: view_id,
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          var button_type = res.data.button_type;
          console.log(button_type)
          that.setData({
            button_type : button_type
          })
          // button_type==0  0申请加人脉按钮，1不显示任何按钮  2待验证   3同意加为人脉  4加为单方人脉
          //判断用户信息是否完整
          wx.request({
            url: url + '/api/user/checkUserInfo',
            data: {
              user_id: view_id
            },
            method: 'POST',
            success: function (res) {
              if (res.data.status_code == 2000000) {
                var complete = res.data.is_complete;
                if (complete == 1) {
                  //信息完整
                  if (button_type == 0) {
                    wx.request({
                      url: url + '/api/user/UserApplyFollowUser',
                      data: {
                        user_id: view_id,
                        applied_user_id: followed_user_id
                      },
                      method: 'POST',
                      success: function (res) {
                        console.log(res)
                        console.log("正常申请添加人脉")
                        that.setData({
                          button_type: 2
                        })
                      }
                    })

                  } else if (button_type == 1) {
                    console.log("我的人脉--不显示内容")
                  } else if (button_type == 2) {
                    console.log("待验证===显示待验证")
                  } else if (button_type == 3) {
                    wx.request({
                      url: url + '/api/user/handleApplyFollowUser',
                      data: {
                        // 当前登录者的
                        user_id: view_id,
                        // 当前申请的用户
                        apply_user_id: followed_user_id
                      },
                      method: 'POST',
                      success: function (res) {
                        console.log(res)
                        console.log("同意申請")
                        that.setData({
                          button_type: 1
                        })
                      }
                    })
                  } else if (button_type == 4) {
                    // 单方人脉添加
                    wx.request({
                      url: url + '/api/user/followUser',
                      data: {
                        user_id: user_id,
                        followed_user_id: followed_user_id
                      },
                      method: 'POST',
                      success: function (res) {
                        console.log("这里是单方人脉添加")
                        console.log(res)
                        that.setData({
                          button_type: 1
                        })
                      }
                    })
                  }
                } else if (complete == 0) {
                  //有user_id但信息不全
                  wx.showModal({
                    title: "提示",
                    content: "请先绑定个人信息",
                    success: function (res) {
                      wx.setStorageSync('followed_user_id', followed_user_id)
                      if (res.confirm == true) {
                        wx.navigateTo({
                          url: '/pages/register/companyInfo/companyInfo'
                        })
                      }
                    }
                  })
                }
              } else {
                //没有user_id
                wx.showModal({
                  title: "提示",
                  content: "请先绑定个人信息",
                  success: function (res) {
                    wx.setStorageSync('followed_user_id', followed_user_id)
                    if (res.confirm == true) {
                      wx.navigateTo({
                        url: '/pages/register/personInfo/personInfo'
                      })
                    }
                  }
                })
              }
            }
          })
        },
        fail: function (res) {
          console.log(res)
        },
      }) 
    }
})