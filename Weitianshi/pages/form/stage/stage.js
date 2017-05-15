var rqj = require('../Template/Template.js');
var app=getApp();
var url=app.globalData.url;
var save = true;//是否删除缓存
Page({
    data: {
        payStage: [],
        checked: [],
        index: [],
        id: [],
        error: "0",
        error_text: "",
        enchange: [],//接口给的标签
        checked: [],//已经选中的标签的值
        checkedId: [],//已经选中标签的id
        enchangeCheck: [],
        enchangeValue : [],
        enchangeId : []
    },
    onLoad: function () {
        var that = this;
        var payStage = wx.getStorageSync('y_stage');
        // console.log("this is onLoad")
        for(var i=0;i<payStage.length; i++){
            payStage[i].checked =false;
        }
        wx.setStorageSync('payStage', payStage)
        var enchangeCheck = wx.getStorageSync('payenchangeCheck') || [];
        var enchangeValue = wx.getStorageSync('payenchangeValue') || [];
        var enchangeId = wx.getStorageSync('payenchangeId') || [];
        
        // console.log(enchangeCheck);
        // console.log(enchangeValue);
        // console.log(enchangeId);
        
        wx.setStorageSync('enchangeCheck', enchangeCheck);
        that.setData({
            payStage: payStage,
            enchangeCheck : enchangeCheck,
            enchangeValue : enchangeValue,
            enchangeId : enchangeId,
            index: enchangeId
        });

        // console.log(this.data.checked, typeof this.data.checked)
    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    },

    // //传值部份
    // checkboxChange: function (e) {
    //     var that = this;
    //     var checked = this.data.checked;
    //     var payStage = this.data.payStage;
    //     var index = this.data.index;
    //     var thisData = e.currentTarget.dataset;
    //     var isCheck = thisData.check;
    //     var value = thisData.value;
    //     var idx = thisData.index;
    //     var id = e.currentTarget.id;

    //     if (index.indexOf(id) == -1) {
    //         checked.push(value);
    //         index.push(id)
    //     } else {
    //         // console.log(checked.indexOf(value), index.indexOf(id) + 1);
    //         checked.splice(checked.indexOf(value), 1);
    //         index.splice(index.indexOf(id), 1);
    //     }

    //     that.setData({
    //         checked: checked,
    //         index: index
    //     })

    // },
    //传值部份可提供资源
  checkboxChange: function (e) {
        // console.log(e);
        var that = this;
        // console.log(that)
        var thisData = e.currentTarget.dataset;//{value: "种子轮 ", index: 0, check: "false"}
        // console.log(thisData)
        var e_index = thisData.index;//数组下标
        var e_value = thisData.value;//值
        var e_check = thisData.check;//是否被选中
        // console.log(e_index,e_value,e_check)
        var enchange = this.data.payStage//返回的所有数据
        var enchangeValue = this.data.enchangeValue;//已被选中的名字
        var enchangeId = this.data.enchangeId;//已添加的数字
        var enchangeCheck = this.data.enchangeCheck;//是否被选中
        for(var i=0; i<enchange.length; i++){
            enchangeCheck.push(enchange[i].checked)//被选中的状态
        }

        // console.log(enchange)
        // console.log(enchangeId)
        // console.log(enchangeCheck)
        // console.log(enchangeCheck[e_index]);
        if (enchangeCheck[e_index] == false) {//当确认按钮时
        if (enchangeValue.length < 5) {
            enchangeCheck[e_index] = true;
            enchange[e_index].checked = true;
            enchangeValue.push(enchange[e_index].stage_name)
            // console.log(enchange[e_index].stage_id);
            enchangeId.push(enchange[e_index].stage_id)//点击时把数据的ID添加起来
        } else {
            rqj.errorHide(that, "最多可选择五项", 1000)
        }
        } else {//当取消按钮时
        enchangeCheck[e_index] = false;
        enchange[e_index].checked = false;
        //   console.log(enchangeValue);
        //   console.log(enchangeValue.indexOf(e_value))
        enchangeValue.splice(enchangeValue.indexOf(e_value), 1)
        //   console.log(enchangeId);
        //   console.log(enchangeId.indexOf(enchange[e_index].stage_id))
        enchangeId.splice(enchangeId.indexOf(enchange[e_index].stage_id), 1)
        }
        this.setData({
            enchange: enchange,
            enchangeValue: enchangeValue,
            enchangeId: enchangeId,
            enchangeCheck: enchangeCheck,
            index: enchangeId
        });
        // wx.setStorageSync('payenchangeValue', enchangeValue)
        // wx.setStorageSync('payenchangeId', enchangeId)
        // wx.setStorageSync('payenchangeCheck', enchangeCheck)
        // wx.setStorageSync('enchangeValue', enchangeValue);
        // wx.setStorageSync('enchangeId', enchangeId);
        console.log(enchangeValue, enchangeId)
    },


    //点击确定
    certain: function () {
        save = true;
        var that = this;
        // var console_checked = this.data.checked.join();
        // var checked = this.data.checked;
        var id = this.data.id;
        // var index = this.data.index;
        var payStage = this.data.payStage;
        var checked = this.data.enchangeValue;
        var index = this.data.enchangeId;
        var enchangeCheck = this.data.enchangeCheck;
        // console.log(checked)

        that.setData({
            error: "0"
        });

        if (checked.length > 5) {
            var that = this;
            that.setData({
                error: "1",
                error_text: "至多选择五个标签"
            });
            var time=setTimeout(function(){
                that.setData({
                    error:"0"
                })
            },1500)
        } else {

            //传值给myProject
            if (checked == "") {
                wx.setStorageSync('y_payStage', "选择阶段");
                wx.setStorageSync('y_payStageId', '');
                // wx.setStorageSync('domainChecked', checked)
                wx.setStorageSync('payenchangeCheck', enchangeCheck)
                wx.setStorageSync('payenchangeValue', checked)
            } else {
                wx.setStorageSync('y_payStage', checked);
                wx.setStorageSync('y_payStageId', index);
                // wx.setStorageSync('domainChecked', checked);
                wx.setStorageSync('payenchangeCheck', enchangeCheck)
                wx.setStorageSync('payenchangeValue', checked)
            }

            // console.log(checked, index);
            wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
            })
        }
        save = !save;

  }
  // ,  
  // onUnload: function () {
  //   console.log(save)
  //   // 页面关闭
  //   if (save) {
  //     wx.setStorageSync('payenchangeValue', []);
  //     wx.setStorageSync('payenchangeId', []);
  //     wx.setStorageSync('payenchangeCheck', []);
  //     wx.setStorageSync('y_payStage', "选择阶段");
  //     wx.setStorageSync('y_payStageId', []);
  //     console.log("clear")
  //   }
  // }


});