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
    },
    stageTags:{
        tagsData:"",
        bindEvent:"stageChoose"
    }
  },

  onLoad: function (options) {
    var that = this;
    var options = options;
    var industryData = wx.getStorageSync('industry');//获取所属领域的全部信息
    var industryTags=this.data.industryTags;
    var stageData = wx.getStorageSync('stage');//获取轮次信息
    var stageTags = this.data.stageTags;

    industryTags.tagsData=industryData;
    stageTags .tagsData=stageData;
    that.setData({
      industryTags:industryTags,
      stageTags:stageTags
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