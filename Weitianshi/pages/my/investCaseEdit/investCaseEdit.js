var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    case_time: "请选择",
    industry: "请选择",
    stage: ["请选择"],
    stage_index: 0,
    buttonOne: {
      text: "保存"
    }
  },
  onShow: function (options) {
    var that = this;
    var industry = wx.getStorageSync('case_domainValue');
    var industryId = wx.getStorageSync('case_domainId')
    this.setData({
      industry: industry,
      industryId: industryId
    })
    wx.request({
      url: url + '/api/category/getWxProjectCategory',
      method: 'POST',
      success: function (res) {
        var stage = res.data.data.stage;
        var industry = res.data.data.industry;
        wx.setStorageSync('industry', industry)
        var stage_arr = [];
        var stageId = []; 
        stage.unshift({
          stage_id: 0,
          stage_name: "请选择"
        });
        for (var i = 0; i < stage.length; i++) {
          stage_arr.push(stage[i].stage_name);
          stageId.push(stage[i].stage_id)
        }
        stage = stage_arr;
        that.setData({
          stage: stage,
          stageId: stageId,
        })
      },
    })
  },
  case_name: function (e) {
    var that = this;
    var case_name = e.detail.value;
    that.setData({
      case_name: case_name
    })
  },
  case_industry: function (e) {
    wx.navigateTo({
      url: '/pages/industry/industry?current=' + 3,
    })
  },
  case_stage: function (e) {
    this.setData({
      stage_index: e.detail.value
    })
  },
  case_money: function (e) {
    var that = this;
    var case_money = e.detail.value;
    that.setData({
      case_money: case_money
    })
  },
  case_time: function (e) {
    this.setData({
      case_time: e.detail.value
    })
  },
  buttonOne: function () {
    var user_id = wx.getStorageSync('user_id');
    var case_name=this.data.case_name;
    var industry=this.data.industry;
    var case_industry=this.data.industryId;
    var stageId=this.data.stageId;
    var stage_index=this.data.stage_index;
    var case_stage=stageId[stage_index];
    var case_money=this.data.case_money;
    var case_time=this.data.case_time;
    console.log(case_name,industry,case_industry,case_stage,case_money,case_time)
    if (user_id && case_name!=undefined && case_industry!='' && case_stage !=0 && case_money !=undefined && case_time !='请选择') {
      wx.request({
        url: url + '/api/user/createUserProjectCase',
        data: {
          user_id:user_id,
          case_name:case_name,
          case_industry:case_industry,
          case_stage:case_stage,
          case_money:case_money,
          case_deal_time:case_time
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          wx.navigateBack({
            delta: 1,
          })
        },
        fail: function (res) {
          console.log(res)
        },
      })
    }
  },
})