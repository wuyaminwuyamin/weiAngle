var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        buttonOne: {
            text: "新增项目",
        },
        myPublicProject_page: 1,
        myPublicCheck: true,
        myPublic_page_end: false
    },
    onShow: function () {
        wx.removeStorageSync("investors")
        var that = this;
        var user_id = wx.getStorageSync('user_id')
        //获取我的项目匹配到的投资人
        wx.request({
            url: url + '/api/project/getMyProject',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log("获取我的项目匹配到的投资人")
                console.log(res)
                var myProject = res.data.data;
                //将匹配出来的四个人放入缓存
                var investors = [];
                var cards = res.data.data;
                cards.forEach((x) => {
                    investors.push(x.match_investors)
                })
                wx.setStorageSync('investors', investors);
                //刷新数据
                that.setData({
                    myProject: myProject,
                    investors: investors,
                    myPublic_page_end: false,
                    myPublicProject_page: 1
                })
            }
        });
    },
    // 上拉加载
    myPublicProject: function () {
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var myPublicProject_page = this.data.myPublicProject_page;
        var myPublicCheck = this.data.myPublicCheck;
        var myPublic_page_end = this.data.myPublic_page_end;
        if (myPublicCheck) {
            if (user_id != '') {
                //判断数据是不是已经全部显示了
                if (myPublic_page_end == false) {
                    myPublicProject_page++;
                    this.setData({
                        myPublicProject_page: myPublicProject_page,
                        myPublicCheck: false
                    });
                    wx.showLoading({
                        title: 'loading',
                    })
                    wx.request({
                        url: url + '/api/project/getMyProject',
                        data: {
                            user_id: user_id,
                            page: myPublicProject_page,
                        },
                        method: 'POST',
                        success: function (res) {
                            var myPublic_page_end = res.data.page_end;
                            var newPage = res.data.data;//新请求到的数据
                            var myProject = that.data.myProject;//现在显示的数据
                            var investors = that.data.investors;
                            console.log("触发刷新")
                            console.log(myPublicProject_page, myPublic_page_end)
                            console.log("分页加载项目融资")
                            console.log(res.data);
                            newPage.forEach((x) => {
                                myProject.push(x)
                                investors.push(x.match_investors)
                            })
                            wx.setStorageSync("investors", investors)
                            that.setData({
                                myProject: myProject,
                                investors: investors,
                                myPublicCheck: true,
                                myPublic_page_end: myPublic_page_end
                            })
                            wx.hideLoading()
                        },
                    })
                } else {
                    rqj.errorHide(that, "没有更多了", that, 3000)
                    that.setData({
                        myPublicCheck: true
                    })
                }
            }
        }
    },
    //项目详情
    detail: function (e) {
        var thisData = e.currentTarget.dataset;
        var id = thisData.id;
        var index = thisData.index
        wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index + "&&currentTab=" + 0
        })
    },
    //编辑项目
    editDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        var user_id = wx.getStorageSync('user_id')
        wx.navigateTo({
            url: '/pages/myProject/editProject/editProject?pro_id=' + id + "&&user_id=" + user_id,
        })
    },
    // 按钮一号
    buttonOne: function () {
        app.infoJump("/pages/myProject/publishProject/publishProject");
    }
})