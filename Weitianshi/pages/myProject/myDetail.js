var rqj = require('../Template/Template.js')
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
        investor_arry: [],
        page_end: false
    },
    onLoad: function (options) {
        //  投资人数据
        // console.log("this is onLoad");
        // console.log(options)
        var that = this;
        var id = options.id;
        var index = options.index;
        var user_id = wx.getStorageSync('user_id');
        var page = this.data.page;
        var avatarUrl = wx.getStorageSync('avatarUrl');
        var investors = wx.getStorageSync('investors');//所有项目对应四位投资人
        // console.log(index);
        // console.log(avatarUrl);
        that.setData({
            index: index,
            id: id,
            user_id: user_id,
            avatarUrl: avatarUrl,
            investor: investors[index]

        });
        var investor = this.data.investor;
        var industry_tag = [];
        var scale_tag = [];
        var stage_tag = [];
        for (var i = 0; i < investor.length; i++) {
            industry_tag.push(investor[i].industry_tag);
            scale_tag.push(investor[i].scale_tag);
            stage_tag.push(investor[i].stage_tag)
        }
        that.setData({
            industry_tag: industry_tag,
            stage_tag: stage_tag,
            scale_tag: scale_tag
        });
        // console.log(investor)
        // console.log(industry_tag)
        //项目详情(不包括投资人)
        wx.request({
            url: 'https://www.weitianshi.com.cn/api/project/showProjectDetail',
            data: {
                user_id: user_id,
                pro_id: this.data.id
            },
            method: 'POST',
            success: function (res) {
                // console.log(res)
                var project = res.data.data;
                var user = res.data.user;
                var aa = [];
                var firstName = user.user_name.substr(0, 1);
                that.setData({
                    project: project,
                    user: user,
                    firstName: firstName
                });
                // console.log(user)
                var pro_industry = project.pro_industry;
                for (var i = 0; i < pro_industry.length; i++) {
                    aa.push(pro_industry[i].industry_name)
                }
                that.setData({
                    aa: aa
                });
                // console.log(that.data.aa);
                // console.log(project);
                // console.log(user);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })

    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    },

    //触底加载
    loadMore: function () {
        var that = this;
        var page = this.data.page;
        var user_id = this.data.user_id;
        var pro_id = this.data.id;
        var page_end = this.data.page_end;
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
                url: 'https://www.weitianshi.com.cn/api/project/getProjectMatchInvestors',
                data: {
                    user_id: user_id,
                    pro_id: pro_id,
                    page: page
                },
                method: 'POST',
                success: function (res) {
                    var investor2 = res.data.data;
                    var investor_arry = that.data.investor_arry
                    for (var i = 0; i < investor2.length; i++) {
                        investor_arry.push(investor2[i])
                    }
                    that.setData({
                        investor_arry: investor_arry,
                        page_end:res.data.page_end
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
    },

    //分享当前页面
    onShareAppMessage: function () {
        var pro_intro = this.data.project.pro_intro;
        return {
            title: '项目-' + pro_intro,
            path: '/pages/myProject/myDetail'
        }
    }
});