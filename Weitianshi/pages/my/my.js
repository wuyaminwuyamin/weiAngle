var app = getApp();
var url = app.globalData.url;
Page({
    data: {
        integrity: 30,
        user: "",
        modal: 1,
    },
    onShow: function (options) {
        // var options = { user_id: "V0VznXa0" }
        // console.log(options)
        var that = this
        var followed_user_id;

        if (options) {
            console.log("被分享")
            wx.showToast({
                title:"被分享"
            })
            // 被分享
            var options = options;
            followed_user_id = options.user_id;
            that.setData({
                options: options,
                followed_user_id: followed_user_id,
            })
            //载入我的个人信息
            wx.request({
                url: url + '/api/user/getUserAllInfo',
                data: {
                    user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                    var user = res.data.user_info;
                    var invest = res.data.invest_info;
                    var resource = res.data.resource_info;
                    var project_info = res.data.project_info;
                    var invest_case = res.data.invest_case;
                    that.setData({
                        user: user,
                        invest: invest,
                        resource: resource,
                        project_info: project_info,
                        invest_case: invest_case
                    })
                },
                fail: function (res) {
                    console.log(res)
                },
            })
            //检验登录状态获取user_id
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
                                var user_mobile = res.data.bind_mobile;
                                wx.setStorageSync('user_id', user_id);
                                wx.setStorageSync('user_mobile', user_mobile);
                                // 判断是否绑定过用户
                                if (user_id == 0) {
                                    that.setData({
                                        bindUser: 0
                                    })
                                } else {
                                    that.setData({
                                        bindUser: 1
                                    })
                                }
                                console.log(user_id, user_mobile)
                                that.setData({
                                    user_id: user_id,
                                    user_mobile: user_mobile
                                })
                            }
                        })
                    }
                }
            });
        } else {
            console.log("分享者")
             wx.showToast({
                title:"分享者"
            })
            // 分享者
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
                        that.setData({
                            user: user,
                            invest: invest,
                            resource: resource,
                            project_info: project_info,
                            invest_case: invest_case
                        })
                    },
                    fail: function (res) {
                        console.log(res)
                    },
                })
            } else {
                app.noUserId()
            }
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
        /*var modal = this.data.modal;
        modal = 0;
        this.setData({
            modal: modal
        })*/
        wx.navigateTo({
          url: 'test/test?user_id=1',
        })
    },
    //取消交换名片
    toastCancel: function () {
        var modal = this.data.modal;
        modal = 1;
        this.setData({
            modal: modal
        })
    },
    //去完善名片
    toastCertain: function () {
        wx.navigateTo({
            url: 'cardEdit/cardEdit',
        })
        var modal = this.data.modal;
        modal = 1;
        this.setData({
            modal: modal
        })
    },
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
    //分享名片
    onShareAppMessage: function () {
        var user_id = wx.getStorageSync('user_id')
        console.log(user_id)
        return {
            title: '分享您的名片',
            // path: '/pages/my/my?user_id=V0VznXa0',
            path:"/pages/my/test/test?user_id=1",
            success: function (res) {
                wx.showToast({
                    user_id
                })
            },
            fail: function (res) {
                console.log(res)
            }
        }
    }
});