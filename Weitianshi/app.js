//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs)
  },


  //获取用户信息
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (login) {
          var login = login.code;
          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
              //console.log(res)   //调用wx.getUserInfo成功后返回的各种东西
              //向后台发送用户信息
              wx.request({
                url: 'https://www.weitianshi.com.cn/api/wx/returnOauth',
                data: {
                  code: login,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                method: 'POST',
                success: function (res) {
                  //本地存入open_session
                  wx.setStorageSync('open_session', res.data.open_session);
                  wx.setStorageSync('bind_mobile', res.data.bind_mobile);
                  wx.setStorageSync('user_id', res.data.user_id);
                  // console.log("获取用户信息完成,已将bind_mobile,userId,open_session存入缓存");
                  // console.log(res.data.bind_mobile, res.data.user_id, res.data.open_session)
                },
                fail: function () {
                  console.log("向后台发送信息失败")
                },
              })
            },
            fail: function () {
              console.log("客户不让获取信息")
            }
          })
        }
      })
    }
  },


  //维护登录状态
  checkLogin: function () {
    //后台登录状态维护
    wx.login({
      success: function (res) {
        if (res.code) {
          //向后台请求数据
          //console.log(res.code)
          wx.request({
            url: 'https://www.weitianshi.com.cn/api/wx/returnLoginStatus',
            data: {
              code: res.code
            },
            method: 'POST',
            success: function (res) {
              //本地存入open_session
              wx.setStorageSync('open_session', res.data.open_session);
              wx.setStorageSync('bind_mobile', res.data.bind_mobile);
              wx.setStorageSync('user_id', res.data.user_id);
              //检查是否绑定手机
              var bind_mobile = wx.getStorageSync('bind_mobile');
              // console.log("维护登录状态成功,已将bind_mobile,user_id,open_session存入缓存");
              // console.log(res.data.bind_mobile, res.data.user_id, res.data.open_session);
            },
            fail: function () {
              console.log("向后台获取3rd_session失败")
            },
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    //微信登录状态维护
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        wx.login(); //重新登录
      }
    })
  },

  //查看缓存
  cacheCheck: function () {
    var res = wx.getStorageInfoSync();
    // console.log(res.keys);
    // console.log(res.currentSize);
  },

  //报错
  error: function (text) {
    // this.globalData.error = 1
    // this.globalData.error_text = text
    // var errorTime = setTimeout(function () {
    //   this.globalData.error = 0;
    //   this.globalData.error_text=""
    //   console.log('提示已消失')
    // }, 1500)
    // console.log(this.globalData.error_text)
  },

  //下拉刷新
  onPullDownRefresh: function () {
    // console.log("开启了下拉刷新")
    wx.stopPullDownRefresh()
  },


  //初始本地缓存
  globalData: {
    error: 0,
    error_text: "111111",
    y_domainValue:"选择领域"
  }
});