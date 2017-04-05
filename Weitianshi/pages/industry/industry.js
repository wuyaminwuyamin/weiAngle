var app=getApp();
var url=app.globalData.url;
Page({
    data: {
        doMain: [],
        checked: [],
        index: [],
        id: [],
        error: "0",
        error_text: ""
    },
    onLoad: function (options) {
        // console.log("this is onLoad")
        var that = this;
        var industry = wx.getStorageSync('industry');
        var current = options.current;

        if (current == 0) {
            var domainValue = wx.getStorageSync('domainValue')
            var domainId = wx.getStorageSync('domainId')
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }
        } else if (current == 1) {
            var domainValue = wx.getStorageSync('y_domainValue')
            var domainId = wx.getStorageSync('y_domainId')
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }
        }

        //checkbox
        for (var i = 0; i < industry.length; i++) {
            if (domainValue.indexOf(industry[i].industry_name) != -1) {
                industry[i].checked = true;
            } else {
                industry[i].checked = false;
            }
        }
        wx.setStorageSync('industry', industry)

        that.setData({
            doMain: industry,
            current: current,
            checked: domainValue,
            index: domainId
        });
        

        console.log(this.data.checked,this.data.index)
    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    },

    //传值部份
    checkboxChange: function (e) {
        var that = this;
        var checked = this.data.checked;
        var doMain = this.data.doMain;
        var index = this.data.index;
        var thisData = e.currentTarget.dataset;
        var isCheck = thisData.check;
        var value = thisData.value;
        var idx = thisData.index;
        var id = e.currentTarget.id*1;
        if (index.indexOf(id) == -1) {
            checked.push(value);
            index.push(id)
        } else {
            // console.log(checked.indexOf(value), index.indexOf(id) + 1);
            checked.splice(checked.indexOf(value), 1);
            index.splice(index.indexOf(id), 1)
        }
        that.setData({
            checked: checked,
            index: index
        })
    },


    //点击确定
    certain: function () {
        var that = this;
        // var console_checked = this.data.checked.join();
        var checked = this.data.checked;
        var id = this.data.id;
        var index = this.data.index;
        var doMain = this.data.doMain;
        var current = this.data.current;
        that.setData({
            error: "0"
        });

        if (checked.length > 5) {
            var that = this;
            that.setData({
                error: "1",
                error_text: "至多选择五个标签"
            })
        } else {
            if (current == 0) {
                //传值给myProject
                if (checked == "") {
                    wx.setStorageSync('domainValue', "选择领域");
                    wx.setStorageSync('domainId', '');
                } else {
                    wx.setStorageSync('domainValue', checked);
                    wx.setStorageSync('domainId', index);
                }
            } else if (current == 1) {
                if (checked == "") {
                    wx.setStorageSync('y_domainValue', "选择领域");
                    wx.setStorageSync('y_domainId', '');
                } else {
                    wx.setStorageSync('y_domainValue', checked);
                    wx.setStorageSync('y_domainId', index);
                }
            }
            wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
            })
        }

    }


});