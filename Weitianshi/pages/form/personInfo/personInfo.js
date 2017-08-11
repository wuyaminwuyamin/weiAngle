var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {

  },

  onLoad: function (options) {
    console.log(options)
    let user_name = options.name;
    let user_mobile = options.mobile;
    let user_brand = options.brand;
    let user_company = options.company;
    console.log(user_company)
    let user_career = options.career;
    let user_email = options.email;
    let type = options.type;
    let that = this;
    that.setData({
      user_name: user_name,
      user_mobile: user_mobile,
      user_brand: user_brand,
      user_company: user_company,
      user_career: user_career,
      user_email: user_email,
      type: type
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  nameEdit: function (e) {
    let user_name = e.detail.value;
    console.log(user_name)
    this.setData({
      user_name: user_name
    })
  },
  telEdit: function (e) {
    let user_tel = e.detail.value;
    console.log(user_tel)
    this.setData({
      user_tel: user_tel
    })
  },
  brandEdit: function (e) {
    let user_brand = e.detail.value;
    console.log(user_brand)
    this.setData({
      user_brand: user_brand
    })
  },
  companyEdit: function (e) {
    let user_company_name = e.detail.value;
    console.log(user_company_name)
    this.setData({
      user_company_name: user_company_name
    })
  },
  careerEdit: function (e) {
    let user_career = e.detail.value;
    console.log(user_career)
    this.setData({
      user_career: user_career
    })
  },
  emailEdit: function (e) {
    let user_email = e.detail.value;
    console.log(user_email)
    this.setData({
      user_email: user_email
    })
  },
  save: function () {
    let user_id = wx.getStorageSync('user_id');
    let user_name = this.data.user_name;
    let user_tel = this.data.user_tel;
    let user_brand = this.data.user_brand;
    let user_company_name = this.data.user_company_name;
    let user_career = this.data.user_career;
    let user_email = this.data.user_email;
    let type = this.data.type;
    let pages = getCurrentPages();
    let currPage=pages[pages.length-1];
    let prevPage=pages[pages.length-2];
    let user_info = prevPage.data.user_info;
    console.log(pages);
    console.log(currPage);

    // 姓名type:0 手机type:1 品牌type:2 公司type:3 职位type:4 邮箱type:5
    if (type == 0) {
        user_info.user_real_name=user_name;
        prevPage.setData({
            user_info:user_info
        })
        wx.navigateBack({
            delta:1
        })
    } else if (type == 1){
        user_info.user_tel = user_tel;
        prevPage.setData({
            user_info: user_info
        })
        wx.navigateBack({
            delta: 1
        })
    } else if (type == 2) {
        user_info.user_brand = user_brand;
        prevPage.setData({
            user_info: user_info
        })
        wx.navigateBack({
            delta: 1
        })
    } else if (type == 3) {
        user_info.user_company_name = user_company_name;
        prevPage.setData({
            user_info: user_info
        })
        wx.navigateBack({
            delta: 1
        })
    } else if (type == 4) {
        user_info.user_career = user_career;
        prevPage.setData({
            user_info: user_info
        })
        wx.navigateBack({
            delta: 1
        })
    } else if (type == 5) {
        user_info.user_email = user_email;
        prevPage.setData({
            user_info: user_info
        })
        wx.navigateBack({
            delta: 1
        })
    }
  }
})