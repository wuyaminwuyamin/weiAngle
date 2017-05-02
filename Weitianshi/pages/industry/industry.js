var app = getApp();
// 所属领域
var url = app.globalData.url;
Page({
    data: {
        // 名称
        doMain: [],
        // 选中
        checked: [],
        // 下标
        index: [],
        // 每一个名称的id值
        id: [],
        error: "0",
        error_text: ""
    },
    onLoad: function (options) {
        // console.log("this is onLoad")
        var that = this;
        var options = options;
        var industry = wx.getStorageSync('industry');
        var current = options.current;
        // 0:发布融资项目  1:发布投资需求 2:维护我的项目 3:发布投资案例

        if (current == 0) {
            var domainValue = wx.getStorageSync('domainValue')
            var domainId = wx.getStorageSync('domainId')
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }
            console.log(domainValue)
            console.log(typeof domainValue)
        } else if (current == 1) {
            var domainValue = wx.getStorageSync('y_domainValue')
            var domainId = wx.getStorageSync('y_domainId')

            if (!domainValue) {
                domainValue = [];
                domainId = [];
            }
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }

            console.log(domainValue)
            console.log(typeof domainValue)
        } else if (current == 2) {
            var domainValue = options.industryValue;
            var domainId = options.industryId;
            var domainValue = domainValue.split(",")
            var domainId = domainId.split(",")
            for (var i = 0; i < domainId.length; i++) {
                domainId[i] = domainId[i] * 1
            }
            if (domainValue == '选择领域') {
                domainValue = [];
                domainId = [];
            }
            console.log(domainValue, domainId)
            console.log(typeof domainValue)
        } else if (current == 3) {
            var domainValue = wx.getStorageSync('case_domainValue')
            var domainId = wx.getStorageSync('case_domainId')
            if (!domainValue) {
                domainValue = [];
                domainId = [];
            }
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }
        }

        //checkbox 便利industry
        for (var i = 0; i < industry.length; i++) {
            // indexof查找是否包含内容
            if (domainValue.indexOf(industry[i].industry_name) != -1) {
                industry[i].checked = true;
            } else {
                industry[i].checked = false;
            }
        }
        wx.setStorageSync('industry', industry)
        // 设置值
        that.setData({
            doMain: industry,
            current: current,
            checked: domainValue,
            index: domainId
        });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    },

    //传值部份
    checkboxChange: function (e) {
        var that = this;
        // 选中的名称,并有延迟
        var checked = this.data.checked;
        // 当前页面所有的内容,每一个都是对象
        var doMain = this.data.doMain;
        var index = this.data.index;
        var thisData = e.currentTarget.dataset;
        var isCheck = thisData.check;
        var value = thisData.value;
        var idx = thisData.index;
        // 当前选中项的id
        var id = e.currentTarget.id * 1;   
        console.log(index);
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
        // 选择的标签最多是5个
        if (checked.length > 5) {
            // 如果超过5个提示锁雾
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
            } else if (current == 2) {
                wx.setStorageSync('m_domainValue', checked);
                wx.setStorageSync('m_domainId', index);
            } else if (current == 3) {
                if (checked == "") {
                    wx.setStorageSync('case_domainValue', "选择领域");
                    wx.setStorageSync('case_domainId', '');
                } else {
                    wx.setStorageSync('case_domainValue', checked);
                    wx.setStorageSync('case_domainId', index);
                }
            }
            wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
            })
        }
    }

});