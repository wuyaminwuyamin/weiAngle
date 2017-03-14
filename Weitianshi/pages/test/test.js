// pages/test/test.js
Page({
  data: {
    table: {
      title: ["日期", "值班人", "班次", "时间", "状态"],
      listData: [
        { "date": "2017-03-10", "name": "xx", "Shift": "早", "time": "8:00-10:00", "type": "正常" },
        { "date": "2017-03-10", "name": "xx", "Shift": "早", "time": "8:00-10:00", "type": "正常" },
        { "date": "2017-03-10", "name": "xx", "Shift": "早", "time": "8:00-10:00", "type": "正常" },
        { "date": "2017-03-10", "name": "xx", "Shift": "早", "time": "9:00-10:00", "type": "不正常" }
      ]
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})