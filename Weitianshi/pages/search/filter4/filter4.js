var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
var rqj = require('../../Template/Template.js');
Page({
    data: {
        industryData: [],
        industryId: [],
        industryName: [],
        stageData: [],
        stageId: [],
        stageName: [],
        industryTags: {
            tagsData: "",
            bindEvent: "industryChoose"
        },
        stageTags: {
            tagsData: "",
            bindEvent: "stageChoose"
        },
    },

    onLoad: function (options) {
        var that = this;
        var options = options;

        //设置模版数据
        var industryTags = this.data.industryTags;
        var stageTags = this.data.stageTags;
        
        industryTags.tagsData = wx.getStorageSync("contactsIndustry") || app.globalData.industry;
        stageTags.tagsData = wx.getStorageSync("contactsStage") || app.globalData.stage;

        that.setData({
            industryTags: industryTags,
            stageTags: stageTags,
        })

    },

    //领域选择
    industryChoose(e) {
        let tags = this.data.industryTags;
        let that = this;
        let cb = function (tags) {
            that.setData({
                industryTags: tags
            })
        }
        let checkObject = app.tagsCheck(that, rqj, e, tags, cb)
        this.setData({
            contactsFilter1:checkObject
        })
        console.log(checkObject)
    },

    //轮次选择
    stageChoose(e) {
        let tags = this.data.stageTags;
        let that = this;
        let cb = function (tags) {
            that.setData({
                stageTags: tags
            })
        }
        let checkObject = app.tagsCheck(that, rqj, e, tags, cb)
        this.setData({
            contactsFilter2: checkObject
        })
        console.log(checkObject)
    },

    //重置
    reset() {
        let industryTags = this.data.industryTags;
        let stageTags = this.data.stageTags;
        let industryData = industryTags.tagsData;
        let stageData = stageTags.tagsData;
        industryData.forEach((x) => {
            x.check = false
        });
        stageData.forEach((x) => {
            x.check = false
        })
        this.setData({
            industryTags: industryTags,
            stageTags: stageTags
        })
        /*wx.setStorageSync("contactsFilter1",'');
        wx.setStorageSync("contactsFilter2",'');*/
    },

    //确定
    certain(){
        console.log(this.data.industryTags, this.data.stageTags)
        wx.setStorageSync("contactsIndustry", this.data.industryTags.tagsData);
        wx.setStorageSync("contactsStage", this.data.stageTags.tagsData);
        wx.navigateBack({
            delta: 1,
        })
    },

    // 开启了下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },
})