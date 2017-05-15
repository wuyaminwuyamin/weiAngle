var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url
var app = getApp();
// 所属领域
var url = app.globalData.url;
var initialArr={};//初始数组
var save = true;//是否删除缓存
Page({
    data: {
        // 名称
        doMain: [],
        // 下标
        index: [],
        // 每一个名称的id值
        id: [],
        error: "0",
        error_text: "",
        enchange: [],//接口给的标签
        checked: [],//已经选中的标签的值
        checkedId: [],//已经选中标签的id
        enchangeCheck: [],
        enchangeValue : [],
        enchangeId : [],
        target: []//接口给的标签
    },
    onLoad: function (options) {
        // console.log("this is onLoad")
        var that = this;
        var options = options;
        console.log(options);
        var industry = wx.getStorageSync('industry');
        //console.log(industry)
        var current = options.current;
        // 0:发布融资项目  1:发布投资需求 2:维护我的项目 3:发布投资案例
        if (current == 0) {
            var domainValue = wx.getStorageSync('domainValue')
            var domainId = wx.getStorageSync('domainId')
            console.log(domainValue,domainId)
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }
            // console.log(domainValue)
            // console.log(typeof domainValue)
        } else if (current == 1) {
            var domainValue = wx.getStorageSync('y_domainValue')
            var domainId = wx.getStorageSync('y_domainId')

            if (!domainValue) {
                domainValue = [];
                domainId = [];
            }
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }

            // console.log(domainValue)
            // console.log(typeof domainValue)
        } else if (current == 2) {
            var domainValue = options.industryValue;
            var domainId = options.industryId;
            var domainValue = domainValue.split(",")
            var domainId = domainId.split(",");
            // console.log(industry); 
            var industrycheck=[];
            //checkbox 便利industry
            for (var i = 0; i < industry.length; i++) {
              // indexof查找是否包含内容
              if (domainValue.indexOf(industry[i].industry_name) != -1) {
                industry[i].checked = true;
              } else {
                industry[i].checked = false;
              }
            }
            for (var i = 0; i < industry.length; i++){
              industrycheck.push(industry[i].checked);
            }
            wx.setStorageSync('enchangeCheck', industrycheck);
            wx.setStorageSync('enchangeValue', domainValue);
            wx.setStorageSync('enchangeId', domainId);
            console.log(industrycheck); 
            // console.log(domainValue,domainId)
            for (var i = 0; i < domainId.length; i++) {
                domainId[i] = domainId[i] * 1
            }
            if (domainValue == '选择领域') {
                domainValue = [];
                domainId = [];
            }

            // console.log(domainValue, domainId)
            // console.log(typeof domainValue)
        } else if (current == 3) {
            var domainValue = wx.getStorageSync('case_domainValue')
            var domainId = wx.getStorageSync('case_domainId')
            if (!domainValue) {
                domainValue = [];
                domainId = [];
            }
            if (domainValue == "选择领域") {
                domainValue = [];
                domainId = [];
            }
        }

        //checkbox 便利industry
        for (var i = 0; i < industry.length; i++) {
            // indexof查找是否包含内容
            if (domainValue.indexOf(industry[i].industry_name) != -1) {
                industry[i].checked = true;
            } else {
                industry[i].checked = false;
            }
        }
        //console.log(industry);
        wx.setStorageSync('industry', industry);

        console.log(domainValue,domainId);
        var enchangeCheck = wx.getStorageSync('enchangeCheck') || [];
        var enchangeValue = wx.getStorageSync('enchangeValue') || [];
        // var enchangeId = wx.getStorageSync('enchangeId')|| [];
        var enchangeId = domainId
        for (var i = 0; i < enchangeId.lengthl;i++){
          enchangeId[i] = parseInt(enchangeId[i]);
          console.log(enchangeId[i])
        }
        console.log(enchangeId)
        // 设置值
        that.setData({
            doMain: industry,
            current: current,
            checked: domainValue,
            index: domainId,
            enchangeCheck : enchangeCheck,
            enchangeValue : enchangeValue,
            enchangeId : enchangeId
        });
    },

    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新");
        wx.stopPullDownRefresh()
    },
    //传值部份可提供资源
  checkboxChange: function (e) {
    // console.log(e);
    var that = this;
    // console.log(that)
    var thisData = e.currentTarget.dataset;
    // console.log(thisData)
    var e_index = thisData.index;//数组下标
    var e_value = thisData.value;//值
    var e_check = thisData.check;//是否被选中
    console.log(e_index,e_value,e_check)
    var enchange = this.data.doMain//返回的所有数据{checked:false,industry_id:12,industry_name:"社交网络"}
    var enchangeValue = this.data.enchangeValue;//已被选中的名字
    var enchangeId = this.data.enchangeId;//已添加的数字
    var enchangeCheck = this.data.enchangeCheck;//是否被选中
    for(var i=0; i<enchange.length ; i++){
        enchangeCheck.push(enchange[i].checked)//被选中的状态
    }

    console.log(enchange)
    console.log(enchangeId)
    // console.log(enchangeCheck)
    // console.log(enchangeCheck[e_index]);
    if (enchangeCheck[e_index] == false) {//当确认按钮时
      if (enchangeValue.length < 5) {
        enchangeCheck[e_index] = true;
        enchange[e_index].checked = true;
        enchangeValue.push(enchange[e_index].industry_name)
        // console.log(enchange[e_index].industry_id);
        enchangeId.push(enchange[e_index].industry_id)//点击时把数据的ID添加起来
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
    //   console.log(enchangeId.indexOf(enchange[e_index].industry_id))
      enchangeId.splice(enchangeId.indexOf(enchange[e_index].industry_id), 1)
    }
    this.setData({
      enchange: enchange,
      enchangeValue: enchangeValue,
      enchangeId: enchangeId,
      enchangeCheck: enchangeCheck
    });
      // wx.setStorageSync('enchangeValue', enchangeValue);
      // wx.setStorageSync('enchangeId', enchangeId);
      console.log(enchangeValue, enchangeId)
  },
    //点击确定
    certain: function () {
        save = true;
        var that = this;
        var checked = this.data.enchangeValue;
        var id = this.data.id;
        var index = this.data.enchangeId;
        var doMain = this.data.doMain;
        var current = this.data.current;
        var enchangeCheck = this.data.enchangeCheck;
        that.setData({
            error: "0"
        });
        console.log(checked, index)
        wx.setStorageSync('enchangeValue', checked);
        wx.setStorageSync('enchangeId', index);
        wx.setStorageSync('enchangeCheck', enchangeCheck);
        // 选择的标签最多是5个
        if (checked.length > 5) {
            // 如果超过5个提示锁雾
            var that = this;
            that.setData({
                error: "1",
                error_text: "至多选择五个标签"
            })
        } else {
            if (current == 0) {
                //传值给myProject
                if (checked == "") {
                    wx.setStorageSync('domainValue', "选择领域");
                    wx.setStorageSync('domainId', '');
                } else {
                    wx.setStorageSync('domainValue', checked);
                    wx.setStorageSync('domainId', index);
                    console.log(wx.getStorageSync('domainId'))
                    wx.setStorageSync('enchangeCheck', enchangeCheck);
                }
            } else if (current == 1) {
                if (checked == "") {
                    wx.setStorageSync('y_domainValue', "选择领域");
                    wx.setStorageSync('y_domainId', '');
                } else {
                    wx.setStorageSync('y_domainValue', checked);
                    console.log(checked);
                    wx.setStorageSync('y_domainId', index);
                    wx.setStorageSync('enchangeCheck', enchangeCheck);
                }
            } else if (current == 2) {
                wx.setStorageSync('m_domainValue', checked);
                wx.setStorageSync('m_domainId', index);
            } else if (current == 3) {
                if (checked == "") {
                    wx.setStorageSync('case_domainValue', "选择领域");
                    wx.setStorageSync('case_domainId', '');
                } else {
                    wx.setStorageSync('case_domainValue', checked);
                    wx.setStorageSync('case_domainId', index);
                    wx.setStorageSync('enchangeCheck', enchangeCheck);
                }
            }
            
            save =!save;
            wx.navigateBack({
                delta: 1
            })
        }
  }
  // ,
  // onUnload: function () {
  //   // 页面关闭
  //   if(save){   
  //     wx.setStorageSync('enchangeValue', []);
  //     wx.setStorageSync('enchangeId', []);
  //     wx.setStorageSync('enchangeCheck',[]);
  //   }
  // }

});