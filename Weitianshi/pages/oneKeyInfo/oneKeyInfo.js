var rqj = require('../Template/Template.js');
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
var lineChart = null;
Page({
    data:{

    },
    onLoad: function (e) {
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
    },
    
})