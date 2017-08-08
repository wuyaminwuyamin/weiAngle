// pages/search/search1/search1.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {
      tags:'',
      com_id:0
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },
  //获取输入内容
  inputValue: function (e) {
    console.log(e)
    let companyName = e.detail.value;
    let that = this;
    that.setData({
      companyName: companyName
    })
  },
  // 查找公司名字
  searchCompany: function () {
    let that = this;
    let companyName = this.data.companyName;
    var user_id = wx.getStorageSync('user_id');
    console.log(companyName);
    let com_id = this.data.com_id;
    wx.request({
      url: url_common + '/api/dataTeam/selectCompany',
      data: {
        user_id: user_id,
        company_name: companyName
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let company = res.data.data;
        
        that.setData({
          company : company,
          com_id: com_id
        })
      }
    })
  },
  // 选择其中的一个
  checkOne:function(e){
    console.log(e)
    let tags = e.currentTarget.dataset.id;
    let company_name = e.currentTarget.dataset.name;
    console.log(company_name)
    let that = this;
    that.setData({
      com_id : tags,
      company_name: company_name
    })

  },
  // 保存公司名称
  save: function () {
    console.log("保存")
  }
}) 