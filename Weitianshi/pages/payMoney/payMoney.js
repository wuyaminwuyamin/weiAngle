Page({
    data: {
        payMoney: [],
        checked: [],
        index: [],
        id: [],
        error: "0",
        error_text: ""
    },
    onLoad: function () {
        var that = this;
        var payMoney = wx.getStorageSync('y_scale');
        // console.log("this is onLoad")
        that.setData({
            payMoney: payMoney
        });

        // console.log(this.data.checked, typeof this.data.checked)
    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    },

    //传值部份
    radioCheck: function (e) {
        var that = this;
        var checked = this.data.checked;
        var payMoney = this.data.payMoney;
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
        var payMoney = this.data.payMoney;
        that.setData({
            error: "0"
        });

        //传值给myProject
        if (checked == "") {
            wx.setStorageSync('y_payMoney', "选择金额");
            wx.setStorageSync('y_payMoneyId', '');
            // wx.setStorageSync('domainChecked', checked)
        } else {
            wx.setStorageSync('y_payMoney', checked);
            wx.setStorageSync('y_payMoneyId', index);
            // wx.setStorageSync('domainChecked', checked)
        }

        // console.log(checked, index);
        wx.navigateBack({
            delta: 1 // 回退前 delta(默认为1) 页面
        })


    }


});