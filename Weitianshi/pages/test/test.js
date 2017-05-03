// pages/test/test.js
var app = getApp();
var url = app.globalData.url;
Page({
  data:{
    formjump:"",
    formjump1:"",
    formbottom:"",
    stage_index : 0
  },
  onLoad:function(options){    
    // 页面初始化 options为页面跳转所带来的参数
    var formjump={};
    // json.unshift({
    //                 scale_id: 0,
    //                 scale_money: "选择融资"
    //             });
    formjump.name="测试";
    formjump.domainValue="选择测试";
    formjump.default="选择测试"
    formjump.url="../industry/industry?current=0";
    var formbottom={}
    formbottom.name="下滑"
    this.setData({
      formjump : formjump,
      formjump1 : formjump
    })

    var that = this;
    wx.request({
            url: url+'/api/category/getWxProjectCategory',
            method: 'POST',
            success: function (res) {
                console.log(res)
                var thisData = res.data.data;
                //填入项目阶段和期望融资
                var scale = thisData.scale;
                var index_arry = [];//index
                var name_arry = [];//name
                console.log(scale);
                scale.unshift({
                    scale_id: 0,
                    scale_money: "选择融资"
                });
                console.log(scale);


                for (var b = 0; b < scale.length; b++) {
                    index_arry.push(scale[b].scale_id)
                }
                for (var i = 0; i < scale.length; i++) {
                    name_arry.push(scale[i].scale_money)
                }
                console.log(index_arry);
                console.log(name_arry);
                formbottom.scale = scale;
                formbottom.index_arry = index_arry;
                formbottom.name_arry = name_arry;
                that.setData({
                    formbottom: formbottom
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
  //项目阶段
    stage: function (e) {
        this.setData({
            stage_index: e.detail.value,
            // console_stage: this.data.stage[this.data.stage_index].stage_id,
        });
    },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})