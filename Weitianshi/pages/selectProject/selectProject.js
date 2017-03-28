var rqj = require('../Template/Template.js')
Page({
  data: {
    slectProject: '',
    page: 1,
    page_end: false
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id')
    wx.request({
      url: 'https://www.weitianshi.com.cn/api/project/getSelectedProjects',
      data: {
        user_id: user_id
      },
      method: 'POST',

      success: function (res) {
        console.log(res);
        var slectProject = res.data.data;
        that.setData({
          slectProject: slectProject
        })
      }
    })
  },

  //触底加载
  loadMore: function () {
    console.log("正在加载更多")
    var that = this;
    var page = this.data.page
    var user_id = wx.getStorageSync('user_id');
    var page_end = this.data.page_end;
    if (page_end == false) {
      wx.showToast({
        title: 'loading...',
        icon: 'loading'
      })
      page++;
      that.setData({
        page: page,
      });
      wx.request({
        url: 'https://www.weitianshi.com.cn/api/project/getSelectedProjects',
        data: {
          user_id: user_id,
          page: page
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          var slectProject_new = res.data.data;
          var slectProject = that.data.slectProject;
          for (var i = 0; i < slectProject_new.length; i++) {
            slectProject.push(slectProject_new[i])
          }
          that.setData({
            slectProject: slectProject,
            page_end: res.data.page_end
          })
        }
      })
    } else {
      rqj.errorHide(that, '没有更多了', 3000)
    }

  },

  //项目详情
  detail: function (e) {
    var thisData = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../yourProject/yourDetail?id=' + thisData.id
    })
  },
  //分享当前页面
  onShareAppMessage: function () {
    return {
      title: '来微天使找优质项目',
      path: '/pages/selectProject/selectProject'
    }
  }
})