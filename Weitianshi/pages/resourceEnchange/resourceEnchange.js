Page({
  data: {
    enchange: [],
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
    console.log(industry)
    var enchangeValue = wx.getStorageSync('enchangeValue')
    var enchangeId = wx.getStorageSync('enchangeId')
    if (enchangeValue == "选择领域") {
      enchangeValue = [];
      enchangeId = [];
    }



    //checkbox
    for (var i = 0; i < industry.length; i++) {
      if (enchangeValue.indexOf(industry[i].industry_name) != -1) {
        industry[i].checked = true;
      } else {
        industry[i].checked = false;
      }
    }
    wx.setStorageSync('industry', industry)

    that.setData({
      enchange: industry,
      current: current,
      checked: enchangeValue,
      index: enchangeId
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
    var checked = this.data.checked;
  
    var enchange = this.data.enchange;
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
    var enchange = this.data.enchange;
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

      //传值给myProject
      if (checked == "") {
        wx.setStorageSync('enchangeValue', "选择领域");
        wx.setStorageSync('enchangeId', '');
      } else {
        wx.setStorageSync('enchangeValue', checked);
        wx.setStorageSync('enchangeId', index);
      }


      console.log(checked, index);
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      })
    }

  }


});