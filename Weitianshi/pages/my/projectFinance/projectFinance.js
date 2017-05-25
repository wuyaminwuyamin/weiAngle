var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    buttonOne: {
      text: "新增项目",
      myProject: "",//项目融资数据的字段 
    },
    myPublicProject_page: 1,
    myPublicCheck: true,
    myPublic_page_end: false
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
        wx.setStorageSync('myProjectLength', length);
        that.setData({
          myProject: myProject,
        });
      }
    })
  },
  // 到底加載更多
  myPublicProject: function () {
    console.log(1);
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var myPublicProject_page = this.data.myPublicProject_page;
    var myPublicCheck = this.data.myPublicCheck;
    var myPublic_page_end = this.data.myPublic_page_end;
    console.log(user_id, myPublicProject_page, myPublicCheck)

    if (myPublicCheck) {
      if (user_id != '') {
        myPublicProject_page++;
        this.setData({
          myPublicProject_page: myPublicProject_page
        });
        wx.request({
          url: url + '/api/project/getMyProject',
          data: {
            user_id: user_id,
            page: myPublicProject_page,
          },
          method: 'POST',
          success: function (res) {
            console.log("分页加载项目融资")
            console.log(res);
            var myPublic_page_end = res.data.page_end;
            console.log(myPublic_page_end)
            var newPage = res.data.data;
            console.log(newPage);
            if (newPage != "") {
              wx.showToast({
                title: 'loading...',
                icon: 'loading'
              })
              var myProject = that.data.myProject;
              for (var i = 0; i < newPage.length; i++) {
                myProject.push(newPage[i])
              }
              console.log(myPublicProject_page);
              that.setData({
                myProject: myProject,
                myPublicCheck: true,
                myPublic_page_end: myPublic_page_end
              })
            } else {
              rqj.errorHide(that, "没有更多了", 3000)
            }
          },
          fail: function (res) {
            console.log(res)
          },
        })
      }
    }

    this.setData({
      myPublicCheck: false
    });
  },
  //项目详情
  detail: function (e) {
    var thisData = e.currentTarget.dataset;
    var id = thisData.id;
    var index = thisData.index
    wx.navigateTo({
      url: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index + "&&currentTab=" + 0
    })
  },
  
  //编辑项目
  editDetail: function (e) {
    var id=e.currentTarget.dataset.id;
    var user_id = wx.getStorageSync('user_id')
    wx.navigateTo({
      url: '/pages/myProject/editProject/editProject?pro_id=' + id + "&&user_id=" + user_id,
    })
  },
  // 按钮一号
  buttonOne: function () {
      app.infoJump("/pages/myProject/publishProject/publishProject");
  }
})