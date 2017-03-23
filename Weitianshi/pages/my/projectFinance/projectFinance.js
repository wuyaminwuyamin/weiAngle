// pages/my/projectFinance/projectFinance.js
Page({
  data:{

  },
  onLoad:function(options){
    var that=this;
     //登录并载入我的项目数据
    wx.login({
      success: function (res) {
        if (res.code) {
          //向后台请求登录状态
          //console.log(res.code)
          wx.request({
            url: 'https://www.weitianshi.com.cn/api/wx/returnLoginStatus',
            data: {
              code: res.code
            },
            method: 'POST',
            success: function (res) {
              // console.log(res)
              //本地存入open_session,bind_mobile,user_id
              wx.setStorageSync('open_session', res.data.open_session);
              wx.setStorageSync('bind_mobile', res.data.bind_mobile);
              wx.setStorageSync('user_id', res.data.user_id);
              var bind_mobile = wx.getStorageSync('bind_mobile');
              var user_id = res.data.user_id
              // console.log(res.data.bind_mobile, res.data.user_id, res.data.open_session)
              if (user_id != 0) {
                // console.log("请求了列表信息")
                // console.log(user_id)
                //获取我的项目匹配到的投资人
                wx.request({
                  url: 'https://www.weitianshi.com.cn/api/project/getMyProject',
                  data: {
                    user_id: user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    var myProject = res.data.data;
                    var length = myProject.length;
                    wx.setStorageSync('proLength', length);
                    that.setData({
                      myProject: myProject,
                      bind_mobile: bind_mobile
                    });

                    //将匹配出来的四个人放入缓存
                    var investors = [];
                    var cards = res.data.data;
                    for (var i = 0; i < cards.length; i++) {
                      investors.push(cards[i].match_investors)
                    }
                    wx.setStorageSync('investors', investors)
                  }
                })
              }
            },
            fail: function () {
              console.log("向后台获取3rd_session失败")
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //编辑项目
  edit:function(e){
    var pro_id=e.target.dataset.proId;
    wx.navigateTo({
      url: '../../myProject/projectDetail/projectDetail'
    })
  },
  // 新增项目
  addProject(){
    wx.navigateTo({
      url: '../../myProject/publishProject/publishProject',
    })
  }
})