var app = getApp();
var url = app.globalData.url;
Page({
    data: {
        describe: "",
        industryValue: "选择领域",
        belongArea: "选择城市",
        stage_index: 0,
        stageValue: [],
        stageId: [],
        scale_index: 0,
        scaleValue: [],
        tips: ["其他", "独家签约", "非独家"],
        tipsIndex: 4,
        console_stage: "",
        console_scale: "",
        console_tips: "",
        error: '0',
        error_text: "",
        loading: '0'

    },
    onLoad: function (options) {
        var that = this;
        var user_id = options.user_id;
        var pro_id = options.pro_id;
        var stageValue = [];
        var stageId = [];
        var scaleValue = [];
        var scaleId = [];
        this.setData({
            pro_id: pro_id,
            user_id: user_id
        })
        // 获取项目分类
        wx.request({
            url: url + '/api/category/getWxProjectCategory',
            method: 'POST',
            success: function (res) {
                var thisData = res.data.data;
                wx.setStorageSync('area', thisData.area);
                wx.setStorageSync('industry', thisData.industry);
                wx.setStorageSync('scale', thisData.scale);
                wx.setStorageSync('stage', thisData.stage);
                //填入项目阶段和期望融资
                var scale = wx.getStorageSync('scale');
                var stage = wx.getStorageSync('stage');

                scale.unshift({
                    scale_id: 0,
                    scale_money: "选择融资"
                });
                stage.unshift({
                    stage_id: 0,
                    stage_name: "选择阶段"
                });

                //循环出阶段和融资的数组
                for (var i = 0; i < stage.length; i++) {
                    stageValue.push(stage[i].stage_name)
                    stageId.push(stage[i].stage_id)
                }
                for (var i = 0; i < scale.length; i++) {
                    scaleValue.push(scale[i].scale_money)
                    scaleId.push(scale[i].scale_id)
                }
                that.setData({
                    stageValue: stageValue,
                    stageId: stageId,
                    scaleValue: scaleValue,
                    scaleId: scaleId
                })
            },
        })
        // 获取项目信息
        wx.request({
            url: url + '/api/project/showProjectDetail',
            data: {
                user_id: options.user_id,
                pro_id: options.pro_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var theData = res.data.data;
                var describe = theData.pro_intro;
                var industry = theData.pro_industry;
                var industryValue = [];
                var industryId = [];
                var stage_index = stageValue.indexOf(theData.pro_stage.stage_name);
                var scale_index = scaleValue.indexOf(theData.pro_scale.scale_money);
                var tipsIndex = theData.is_exclusive;
                var belongArea = theData.pro_area.area_title;
                var provinceNum = theData.pro_area.pid;
                var cityNum = theData.pro_area.area_id;
                console.log(provinceNum,cityNum)
                // 对项目的所属领域进行处理
                if (industry) {
                    for (var i = 0; i < industry.length; i++) {
                        industryValue.push(industry[i].industry_name);
                        industryId.push(industry[i].industry_id)
                    }
                }
                wx.setStorage({
                    key: 'm_domainValue',
                    data: industryValue,
                });
                wx.setStorage({
                    key: 'm_domainId',
                    data: industryId,
                })
                that.setData({
                    describe: describe,
                    industryValue: industryValue,
                    industryId: industryId,
                    stage_index: stage_index,
                    scale_index: scale_index,
                    tipsIndex: tipsIndex,
                    belongArea: belongArea,
                    provinceNum: provinceNum,
                    cityNum: cityNum
                })

            },
            fail: function (res) {
                wx.showToast({
                    title: res.error_msg
                })
            },
        })
    },
    onShow: function () {
        var that = this;
        var industryValue = wx.getStorageSync('m_domainValue');
        var industryId = wx.getStorageSync('m_domainId');
        var belongArea = wx.getStorageSync('m_belongArea') || this.data.belongArea;
        var provinceNum = wx.getStorageSync("m_provinceNum");
        var cityNum = wx.getStorageSync('m_cityNum')
        this.setData({
            industryValue: industryValue,
            industryId: industryId,
            belongArea: belongArea,
        })
        if(cityNum){
            this.setData({
                provinceNum:provinceNum,
                cityNum:cityNum
            })
        }
    },

    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },

    //文本框输入
    bindTextAreaBlur: function (e) {
        var that = this;
        wx.setStorageSync('describe', e.detail.value);
        that.setData({
            describe: e.detail.value
        })
    },

    // 选择领域
    industry: function () {
        var industryValue = this.data.industryValue;
        var industryId = this.data.industryId;
        console.log(typeof industryValue)
        wx.navigateTo({
            url: '/pages/industry/industry?current=2&&industryValue=' + industryValue + '&&industryId=' + industryId
        })
    },

    //是否独家的效果实现
    tipsOn: function (e) {
        var that = this;
        console.log(e.target.dataset)
        that.setData({
            tipsIndex: e.target.dataset.tipsIndex
        })
    },

    //项目阶段
    stage: function (e) {
        this.setData({
            stage_index: e.detail.value,
        });
    },

    //期望融资
    scale: function (e) {
        this.setData({
            scale_index: e.detail.value,
        });
    },

    //上传BP
    upLoad: function () {
        wx.navigateTo({
            url: '../scanCode/scanCode',
        })
    },

    //点击发布
    public: function () {
        var that = this;
        var describe = this.data.describe;
        var industryValue = this.data.industryValue;
        var industryId = this.data.industryId;
        var provinceNum = this.data.provinceNum;
        var cityNum = this.data.cityNum;
        var stageId = this.data.stageId;
        var scaleId = this.data.scaleId;
        var stage_index = this.data.stage_index;
        var scale_index = this.data.scale_index;
        var console_stage = stageId[stage_index];
        var console_scale = scaleId[scale_index];
        var tipsIndex = this.data.tipsIndex;
        var user_id = wx.getStorageSync('user_id');
        var pro_id = this.data.pro_id;
        console.log(user_id, describe, industryId, console_stage, console_scale, provinceNum, cityNum, tipsIndex)
        if (describe !== "" && industryValue !== "选择领域" && console_stage !== 0 && console_scale != 0 && provinceNum !== 0 && cityNum !== 0 && tipsIndex !== 4) {
            wx.request({
                url: url + '/api/project/updateProject',
                data: {
                    user_id: user_id,
                    pro_id: pro_id,
                    pro_intro: describe,
                    industry: industryId,
                    pro_finance_stage: console_stage,
                    pro_finance_scale: console_scale,
                    pro_area_province: provinceNum,
                    pro_area_city: cityNum,
                    is_exclusive: tipsIndex
                },
                method: 'POST',
                success: function (res) {
                    if (res.status_code = 2000000) {
                        wx.switchTab({
                            url: '../../resource/resource'
                        });
                    } else {
                        wx.showToast({
                            title: res.status_code
                        })
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: "维护项目失败"
                    })
                },
            })
        } else {
            that.setData({
                error: "1"
            });
            var errorTime = setTimeout(function () {
                that.setData({
                    error: "0"
                });
                // console.log('提示已消失')
            }, 1500);

            if (describe == "") {
                that.setData({
                    error_text: "介绍不能为空"
                })
            } else if (industryId == 0) {
                that.setData({
                    error_text: "领域不能为空"
                })
            } else if (console_stage == 0) {
                that.setData({
                    error_text: "轮次不能为空"
                })
            } else if (console_scale == 0) {
                that.setData({
                    error_text: "金额不能为空"
                })
            } else if (provinceNum == 0 || cityNum == 0) {
                that.setData({
                    error_text: "地区不能为空"
                })
            } else if (tips == 4) {
                that.setData({
                    error_text: "请选择是否独家"
                })
            }

        }

    }
});