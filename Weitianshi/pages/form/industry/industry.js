var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url
// 所属领域
var initialArr = {};//初始数组
var save = true;//是否删除缓存
Page({
    data: {
        industryTags: {
            tagsData: '',
            bindEvent: "checkboxChange"
        }
    },
    onLoad: function (options) {
        var that = this;
        var options = options;
        var current = options.current;
        var industryTags = this.data.industryTags;

        // 0:发布融资项目  1:发布投资需求 2:维护我的项目 3:发布投资案例
        //设置模版数据
        if (current == 0) {
            industryTags.tagsData = wx.getStorageSync("industryCurrent0") || app.globalData.industry;
        } else if (current == 1) {
            industryTags.tagsData = wx.getStorageSync("industryCurrent1") || app.globalData.industry;
        } else if (current == 2) {
            industryTags.tagsData = wx.getStorageSync("industryCurrent2") || app.globalData.industry;
            console.log(industryTags.tagsData)
        } else if (current == 3) {
            industryTags.tagsData = wx.getStorageSync("industryCurrent3") || app.globalData.industry;
        }
        that.setData({
            current: current,
            industryTags: industryTags,
        })
    },

    //点击选中标签
    checkboxChange(e) {
        let tags = this.data.industryTags;
        let that = this;
        let cb = function (tags) {
            that.setData({
                industryTags: tags
            })
        }
        let checkObject = app.tagsCheck(that, rqj, e, tags, cb)
        this.setData({
            contactsFilter1: checkObject
        })
        console.log(checkObject)
    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    },


    //点击确定
    certain() {
        let current = this.data.current;
        if (current == 0) {
            wx.setStorageSync("industryCurrent0", this.data.industryTags.tagsData);
        } else if (current == 1) {
            wx.setStorageSync("industryCurrent1", this.data.industryTags.tagsData);
        } else if (current == 2) {
            wx.setStorageSync("industryCurrent2", this.data.industryTags.tagsData);
        } else if (current == 3) {
            wx.setStorageSync("industryCurrent3", this.data.industryTags.tagsData);
        }
        wx.navigateBack({
            delta: 1,
        })
    },
});