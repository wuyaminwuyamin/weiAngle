 
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
Page({
    data: {
        company: "",
        position: "",
        email: "",
        result: "1",
        error: "0",
        error_text: ''
    },
    //onLoad
    onLoad: function (options) {
        var that = this;
        console.log(options)
        var company = options.user_company;
        var position = options.user_career;
        var email = options.user_email;
        var user_id = wx.getStorageSync('user_id');
        console.log(user_id);
        wx.request({
            url: url+'/api/user/checkUserInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function(res){
                console.log(res);
                var complete = res.data.is_complete;
                if(res.data.status_code ==2000000 || res.data.status_code==0){
                    that.setData({
                        company: res.data.user_company_name,
                        position: res.data.user_company_career,
                        email: res.data.user_email,
                    })

                }
            },
            fail: function(res) {
                // fail\
            },
            complete: function(res) {
                // complete
                console.log(res);
            }
        });
        if (company == "null") {
            company = ''
        };
        if (position == "null") {
            position = ''
        };
        if (email == "null") {
            email = ''
        }
        that.setData({
            company: company,
            position: position,
            email: email,
        })




    },
    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新")
        wx.stopPullDownRefresh()
    },
    //公司项的特殊符号过滤和值的双向绑定
    company: function (e) {
        var that = this;
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var rs = "";
        var company = e.detail.value;
        // console.log(company)
        for (var i = 0; i < company.length; i++) {
            rs = rs + company.substr(i, 1).replace(pattern, '');
        }
        that.setData({
            company: rs
        })
    },

    //职位项的特殊符号过滤和值的双向绑定
    position: function (e) {
        var that = this;
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var rs = "";
        var position = e.detail.value;
        // console.log(position)
        for (var i = 0; i < position.length; i++) {
            rs = rs + position.substr(i, 1).replace(pattern, '');
        }
        that.setData({
            position: rs
        })
    },

    //邮箱验证
    checkEmail: function (e) {
        var that = this;
        var temp = e.detail.value;
        var email = this.data.email;
        // console.log(temp)
        var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!myreg.test(temp) && temp !== '') {
            // console.log('请输入有效的E_mail！');
            that.setData({
                result: "0"
            })
        } else {
            that.setData({
                result: "1"
            })
        }
        // console.log(temp);
        that.setData({
            email: temp
        })
    },

    //点击跳转
    backHome: function () {
        var that = this;
        var company = this.data.company;
        var position = this.data.position;
        var result = this.data.result;
        var error = this.data.error;
        var error_text = this.data.error_text;
        var email = this.data.email;
        var user_id = wx.getStorageSync('user_id');
        // console.log(typeof user_id, user_id);
        // console.log(company);
        // console.log(position);
        // console.log(result);

        if (result == "1" && company !== "" && position !== "") {
            //向后台发送公司信息
            wx.request({
                url: url + '/api/wx/updateUser',
                data: {
                    user_id: user_id,
                    user_company_name: company,
                    user_company_career: position,
                    user_email: email
                },
                method: 'POST',
                success: function (res) {
                    // console.log(res)
                    if (res.data.status_code == 2000000) {
                        // 从绑定人脉那边过来的
                        var followed_user_id = wx.getStorageSync('followed_user_id');
                        if (followed_user_id) {
                            wx.request({
                                url: url + '/api/user/followUser',
                                data: {
                                    follow_user_id: user_id,
                                    followed_user_id: followed_user_id
                                },
                                method: 'POST',
                                success: function (res) {
                                    if (res.data.status_code == 2000000) {
                                        wx.showModal({
                                            title: "提示",
                                            content: "添加人脉成功",
                                            showCancel: false,
                                            confirmText: "到人脉库",
                                            success: function () {
                                                wx.switchTab({
                                                    url: '/pages/network/network',
                                                })
                                            }
                                        })
                                    }
                                },
                            })
                        } else {
                            wx.switchTab({
                                url: "/pages/resource/resource"
                            });
                        }
                    }else{
                        wx.showModal({
                            title:"错误提示",
                            content:"用户已生成,但是公司,职位,邮箱信息绑定失败"
                        })
                    }
                },
            })
            //取消错误提示
            that.setData({
                error: '0'
            })
        } else {
            that.setData({
                error: '1'
            });
            if (company == '') {
                rqj.errorHide(that, "公司不能为空", 1500)
            } else if (position == '') {
                rqj.errorHide(that, "职位不能为空", 1500)
            } else {
                rqj.errorHide(that, "请正确填写邮箱", 1500)
            }

        }

    }
});