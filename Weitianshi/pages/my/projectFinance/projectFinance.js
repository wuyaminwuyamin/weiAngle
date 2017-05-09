var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    buttonOne: {
      text: "新增项目"
    }
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id')

    this.setData({
      text: "新增项目"
    })
    //获取我的项目 
    wx.request({
      url: url + '/api/project/getMyProject',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var myProject = res.data.data;
        var length = myProject.length;
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
    var index = thisData.index
    wx.navigateTo({
      url: '../../myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index + "&&currentTab=" + 0
    })
  },
  //编辑项目
  editDetail: function (e) {
    var id=e.currentTarget.dataset.id;
    var user_id = wx.getStorageSync('user_id')
    wx.navigateTo({
      url: '/pages/myProject/maintainProject/maintainProject?pro_id=' + id + "&&user_id=" + user_id,
    })
  },
  // 按钮一号
  buttonOne: function () {
    wx.navigateTo({
      url: '/pages/myProject/publishProject/publishProject',
    })

  }
})