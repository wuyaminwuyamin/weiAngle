// pages/my/projectFinance/projectFinance.js
Page({
  data: {

  },
  onLoad: function (options) {
    var that = this;
    var user_id = wx.getStorageSync('user_id')
    console.log(user_id)

    //获取我的项目 
    wx.request({
      url: 'https://www.weitianshi.com.cn/api/project/getMyProject',
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
  //编辑项目
  edit: function (e) {
    console.log(111)
    var pro_id = e.target.dataset.proId;
    wx.navigateTo({
      url: '../../myProject/projectDetail/projectDetail'
    })
  },
  // 新增项目
  addProject() {
    wx.navigateTo({
      url: '../../myProject/publishProject/publishProject',
    })
  }
})