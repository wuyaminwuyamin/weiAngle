var app=getApp();
var url=app.globalData.url;
Page({
  data: {

  },
  onLoad: function (options) {
    var that = this;
    var user_id = wx.getStorageSync('user_id')
    console.log(user_id)

    //获取我的项目 
    wx.request({
      url: url+'/api/project/getMyProject',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        var myProject = res.data.data;
        var length = myProject.length;
        console.log(myProject)
        wx.setStorageSync('proLength', length);
        that.setData({
          myProject: myProject,
        });
      }
    })
  },
  //项目详情
  detail: function (e) {
    var thisData = e.currentTarget.dataset;
    var id = thisData.id;
    console.log(thisData)
    wx.navigateTo({
      url: '../../myProject/projectDetail/projectDetail?id='+id
    })
  },
  // 新增项目
  addProject() {
    wx.navigateTo({
      url: '../../myProject/publishProject/publishProject',
    })
  }
})