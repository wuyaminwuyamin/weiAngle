var app = getApp();
var url = app.globalData.url;
Page({
    data: {
        integrity: 30,
        user: "",
        modal: 0,
        goTop: 0,
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
                    user_id: user_id
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    var user = res.data.user_info;
                    var invest = res.data.invest_info;
                    var resource = res.data.resource_info;
                    var project_info = res.data.project_info;
                    var invest_case = res.data.invest_case;
                    console.log(invest)
                    var status_code = res.data.status_code;
                    that.setData({
                        user: user,
                        invest: invest,
                        resource: resource,
                        project_info: project_info,
                        invest_case: invest_case,
                        status_code: status_code
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
                url: '../yourProject/yourProject',
            })
        }

    },
    //资源对接
    resourceEnchangeEdit: function () {
        if (!this.data.options) {
            wx.navigateTo({
                url: '../resourceEnchange/resourceEnchange',
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
    //投资案例
    investCase: function () {
        if (!this.data.options) {
            var invest_case = this.data.ivest_case;
            if (invest_case) {
                wx.navigateTo({
                    url: 'investCase/investCase?invest_case=' + invest_case,
                })
            } else {
                wx.navigateTo({
                    url: 'investCase/investCase'
                })
            }
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
        
        //  wx.navigateTo({
        //      url: 'sharePage/sharePage?user_id=V0VznXa0',
        //  })
    },
    //分享名片
    onShareAppMessage: function () {
        var user_id = wx.getStorageSync('user_id');
        var modal=this.data.modal;
        this.setData({
            goTop:1
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

    /*
    //我的人脉
    myNetwork: function () {
        var bindUser = this.data.bindUser;
        if (bindUser == 0) {
            wx.showModal({
                title: "提示",
                content: "请先绑定个人信息",
                success: function (res) {
                    if (res.confirm == true) {
                        wx.navigateTo({
                            url: '../myProject/personInfo/personInfo?network=2&&followed_user_id=' + 0,
                        })
                    }
                }
            })
        } else {
            wx.switchTab({
                url: '../network/network',
            })
        }
    },
    // 添加人脉
    addNetwork: function () {
        var user_id = this.data.user_id;
        var followed_user_id = this.data.followed_user_id;
        console.log(user_id, followed_user_id)
        if (user_id != 0) {
            wx.request({
                url: url + '/api/user/followUser',
                data: {
                    follow_user_id: user_id,
                    followed_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                    console.log("添加人脉成功")
                    console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                },
            })
        } else {
            wx.showModal({
                title: "提示",
                content: "请先绑定个人信息",
                success: function (res) {
                    if (res.confirm == true) {
                        wx.navigateTo({
                            url: '../myProject/personInfo/personInfo?network=1&&followed_user_id=' + followed_user_id,
                        })
                    }
                }
            })
        }
    },
    */
});  /*//取消交换名片
    toastCancel: function () {
        var notIntegrity = this.data.notIntegrity;
        notIntegrity = 0;
        this.setData({
            notIntegrity: notIntegrity
        })
    },
    //去完善名片
    toastCertain: function () {
        wx.navigateTo({
            url: 'cardEdit/cardEdit',
        })
        var notIntegrity = this.data.notIntegrity;
        notIntegrity = 0;
        this.setData({
            notIntegrity: notIntegrity
        })
    },*/