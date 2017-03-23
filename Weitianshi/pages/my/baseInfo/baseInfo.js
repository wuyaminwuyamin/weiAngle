// pages/my/baseInfo/baseInfo.js
Page({
  data:{
    avatar:"",
    name:"张三",
    mobile:18762670539,
    identity:"请选择",
    company:"微天使",
    career:"投资经理",
    email:"morganfly@126.com",
    describe:""
  },
  onLoad:function(options){
   
  },
  onShow:function(){
  
  },
  save:function(){
    console.log(1)
    wx.redirectTo({
      url: '../myInfoEdit/myInfoEdit',
    })
  }
})