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
    var that = this;
    //获取资源分类名称和id
    wx.request({
      url: 'https://dev.weitianshi.com.cn/api/category/getResourceCategory',
      data: {},
      method: 'POST',
      success: function (res) {
        //判断用户是否填写过资源需求
        var resource_data = wx.getStorageSync('resource_data')
        var res_find = resource_data.res_find;
        var res_give = resource_data.res_give;
        var enchange = res.data.data;
        var target = res.data.data;
        var res_find_name = [];
        var res_find_id=[];
        var res_give_name = [];
        var res_give_id=[];
        for (var i = 0; i < res_find.length; i++) {
          res_find_name.push(res_find[i].resource_name)
          res_find_id.push(res_find[i].resource_id)
        }
        for (var i = 0; i < res_give.length; i++) {
          res_give_name.push(res_give[i].resource_name)
          res_give_id.push(res_give[i].resource_id)
        }
        var enchangeValue = res_find_name    //选中标签值的数组
        var enchangeId = res_find_id   //选中标签id的数组
        var enchangeCheck = []    //选中标签checked的数组
        var targetValue = res_give_name    //选中标签值的数组
        var targetId = res_give_id   //选中标签id的数组
        var targetCheck = []    //选中标签checked的数组
        //enchange和target中加入checked属性
        console.log(res_find,res_find_name)
        for (var i = 0; i < enchange.length; i++) {
          if (res_find_name.indexOf(enchange[i].resource_name) != -1) {
            enchange[i].checked = true;
          } else {
            enchange[i].checked = false;
          }
          enchangeCheck.push(enchange[i].checked)
        }
        for (var i = 0; i < target.length; i++) {
          if (res_give_name.indexOf(target[i].resource_name) != -1) {
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
        // console.log(enchange)
      },
      fail: function (res) {
        console.log(res)
      },
    })

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
        enchangeValue.push(enchange[e_index].resource_name)
        enchangeId.push(enchange[e_index].resource_id)
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
    // console.log(enchangeValue,enchangeId)
  },
  //传值部份2
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
        targetValue.push(target[e_index].resource_name)
        targetId.push(target[e_index].resource_id)
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
  //具体描述
  bindTextAreaBlur: function (e) {
    var describe = e.detail.value;
    this.setData({
      describe: describe
    })
    console.log(describe)
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
    var enchange = this.data.enchange;
    var enchangeValue = this.data.enchangeValue;
    var enchangeId = this.data.enchangeId;
    var target = this.data.target
    var targetValue = this.data.targetValue;
    var targetId = this.data.targetId;
    var user_id = wx.getStorageSync('user_id');
    var describe = this.data.describe
    console.log(enchangeValue, enchangeId, targetValue, targetId)
    wx.request({
      url: 'https://dev.weitianshi.com.cn/api/resource/insertResource',
      data: {
        user_id: user_id,
        res_give: enchangeId,
        res_find: targetId,
        res_desc: describe
      },
      method: 'POST',
      success: function (res) {
        console.log("成功发布")
      },
      fail: function (res) {
        console.log(res)
      }
    })

    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面
    })
  }
});