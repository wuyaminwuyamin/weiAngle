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
        var that = this;
        var id = options.id;
        var index = options.index;
        var user_id = wx.getStorageSync('user_id');
        var page = this.data.page;
        var avatarUrl = wx.getStorageSync('avatarUrl');
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
                console.log(res)
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
                    })
                }
            },
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
        return {
            title: '项目-' + pro_intro,
            path: '/pages/yourDetail/yourDetail?pro_id=' + that.data.id
        }
    }
});