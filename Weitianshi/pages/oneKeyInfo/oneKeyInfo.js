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
        that.setData({
          company: company,
          time: time
        })
        // 项目信息
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerProject',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
            app.console("项目信息")
            app.console(res)
            let projectDetailsList = res.data.data;
            projectDetailsList.forEach((x, index) => {
              projectDetailsList[index].project_logo = x.project_logo;
              projectDetailsList[index].company_name = x.company_name;
              projectDetailsList[index].project_industry = x.project_industry;
              projectDetailsList[index].project_introduce = x.project_introduce;
              projectDetailsList[index].project_label = x.project_label;
              projectDetailsList[index].project_name = x.project_name;
              projectDetailsList[index].project_website = x.project_website;
           let projectLabelList= [] 
            })
            that.setData({
              projectDetailsList: projectDetailsList
            })
          }
        })
        //工商变更
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerBrand',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
            app.console("工商变更")
            app.console(res)
            // 变更信息
            let brandInfoList = res.data.data.brand;
            let companyChangeList = res.data.data.company_change;
            brandInfoList.forEach((x, index) => {
              brandInfoList[index].company_brand_name = x.company_brand_name;
              brandInfoList[index].company_brand_registration_number = x.company_brand_registration_number;
              brandInfoList[index].company_brand_status = x.company_brand_status;
              brandInfoList[index].company_brand_time = app.changeTime(x.company_brand_time);
              brandInfoList[index].company_brand_type = x.company_brand_type;
            })
            companyChangeList.forEach((x, index) => {
              companyChangeList[index].company_change_after = x.company_change_after;
              companyChangeList[index].company_change_before = x.company_change_before;
              companyChangeList[index].company_change_matter = x.company_change_matter;
              companyChangeList[index].company_change_time = app.changeTime(x.company_change_time);
            })
            that.setData({
              brandInfoList: brandInfoList,
              companyChangeList: companyChangeList
            })
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
            teamList.forEach((x, index) => {
              teamList[index].team_member_name = x.team_member_name;
            })
            that.setData({
              teamList: teamList
            })
          }
        })
        // 历史融资
        wx.request({
          url: url_common + '/api/dataTeam/getCrawlerHistoryFinance',
          data: {
            com_id: com_id
          },
          method: 'POST',
          success: function (res) {
            app.console("历史融资")
            app.console(res)
            let historyFinance = res.data.data;
            historyFinance.forEach((x, index) => {
              historyFinance[index].history_financing_money = x.history_financing_money;
              historyFinance[index].history_financing_rounds = x.history_financing_rounds;
              historyFinance[index].history_financing_who = x.history_financing_who;
              historyFinance[index].history_financing_time = app.changeTime(x.history_financing_time);           
            })
            that.setData({
              historyFinance: historyFinance
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
                mileStone[index].milestone_time = app.changeTime(x.milestone_time);
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
              newsList[index].project_news_time = app.changeTime(x.project_news_time);
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
            app.console("竞品")
            app.console(res)
            let competeList = res.data.data;
            competeList.forEach((x, index) => {
              competeList[index].source = x.source;
              competeList[index].competing_goods_name = x.competing_goods_name;
              competeList[index].competing_goods_label = x.competing_goods_label;
              competeList[index].competing_goods_logo = x.competing_goods_logo;
              competeList[index].competing_goods_Financing_rounds = x.competing_goods_Financing_rounds;
              competeList[index].competing_goods_Financing_time = app.changeTime(x.competing_goods_Financing_time);
              competeList[index].competing_goods_Set_up = app.changeTime(x.competing_goods_Set_up);
              competeList[index].competing_goods_industry = x.competing_goods_industry;
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