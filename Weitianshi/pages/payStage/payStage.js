var app=getApp();
var url=app.globalData.url;
Page({
    data: {
        payStage: [],
        checked: [],
        index: [],
        id: [],
        error: "0",
        error_text: ""
    },
    onLoad: function () {
        var that = this;
        var payStage = wx.getStorageSync('y_stage');
        // console.log("this is onLoad")
        that.setData({
            payStage: payStage
        });

        // console.log(this.data.checked, typeof this.data.checked)
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
        var payStage = this.data.payStage;
        var index = this.data.index;
        var thisData = e.currentTarget.dataset;
        var isCheck = thisData.check;
        var value = thisData.value;
        var idx = thisData.index;
        var id = e.currentTarget.id;

        if (index.indexOf(id) == -1) {
            checked.push(value);
            index.push(id)
        } else {
            // console.log(checked.indexOf(value), index.indexOf(id) + 1);
            checked.splice(checked.indexOf(value), 1);
            index.splice(index.indexOf(id), 1);
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
        var payStage = this.data.payStage;
        that.setData({
            error: "0"
        });

        if (checked.length > 5) {
            var that = this;
            that.setData({
                error: "1",
                error_text: "至多选择五个标签"
            });
            var time=setTimeout(function(){
                that.setData({
                    error:"0"
                })
            },1500)
        } else {

            //传值给myProject
            if (checked == "") {
                wx.setStorageSync('y_payStage', "选择阶段");
                wx.setStorageSync('y_payStageId', '');
                // wx.setStorageSync('domainChecked', checked)
            } else {
                wx.setStorageSync('y_payStage', checked);
                wx.setStorageSync('y_payStageId', index);
                // wx.setStorageSync('domainChecked', checked)
            }

            // console.log(checked, index);
            wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
            })
        }

    }


});