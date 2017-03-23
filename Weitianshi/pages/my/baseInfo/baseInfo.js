// pages/my/baseInfo/baseInfo.js
Page({
  data: {
    avatar: "",
    name: "张三",
    mobile: 18762670539,
    identity: "请选择",
    company: "微天使",
    career: "投资经理",
    email: "morganfly@126.com",
    describe: "",
    image: "http://wx.qlogo.cn/mmopen/vi_32/bTicibYm55RdTibZEHwic9thpr6MPWKI9ldicEdL7Ep2RkMFXHia3N6yapviaibVkQsib3SiaqNaSayFh0iajb6QgE9PcNZlA/0"
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  // 保存
  save: function () {
    console.log(1)
    wx.redirectTo({
      url: '../myInfoEdit/myInfoEdit',
    })
  },
  // 添加图片
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({
          image: res.tempFilePaths
        })
      }
    })
  },
})