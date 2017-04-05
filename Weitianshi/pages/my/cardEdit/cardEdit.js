var app = getApp();
var url = app.globalData.url;
Page({
  data: {},
  onLoad: function (options) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: "user_id",
    })
    console.log(user_id)

    //获取用户信息
    wx.request({
      url: url + '/api/user/getUserAllInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          user_info: res.data.user_info,
          name: res.data.user_info.user_real_name,
          mobile:res.data.user_info.user_real_mobile,
          career:res.data.user_info.user_company_career,
          company:res.data.user_info.user_company_name,
          describe:res.data.user_info.user_intro
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  nameEdit: function (e) {
    var that = this;
    var name = e.detail.value;
    that.setData({
      name: name
    })
  },
  mobileEdit: function (e) {
    var that = this;
    var mobile = e.detail.value;
    console.log(mobile)
    that.setData({
      mobile: mobile
    })
  },
  companyEdit: function (e) {
    var that = this;
    var company = e.detail.value;
    console.log(company)
    that.setData({
      company: company
    })
  },
  careerEdit: function (e) {
    var that = this;
    var career = e.detail.value;
    console.log(career)
    that.setData({
      career: career
    })
  },
  eMailEdit: function (e) {
    var that = this;
    var eMail = e.detail.value;
    console.log(eMail)
    that.setData({
      eMail: eMail
    })
  },
  describeEdit: function (e) {
    var that = this;
    var describe = e.detail.value;
    that.setData({
      describe: describe
    })
  },
  save: function () {
    var name = this.data.name;
    var company = this.data.company;
    var career = this.data.career;
    var eMail = this.data.eMail;
    var describe = this.data.describe;
    var user_id=wx.getStorageSync('user_id')
    wx.request({
      url: url+'/api/wx/updateUser',
      data: {
        user_id:user_id,
        user_real_name:name,
        user_company_name:company,
        user_company_career:career,
        user_email:eMail,
        user_intro:describe
      },
      method: 'POST',
      success: function (res) {
        wx.switchTab({
          url: '../my',
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  }
})