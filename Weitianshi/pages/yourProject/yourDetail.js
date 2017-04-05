var app=getApp();
var url=app.globalData.url;
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
        app.checkLogin();
        //  投资人数据
        // console.log("this is onLoad");
        // console.log(options)
        var that = this;
        var id = options.id;
        var index = options.index;
        var user_id = wx.getStorageSync('user_id');
        var page = this.data.page;
        var avatarUrl = wx.getStorageSync('avatarUrl');
        // console.log(index);
        // console.log(avatarUrl);
        that.setData({
            index: index,
            id: id,
            user_id: user_id,
            avatarUrl: avatarUrl,
        });

        //项目详情(不包括投资人)
        wx.request({
            url: url+'/api/project/showProjectDetail',
            data: {
                user_id: user_id,
                pro_id: this.data.id
            },
            method: 'POST',
            success: function (res) {
                var project = res.data.data;
                var user = res.data.user;
                var firstName = user.user_name.substr(0, 1) || '';
                var pro_industry = project.pro_industry;
                that.setData({
                    project: project,
                    user: user,
                    firstName: firstName,
                    pro_industry: pro_industry
                });
                // console.log(res);
                // console.log(project)



           
                var is_mine = res.data.data.is_mine;
                //console.log(is_mine)
                if (is_mine == true) {
                    //请求投资人详情
                    wx.request({
                        url: url+'/api/project/getProjectMatchInvestors',
                        data: {
                            user_id: user_id,
                            pro_id: that.data.id,
                            page: page
                        },
                        method: 'POST',
                        success: function (res) {
                            // console.log(res)
                            var investor2 = res.data.data;
                            // console.log(investor2)
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
                            // fail
                        },
                        complete: function () {
                            // complete
                        }
                    })
                }

                // console.log(that.data.aa)
                // console.log(project)
                // console.log(user)
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })

    },
    // onShow: function () {
    //     console.log("this is onShow")
    // },
    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新")
        wx.stopPullDownRefresh()
    },

    //分享当前页面
    onShareAppMessage: function () {
        var pro_intro = this.data.project.pro_intro;
        return {
            title: '项目-' + pro_intro,
            path: '/pages/yourDetail/yourDetail?pro_id=' + that.data.id
        }
    }

    //触底加载
    // loadMore: function () {
    //     // console.log("正在加载更多")
    //     var that = this;
    //     var page = this.data.page;
    //     var user_id = this.data.user_id;
    //     // console.log(pro_id)
    //     page++;
    //     that.setData({
    //         page: page,
    //         load: 1
    //     });
    //     // console.log(page)
    //     wx.request({
    //         url: url+'/api/project/getProjectMatchInvestors',
    //         data: {
    //             user_id: user_id,
    //             pro_id: this.data.id,
    //             page: page
    //         },
    //         method: 'POST',
    //         success: function (res) {
    //             var investor2 = res.data.data;
    //             // console.log(investor2)
    //             that.setData({
    //                 investor2: investor2
    //             });
    //             setTimeout(function () {
    //                 that.setData({
    //                     load: 0
    //                 })
    //             }, 1500)
    //         },
    //         fail: function () {
    //             // fail
    //         },
    //         complete: function () {
    //             // complete
    //         }
    //     })
    // }
});