var rqj = require('../Template/Template.js')
var app = getApp()
Page({
  data: {
    userInfo: {},
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
  },
  //载入页面
  onLoad:function(){

  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
    var user_id = wx.getStorageSync('user_id');
    var loadData = wx.getStorageSync("loadData");
    // console.log(user_id, current);
    if (current == 1) {
      //载入寻找项目数据
      wx.request({
        url: 'https://www.weitianshi.com.cn/api/investors/getMatchProjects',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          // console.log(res);
          // var scale=4;
          if (res.data.status_code !== 440004) {
            var yourProject = res.data.data.projects;
            // var pro_scale=yourProject.pro_scale;
            // var new_scale=[]
            // for(var i=0;i<pro_scale.length;i++){
            //   var isSame=0;
            //     if(pro_scale.scale_id==4){

            //     }
            // }
            // console.log(yourProject);
            that.setData({
              yourProject: yourProject,
              hasPublic: 1,
              investor_id: res.data.data.investor_id
            })
          } else {
            that.setData({
              hasPublic: 0
            })
          }
        }
      })
    }


  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
});