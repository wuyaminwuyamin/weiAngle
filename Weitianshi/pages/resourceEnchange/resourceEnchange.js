var rqj = require('../Template/Template.js')
Page({
  data: {
    enchange: [],//接口给的标签
    checked: [],//已经选中的标签的值
    checkedId: [],//已经选中标签的id
    target: [],//接口给的标签
    t_checked: [],//已经选中的标签的值
    t_checkedId: [],//已经选中标签的id
    error: "0",
    error_text: "",
  },
  onLoad: function (options) {
    // console.log("this is onLoad")
    var that = this;
    var enchange = wx.getStorageSync('industry');
    var target = wx.getStorageSync('industry')
    // console.log(enchange)
    var enchangeValue = []    //选中标签值的数组
    var enchangeId = []   //选中标签id的数组
    var enchangeCheck = []    //选中标签checked的数组
    var targetValue = []    //选中标签值的数组
    var targetId = []   //选中标签id的数组
    var targetCheck = []    //选中标签checked的数组

    //checkbox
    for (var i = 0; i < enchange.length; i++) {
      if (enchangeValue.indexOf(enchange[i].industry_name) != -1) {
        enchange[i].checked = true;
      } else {
        ``
        enchange[i].checked = false;
      }
      enchangeCheck.push(enchange[i].checked)
    }
    for (var i = 0; i < target.length; i++) {
      if (targetValue.indexOf(target[i].industry_name) != -1) {
        target[i].checked = true;
      } else {
        target[i].checked = false;
      }
      targetCheck.push(enchange[i].checked)
    }

    that.setData({
      enchange: enchange,
      enchangeValue: enchangeValue,
      enchangeId: enchangeId,
      enchangeCheck: enchangeCheck,
      target: target,
      targetValue: targetValue,
      targetId: targetId,
      targetCheck: targetCheck
    });
    // console.log(this.data.enchangeCheck)
    // console.log(this.data.enchange)
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  //传值部份
  checkboxChange: function (e) {
    // console.log(e)
    var that = this;
    var thisData = e.currentTarget.dataset;
    // console.log(thisData)
    var e_index = thisData.index;
    var e_value = thisData.value;
    var e_check = thisData.check;
    var enchange = this.data.enchange
    var enchangeValue = this.data.enchangeValue;
    var enchangeId = this.data.enchangeId;

    if (enchange[e_index].checked == false) {
      if (enchangeValue.length < 5) {
        enchange[e_index].checked = true;
        enchangeValue.push(enchange[e_index].industry_name)
        enchangeId.push(enchange[e_index].industry_id)
      } else {
        rqj.errorHide(that, "最多可选择五项", 3000)
      }
    } else {
      enchange[e_index].checked = false;
      enchangeValue.splice(enchangeValue.indexOf(e_value), 1)
      enchangeId.splice(enchangeId.indexOf(e_index), 1)
    }
    this.setData({
      enchange: enchange,
      enchangeValue: enchangeValue,
      enchangeId: enchangeId
    });
  },
  //传值部份
  checkboxChange2: function (e) {
    // console.log(e)
    var that = this;
    var thisData = e.currentTarget.dataset;
    // console.log(thisData)
    var e_index = thisData.index;
    var e_value = thisData.value;
    var e_check = thisData.check;
    var target = this.data.target
    var targetValue = this.data.targetValue;
    var targetId = this.data.targetId;

    if (target[e_index].checked == false) {
      if (targetValue.length < 5) {
        target[e_index].checked = true;
        targetValue.push(target[e_index].industry_name)
        targetId.push(target[e_index].industry_id)
      } else {
        rqj.errorHide(that, "最多可选择五项", 3000)
      }
    } else {
      target[e_index].checked = false;
      targetValue.splice(targetValue.indexOf(e_value), 1)
      targetId.splice(targetId.indexOf(e_index), 1)
    }
    this.setData({
      target: target,
      targetValue: targetValue,
      targetId: targetId
    });
  },

  //可提供资源自定义添加
  offerAdd: function () {
    wx.showModal({
      title: "自定义标签",
      content: "<input type='text' placehold='helloWorld'/>"
    })
  },

  //点击确定
  publish: function () {
    var that = this;
    var checked = this.data.checked;
    var checkedId = this.data.checkedId;
    var enchange = this.data.enchange;
    var t_checked = this.data.t_checked;
    var t_checkedId = this.data.t_checkedID;
    var target = this.data.target

 /*   //传值给myProject
    if (checked == "") {
      wx.setStorageSync('enchangeValue', "选择领域");
      wx.setStorageSync('enchangeId', '');
    } else {
      wx.setStorageSync('enchangeValue', checked);
      wx.setStorageSync('enchangeId', checkedId);
    }
    console.log(checked, checkedId);*/
    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面
    })
  }
});