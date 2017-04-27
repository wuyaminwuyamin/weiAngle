var app = getApp();
var url = app.globalData.url;
Page({
    data: {
        integrity: 30,
        user: "",
        modal: 0,
        goTop: 0,
        canEdit: 1,
    },
    onLoad: function (options) {
        if (options) {
            this.setData({
                modal: options.modal
            })
        }
    },
    onShow: function () {
        var that = this
        var user_id = wx.getStorageSync('user_id')
        console.log(user_id)
        that.setData({
            user_id: user_id
        })
        if (user_id) {
            //载入我的个人信息
            wx.request({
                url: url + '/api/user/getUserAllInfo',
                data: {
                    share_id: 0,
                    user_id: user_id,
                    view_id: 0,
                },
                method: 'POST',
                success: function (res) {
                    console.log(res);
                    var user = res.data.user_info;
                    var invest = res.data.invest_info;
                    var resource = res.data.resource_info;
                    var project_info = res.data.project_info;
                    var invest_case = res.data.invest_case;
                    var status_code = res.data.status_code;
                    var financingProject = that.data.financingProject;
                    var user_name = res.data.user_info.user_real_name;
                    //设置缓存==========
                    wx.setStorage({
                        key: 'resource_data',
                        data: res.data.resource_info
                    })

                    wx.setNavigationBarTitle({
                        title: user_name + "的投资名片",
                    })
                    that.setData({
                        user: user,
                        invest: invest,
                        resource: resource,
                        project_info: project_info,
                        invest_case: invest_case,
                        status_code: status_code,
                        financingProject: financingProject,
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
            })
        } else {
            app.noUserId()
        }
    },
    //编辑名片
    cardEdit: function () {
        if (!this.data.options) {
            wx.navigateTo({
                url: 'cardEdit/cardEdit',
            })
        }
    },
    //寻找案源
    findProjectEdit: function () {
        if (!this.data.options) {
            wx.navigateTo({
                url: '../yourProject/yourProject?current=' + 1,
            })
        }

    },
    //资源对接
    resourceEnchangeEdit: function () {
        if (!this.data.options) {
            wx.navigateTo({
                url: '../resourceEnchange/resourceEnchange?current=' + 1,
            })
        }
    },
    //项目融资
    projectFinance: function () {
        if (!this.data.options) {
            wx.navigateTo({
                url: 'projectFinance/projectFinance',
            })
        }
    },
    //融资项目详情
    financingDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index,
        })
    },
    //投资案例
    investCase: function () {
        if (!this.data.options) {
            wx.navigateTo({
                url: 'investCase/investCase'
            })
        }
    },
    //交换名片
    cardChange: function () {
        var that = this;
        var user_id = this.data.user_id;
        var modal = this.data.modal;
        var status_code = this.data.status_code;
        if (status_code == 2000000) {
            that.setData({
                modal: 1
            })
        } else {
            wx.showModal({
                title: "友情提示",
                content: "交换名片之前,请先完善自己的名片",
                success: function () {
                    wx.navigateTo({
                        url: '../my/cardEdit/cardEdit',
                    })
                }
            })
        }
    },
    //分享名片
    onShareAppMessage: function () {
        var user_id = wx.getStorageSync('user_id');
        var modal = this.data.modal;
        this.setData({
            goTop: 1
        })

        if (modal == 1) {
            this.setData({
                modal: 0
            })
        }
        return {
            title: '投资名片',
            path: "/pages/my/sharePage/sharePage?user_id=" + user_id,
            success: function (res) {
            },
            fail: function (res) {
                console.log(res)
            }
        }
    },
    //取消分享
    cancelShare: function () {
        this.setData({
            modal: 0
        })
    },
});
