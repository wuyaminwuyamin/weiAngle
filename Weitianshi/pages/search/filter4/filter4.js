var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    industryData: [],
    industryId: [],
    industryName: [],
    stageData :[],
    stageId:[],
    stageName:[],
    industryTags:{
        tagsData:"",
        bindEvent:"industryChoose"
    }
  },

  onLoad: function (options) {
    var that = this;
    var options = options;
    var industryData = wx.getStorageSync('industry');//获取所属领域的全部信息
    var industryTags=this.data.industryTags;
    var stageData = wx.getStorageSync('stage');//获取轮次信息

    console.log(industryData,stageData)

    industryTags.tagsData=industryData;
    that.setData({
      industryData : industryData,
      stageData: stageData,
      industryTags:industryTags
    })
  },
//领域选择
industryChoose(e){
    console.log(1)
    console.log(e.currentTarget.dataset)
},
 // 开启了下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})