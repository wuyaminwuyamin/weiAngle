//app.js
App({
    // onLaunch 用于监听小程序初始化,当完成时会触发onLaunch(全局只会触发一次)
    onLaunch: function (options) {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs);
        // console.log(options.scene);
    },
    onShow: function () {

    },
    onError: function (msg) {//小程序发生脚本错误,或者api调用失败时,会触发onError,并带上错误信息
        console.log(msg)
    },
    //进入页面判断是否有open_session
    loginPage: function (cb) {
        var that = this;
        if (this.globalData.open_session) {
            var timeNow = Date.now();
            var session_time = this.globalData.session_time;
            var differenceTime = timeNow - session_time;
            if (differenceTime > 432000000) {
                getSession(timeNow)
            } else {
                typeof cb == "function" && cb(this.globalData.user_id)
            }
        } else {
            getSession()
        }
    },

    //获取open_session
    getSession() {
        //获取code
        wx.login({
            success: function (login) {
                var code = login.code;
                that.globalData.code = code;
                //获取encryptedData和iv
                wx.getUserInfo({
                    success: function (res) {
                        console.log("这里是wx.getUserInfo")
                        console.log(res)
                        that.globalData.userInfo = res.userInfo;
                        that.globalData.encryptedData = res.encryptedData;
                        that.globalData.iv = res.iv;
                        typeof cb == "function" && cb(that.globalData.userInfo);
                        wx.request({
                            url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
                            data: {
                                code: code,
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log("这里是获取到encryptedData,iv后调用returnOauth")
                                console.log(res);
                                //在globalData里存入open_session,session_time,user_id;
                                that.globalData.open_session = res.data.open_session;
                                that.globalData.session_time = Date.now();
                                that.globalData.user_id = res.data.user_id;
                                console.log(that.globalData.session_time)
                                wx.setStorageSync("user_id", res.data.user_id)
                            },
                            fail: function () {
                                console.log("调用returnOauth失败")
                            }
                        })
                    },
                    fail: function (res) {
                        wx.request({
                            url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
                            data: {
                                code: code,
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log("这里是没获取到encryptedData,iv后调用returnOauth")
                                console.log(res);
                                //在globalData里存入open_session,session_time,user_id;
                                that.globalData.open_session = res.data.open_session;
                                that.globalData.session_time = Date.now();
                                that.globalData.user_id = res.data.user_id;
                                console.log(that.globalData.session_time)
                                wx.setStorageSync("user_id", res.data.user_id)
                            },
                            fail: function () {
                                console.log("向后台发送信息失败")
                            },
                        })
                    },
                })
            }
        })
    },

    //进行授权验证
    getUserInfo: function (cb) {
        var that = this;
        //如果全局变量里有userInfo就去执行cb函数,如果全局变量里没有userInfo就去调用授权接口
        if (this.globalData.userInfo) {
            console.log("全局变量userInfo存在")
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            console.log("全局变量userInfo不存在")
            //调用登录接口
            wx.login({
                success: function (login) {
                    var code = login.code;
                    that.globalData.code = code;
                    //获取用户信息
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("这里是wx.getUserInfo")
                            console.log(res)
                            that.globalData.userInfo = res.userInfo;
                            that.globalData.encryptedData = res.encryptedData;
                            that.globalData.iv = res.iv;
                            typeof cb == "function" && cb(that.globalData.userInfo);
                        },
                        fail: function (res) {
                            console.log(res)
                        },
                        complete: function () {
                            //如果已经存在session_time就进行比较,如果不没有就建一个session_time;
                            if (that.globalData.session_time) {
                                var timeNow = new (Date.now())
                                console.log(that.globalData.session_time, timeNow)
                            } else {
                                that.checkLogin(that);
                            }
                        }
                    })
                }
            })
        }
    },

    //登录状态维护
    checkLogin: function (that) {
        var code = that.globalData.code;
        var encryptedData = that.globalData.encryptedData;
        var iv = that.globalData.iv;
        //判断用户是否授权了小程序
        if (encryptedData) {
            wx.request({
                url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
                data: {
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv
                },
                method: 'POST',
                success: function (res) {
                    console.log("这里是获取到UserInfo后调用returnOauth")
                    console.log(res);
                    that.globalData.open_session = res.data.open_session;
                    that.globalData.session_time = Date.now();
                    that.globalData.user_id = res.data.user_id;
                    console.log(that.globalData.session_time)
                    wx.setStorageSync("user_id", res.data.user_id)
                },
                fail: function () {
                    console.log("向后台发送信息失败")
                }
            })
        } else {
            wx.request({
                url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
                data: {
                    code: code,
                },
                method: 'POST',
                success: function (res) {
                    console.log("这里是没拿到UserInfo后调用returnOauth")
                    console.log(res);
                    that.globalData.open_session = res.data.open_session;
                    that.globalData.session_time = Date.now();
                    that.globalData.user_id = res.data.user_id;
                    console.log(that.globalData.session_time)
                    wx.setStorageSync("user_id", res.data.user_id)
                },
                fail: function () {
                    console.log("向后台发送信息失败")
                },
            })
        }
    },

    //微信登录状态维护
    checkSession: function () {
        wx.checkSession({
            success: function () {
            },
            fail: function () {
                //登录态过期
                wx.login() //重新登录
            }
        })
    },

    //查看缓存
    cacheCheck: function () {
        var res = wx.getStorageInfoSync();
        console.log(res)
    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新")
        wx.stopPullDownRefresh()
    },

    // user_id为空时,返回首页或者完善信息
    noUserId: function () {
        wx.showModal({
            title: "提示",
            content: "请先绑定个人信息",
            success: function (res) {
                console.log(res)
                if (res.confirm == true) {
                    wx.navigateTo({
                        url: '/pages/myProject/personInfo/personInfo',
                    })
                } else {
                    wx.switchTab({
                        url: '/pages/resource/resource',
                    })
                }
            }
        })
    },

    //test
    hello: function () {
        console.log("TEST")
    },

    //初始本地缓存
    globalData: {
        error: 0,
        url: "https://dev.weitianshi.cn"
    }
});