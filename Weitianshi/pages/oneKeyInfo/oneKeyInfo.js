var rqj = require('../Template/Template.js');
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
var lineChart = null;
Page({
  data: {
  },
  onLoad: function (e) {
    //公司信息
    var that = this;
    let user_id = "yrQG8zZW";
    let company_name = "北京大杰致远信息技术有限公司";
    wx.request({
      url: url_common + '/api/dataTeam/getCrawlerCompany',
      data: {
        user_id: user_id,
        company_name: company_name
      },
      method: 'POST',
      success: function (res) {
        let company = res.data.data.company;
        let com_id = company.com_id;
        let com_time = company.company_register_date;
        
        var time = app.changeTime(com_time)
        app.console("时间")
        console.log(time)
        that.setData({
          company: company,
          time : time
        })
        // 项目信息
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerProject',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
        app.console(res)
          }
        })
        // 核心成员
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerTeam',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
            let teamList = res.data.data; 
            teamList.forEach((x,index) => {
              teamList[index].team_member_name = x.team_member_name; 
            })
            that.setData({
              teamList: teamList
            })
          }
        })
        // 里程碑
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerMilestone',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
            let mileStone = res.data.data;
            let mileStoneTime =
            mileStone.forEach((x, index) => {
              mileStone[index].milestone_event = x.milestone_event;       
              mileStone[index].milestone_time = x.milestone_time;
              app.changeTime(mileStone[index].milestone_time)
            })
            that.setData({
              mileStone: mileStone
            })
          }
        })
        //新闻
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerNews',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
            let newsList = res.data.data;
               newsList.forEach((x, index) => {
              newsList[index].source = x.source;
              newsList[index].project_news_time = x.project_news_time;
              newsList[index].project_news_title = x.project_news_title;
              that.setData({
                newsList: newsList
              })
            })
          }
        })
        // 竞品
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerCompeting',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
            app.console(res)
            let competeList = res.data.data;
            competeList.forEach((x, index) => {
              competeList[index].source = x.source;
              competeList[index].competing_goods_name = x.competing_goods_name;
              competeList[index].competing_goods_label = x.competing_goods_label;
              competeList[index].competing_goods_logo = x.competing_goods_logo;
              competeList[index].competing_goods_Financing_rounds = x.competing_goods_Financing_rounds;
              competeList[index].competing_goods_Financing_time = x.competing_goods_Financing_time;
              competeList[index].competing_goods_Set_up = x.competing_goods_Set_up;
              competeList[index].competing_goods_industry = x.competing_goods_industry;
              competeList[index].competing_goods_Financing_amount = x.competing_goods_Financing_amount;
              that.setData({
                competeList: competeList
              })
            })
          }
        })
      }
    })
    //定宽,默认320,自动取设备宽
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: false,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  //点击显示当前成交金额 
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },
  //造假数据
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * 20);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  //更新数据
  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  }
})