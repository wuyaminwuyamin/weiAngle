var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var save = true;
Page({
    data: {
        describe: "",
        domainValue: "选择领域",
        belongArea: "选择城市",
        stage: [],
        stage_index: 0,
        stage_arry: [],
        expect: [],
        expect_index: 0,
        expect_arry: [],
        tips: ["其他", "独家签约", "非独家"],
        tips_index: 4,
        console_stage: "",
        console_expect: "",
        console_tips: "",
        error: '0',
        error_text: "",
        loading: '0'

    },
    onLoad: function () {
        // console.log("this is onLoad");
        var that = this;
        //初始化
        wx.setStorageSync('enchangeValue', []);
        wx.setStorageSync('enchangeId', []);
        wx.setStorageSync('enchangeCheck', [])
        wx.setStorageSync('describe', "");
        wx.setStorageSync('domainValue', "选择领域");
        wx.setStorageSync('domainId', []);
        wx.setStorageSync('console_stage', 0);
        wx.setStorageSync('console_expect', 0);
        wx.setStorageSync('belongArea', "选择城市");
        wx.setStorageSync('provinceNum', 0);
        wx.setStorageSync('cityNum', 0);
        wx.setStorageSync('tips', 4);
        //请求地区,标签,期望融资,项目阶段数据
        wx.request({
            url: url+'/api/category/getWxProjectCategory',
            method: 'POST',
            success: function (res) {
                console.log("各种条目分类")
                console.log(res)
                var thisData = res.data.data;
                wx.setStorageSync('area', thisData.area);
                wx.setStorageSync('industry', thisData.industry);
                wx.setStorageSync('scale', thisData.scale);
                wx.setStorageSync('stage', thisData.stage);
                //填入项目阶段和期望融资
                var scale = wx.getStorageSync('scale');
                var stage = wx.getStorageSync('stage');
                var expect_arry = [];
                var stage_arry = [];
                // console.log(scale, stage);
                scale.unshift({
                    scale_id: 0,
                    scale_money: "选择融资"
                });
                stage.unshift({
                    stage_id: 0,
                    stage_name: "选择阶段"
                });
                that.setData({
                    stage: stage,
                    expect: scale
                });

                for (var i = 0; i < stage.length; i++) {
                    stage_arry.push(stage[i].stage_name)
                }
                for (var b = 0; b < scale.length; b++) {
                    expect_arry.push(scale[b].scale_money)
                }
                that.setData({
                    stage_arry: stage_arry,
                    expect_arry: expect_arry
                })
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })

    },
    //页面显示
    onShow: function () {
        // console.log("this is onShow")
        var that = this;

        //填入所属领域,项目介绍,所在地区
        var that = this;
        var domainValue = wx.getStorageSync('domainValue');
        var domainId = wx.getStorageSync('domainId');
        // 项目介绍
        var describe = wx.getStorageSync('describe');
        // 所在地区
        var belongArea = wx.getStorageSync('belongArea');
        // 省的信息
        var provinceNum = wx.getStorageSync('provinceNum');
        // 城市信息
        var cityNum = wx.getStorageSync('cityNum');
        // console.log(domainValue, domainId, describe, belongArea, provinceNum, cityNum, this.data.tips_index);
        that.setData({
            domainValue: domainValue,
            domainId: domainId,
            describe: describe,
            belongArea: belongArea,
            provinceNum: provinceNum,
            cityNum: cityNum
        })
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

    //是否独家的效果实现
    tipsOn: function (e) {
        var that = this;
        that.setData({
            tips_index: e.target.dataset.tips
        })
    },

    //项目阶段
    stage: function (e) {
        this.setData({
            stage_index: e.detail.value,
            // console_stage: this.data.stage[this.data.stage_index].stage_id,
        });
    },

    //期望融资
    expect: function (e) {
        this.setData({
            expect_index: e.detail.value,
            console_expect: this.data.expect[this.data.expect_index].scale_id,
        });
        // console.log(this.data.expect_index)
    },

    //上传BP
    upLoad: function () {
        wx.navigateTo({
            url: '../scanCode/scanCode',
        })
    },


    //点击发布
    public: function () {
        save = !save;
        var that = this;
        var theData = that.data;
        var describe = this.data.describe;
        var domainValue = this.data.domainValue;
        var domainId = this.data.domainId;
        var provinceNum = this.data.provinceNum;
        var cityNum = this.data.cityNum;
        var console_stage = this.data.stage[this.data.stage_index].stage_id;
        var console_expect = this.data.expect[this.data.expect_index].scale_id;
        var tips = this.data.tips_index;
        var user_id = wx.getStorageSync('user_id');
        // console.log(user_id, describe, domainId, console_stage, console_expect, provinceNum, cityNum, tips)
        if (describe !== "" && domainValue !== "选择领域" && console_stage !== 0 && console_expect != 0 && provinceNum !== 0 && cityNum !== 0 && tips !== 4) {
            wx.request({
                url: url+'/api/project/insertProject',
                data: {
                    user_id: user_id,
                    pro_intro: describe,
                    industry: domainId,
                    pro_finance_stage: console_stage,
                    pro_finance_scale: console_expect,
                    pro_area_province: provinceNum,
                    pro_area_city: cityNum,
                    is_exclusive: tips
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)

                    //数据清空
                    wx.setStorageSync('project_id', res.data.project_index);
                    wx.setStorageSync('describe', "");
                    wx.setStorageSync('domainValue', "选择领域");
                    wx.setStorageSync('domainId', []);
                    wx.setStorageSync('console_stage', 0);
                    wx.setStorageSync('console_expect', 0);
                    wx.setStorageSync('belongArea', "选择城市");
                    wx.setStorageSync('provinceNum', 0);
                    wx.setStorageSync('cityNum', 0);
                    wx.setStorageSync('tips', 4);
                    wx.setStorageSync('enchangeCheck', [])
                    wx.setStorageSync('enchangeValue', []);
                    wx.setStorageSync('enchangeId', []);
                    wx.switchTab({
                        url: '../../resource/resource'
                    });
                    
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
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
            } else if (domainId == 0) {
                that.setData({
                    error_text: "领域不能为空"
                })
            } else if (console_stage == 0) {
                that.setData({
                    error_text: "轮次不能为空"
                })
            } else if (console_expect == 0) {
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

    },
    onUnload: function () {
      // 页面关闭
      if (save) {
        wx.setStorageSync('enchangeValue', []);
        wx.setStorageSync('enchangeId', []);
        wx.setStorageSync('enchangeCheck', [])
        wx.setStorageSync('payenchangeValue', [])
        wx.setStorageSync('payenchangeId', [])
        wx.setStorageSync('payenchangeCheck', [])
        wx.setStorageSync('paymoneychangeValue', [])
        wx.setStorageSync('paymoneychangeId', [])
        wx.setStorageSync('paymoneyenchangeCheck', [])
        wx.setStorageSync('payareachangeValue', [])
        wx.setStorageSync('payareachangeId', [])
        wx.setStorageSync('payareaenchangeCheck', [])
        wx.setStorageSync('domainValue', []);
        wx.setStorageSync('domainId', '');
        wx.setStorageSync('y_domainValue', "选择领域");
        wx.setStorageSync('y_domainId', []);
        wx.setStorageSync('m_domainValue', []);
        wx.setStorageSync('m_domainId', []);
        wx.setStorageSync('y_payArea', "选择城市");
        wx.setStorageSync('y_payAreaId', []);;
        wx.setStorageSync('y_payStage', "选择阶段");
        wx.setStorageSync('y_payStageId', []);;
        wx.setStorageSync('y_payMoney', "选择金额");
        wx.setStorageSync('provinceNum', 0);
        wx.setStorageSync('cityNum', 0);

      }
    }
});