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
    var enchangeValue = []
    var enchangeId = []
    var enchangeCheck = []

    //checkbox
    for (var i = 0; i < industry.length; i++) {
      if (enchangeValue.indexOf(industry[i].industry_name) != -1) {
        industry[i].checked = true;
      } else {
        industry[i].checked = false;
      }
      enchangeCheck.push(industry[i].checked)
    }
    that.setData({
      enchange: industry,
      current: current,
      checked: enchangeValue,
      index: enchangeId,
      enchangeCheck: enchangeCheck
    });
    console.log(this.data.enchangeCheck)
    console.log(this.data.checked)


  },

  //下拉刷新
  onPullDownRefresh: function () {
    // console.log("开启了下拉刷新");
    wx.stopPullDownRefresh()
  },

  //传值部份
  checkboxChange: function (e) {
    var that = this;
    var thisData = e.currentTarget.dataset;
    console.log(thisData)
    var e_index=thisData.index;
    var e_value=thisData.value;
    var e_checked=thisData.checked;
    e_checked=true
  },

  //可提供资源自定义添加
  offerAdd: function () {
    wx.showModal({
      title:"自定义内容"
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