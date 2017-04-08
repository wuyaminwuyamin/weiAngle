// pages/my/test/test.js
Page({
  data:{},
  onLoad:function(options){
    wx.showModal({
      title:"aa",
      content:options.user_id
    })
  },
})