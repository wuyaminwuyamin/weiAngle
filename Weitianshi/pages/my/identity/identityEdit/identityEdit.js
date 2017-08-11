var rqj = require('../../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        array: ['是', '否']
    },
    onLoad: function (option) {
        let that = this;
        let authenticate_id = option.authenticate_id;
        // group_id 18:买方FA 19:卖方FA  6:投资人 3:创业者 8:其他
        let group_id = option.group_id;
        let user_id = wx.getStorageSync('user_id');
        that.setData({
            authenticate_id: authenticate_id,
            group_id: group_id
        })
        //请求数据
        wx.request({
            url: url_common + '/api/user/getUserBasicInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res);
                let user_info = res.data.user_info;
                let invest_info = res.data.invest_info;
                if (invest_info.invest_industry) {
                    let invest_industryList = invest_info.invest_industry;
                    invest_industryList.forEach((x, index) => {
                        invest_industryList[index] = x.industry_name;

                    })
                }
                that.setData({
                    user_info: user_info
                })
            }
        })
    },
    onShow: function () {

    },
    // 姓名type:0 手机type:1 品牌type:2 公司type:3 职位type:4 邮箱type:5
    //
    writeNewThing: function (e) {
        let type = e.currentTarget.dataset.type;
        console.log(type)
        let writeNameValue = this.data.user_info.user_real_name;
        let writeMobile = this.data.user_info.user_mobile;
        let writeBrand = this.data.user_info.user_brand;
        let writeCompany = this.data.user_info.user_company_name;
        let writeCareer = this.data.user_info.user_company_career;
        let writeEmail = this.data.user_info.user_email;
        if (type == 0) {
            wx.navigateTo({
                url: '/pages/form/personInfo/personInfo?name=' + writeNameValue + '&&type=0',
            })
        } else if (type == 1) {
            wx.navigateTo({
                url: '/pages/form/personInfo/personInfo?mobile=' + writeMobile + '&&type=1',
            })
        } else if (type == 2) {
            wx.navigateTo({
                url: '/pages/form/personInfo/personInfo?brand=' + writeBrand + '&&type=2',
            })
        }
        else if (type == 3) {
            console.log("company")
            wx.navigateTo({
                url: '/pages/form/personInfo/personInfo?company=' + writeCompany + '&&type=3',
            })
        }
        else if (type == 4) {
            wx.navigateTo({
                url: '/pages/form/personInfo/personInfo?career=' + writeCareer + '&&type=4',
            })
        }
        else if (type == 5) {
            wx.navigateTo({
                url: '/pages/form/personInfo/personInfo?email=' + writeEmail + '&&type=5',
            })
        }

    },
    // 上传名片
    scanIDcard: function () {
        console.log("上传名片")
        let user_id = wx.getStorageSync('user_id');
        let group_id = this.data.group_id;
        wx.chooseImage({
            success: function (res) {
                console.log(res)
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: url_common + '/api/user/uploadCard', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'user_id': user_id,
                        'authenticate_id': authenticate_id
                    },
                    success: function (res) {
                        var data = res.data
                    }
                })
            }
        })
    },
    // 跳转投资领域
    toIndustry: function () {
        wx.navigateTo({
            url: '/pages/form/industry/industry?current=2',
        })
    },
    // 跳转投资轮次
    toScale: function () {
        wx.navigateTo({
            url: '/pages/form/scale/scale',
        })
    },
    // 跳转投资金额
    toStage: function () {
        wx.navigateTo({
            url: '/pages/form/stage/stage',
        })
    },
    // 跳转投资地区
    toArea1: function () {
        wx.navigateTo({
            url: '/pages/form/area1/area1',
        })
    },
    // 申请加入FA行业联盟
    bindFAService: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            bindFAService_index: e.detail.value
        })
    },
    // FA服务
    addFAService: function (e) {
        this.setData({
            addFAService_index: e.detail.value
        })
    },
    // sass服务
    sass: function (e) {
        this.setData({
            sass_index: e.detail.value
        })
    },
    // 兼职FA
    partFA: function (e) {
        this.setData({
            partFA_index: e.detail.value
        })
    },
    // 需要FA顾问
    needFA: function (e) {
        this.setData({
            needFA_index: e.detail.value
        })
    },
    // 提交保存跳转
    submit: function () {
        console.log("提交成功")
        let user_id = wx.getStorageSync('user_id');
        let authenticate_id = this.data.authenticate_id;
        let group_id = this.data.group_id;
        // wx.request({
        //   url: url_common + '/api/user/saveUserAuthentication',
        //   data: {
        //     user_id: user_id,
        //     authenticate_id: authenticate_id,
        //     iden_name:,
        //     iden_company_name:,
        //     iden_company_career:,
        //     iden_email:,
        //   },
        //   method: 'POST',
        //   success: function (res) {
        //     console.log(res);

        //   }
        // })




        wx.navigateTo({
            url: '/pages/my/identity/identityResult/identityResult?authenticate_id=' + authenticate_id,
        })
    }

})