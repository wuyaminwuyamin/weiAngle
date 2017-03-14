Page({
  data: {
    slectProject: '',
    load: 0,
    page: 1
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
        // console.log(res);
        var slectProject = res.data.data;
        that.setData({
          slectProject: slectProject
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  //触底加载
  loadMore: function () {
    console.log("正在加载更多")
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    var that = this;

    page++;
    that.setData({
      page: page,
      load: 1
    });
    var user_id = wx.getStorageSync('user_id')
    wx.request({
      url: 'https://www.weitianshi.com.cn/api/project/getSelectedProjects',
      data: {
        user_id: user_id,
        page:page
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

  //项目详情
  detail:function(e){
    var thisData = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../yourProject/yourDetail?id=' + thisData.id
    })
  }
})