var rqj = require('../Template/Template.js');
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
var lineChart = null;
Page({
    data: {
        a: {
            "code": 0,
            "msg": "OK",
            "data": {
                "three_month": [
                    "20170322",
                    "20170323",
                    "20170324",
                    "20170325",
                    "20170326",
                    "20170327",
                    "20170328",
                    "20170329",
                    "20170330",
                    "20170331",
                    "20170401",
                    "20170402",
                    "20170403",
                    "20170404",
                    "20170405",
                    "20170406",
                    "20170407",
                    "20170408",
                    "20170409",
                    "20170410",
                    "20170411",
                    "20170412",
                    "20170413",
                    "20170414",
                    "20170415",
                    "20170416",
                    "20170417",
                    "20170418",
                    "20170419",
                    "20170420",
                    "20170421",
                    "20170422",
                    "20170423",
                    "20170424",
                    "20170425",
                    "20170426",
                    "20170427",
                    "20170428",
                    "20170429",
                    "20170430",
                    "20170501",
                    "20170502",
                    "20170503",
                    "20170504",
                    "20170505",
                    "20170506",
                    "20170507",
                    "20170508",
                    "20170509",
                    "20170510",
                    "20170511",
                    "20170512",
                    "20170513",
                    "20170514",
                    "20170515",
                    "20170516",
                    "20170517",
                    "20170518",
                    "20170519",
                    "20170520",
                    "20170521",
                    "20170522",
                    "20170523",
                    "20170524",
                    "20170525",
                    "20170526",
                    "20170527",
                    "20170528",
                    "20170529",
                    "20170530",
                    "20170531",
                    "20170601",
                    "20170602",
                    "20170603",
                    "20170604",
                    "20170605",
                    "20170606",
                    "20170607",
                    "20170608",
                    "20170609",
                    "20170610",
                    "20170611",
                    "20170612",
                    "20170613",
                    "20170614",
                    "20170615",
                    "20170616",
                    "20170617",
                    "20170618",
                    "20170619"
                ],
                "one_month": [
                    "20170521",
                    "20170522",
                    "20170523",
                    "20170524",
                    "20170525",
                    "20170526",
                    "20170527",
                    "20170528",
                    "20170529",
                    "20170530",
                    "20170531",
                    "20170601",
                    "20170602",
                    "20170603",
                    "20170604",
                    "20170605",
                    "20170606",
                    "20170607",
                    "20170608",
                    "20170609",
                    "20170610",
                    "20170611",
                    "20170612",
                    "20170613",
                    "20170614",
                    "20170615",
                    "20170616",
                    "20170617",
                    "20170618",
                    "20170619"
                ],
                "pv": [//浏览页面
                    {
                        "pid": 35496,
                        "name": "好搜",
                        "is_empty": false,
                        "value": [
                            10531,
                            9884,
                            11789,
                            11269,
                            10559,
                            11703,
                            11704,
                            13872,
                            14737,
                            13071,
                        ]
                    }
                ],
                "uv": [//访问用户数
                    {
                        "pid": 35496,
                        "name": "好搜",
                        "is_empty": false,
                        "value": [
                            9976,
                            9239,
                            11144,
                            10301,
                            10166,
                        ]
                    }
                ],
                "time": [//访问时长
                    {
                        "pid": 35496,
                        "name": "好搜",
                        "is_empty": false,
                        "value": [
                            474,
                            464,
                            455,
                            462,
                            473,
                        ]
                    }
                ],
                "download": [//下载量
                    {
                        "pid": 35496,
                        "name": "好搜",
                        "is_empty": false,
                        "value": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ]
                    }
                ],
                "dau": [//日活跃用户量
                    {
                        "pid": 35496,
                        "name": "好搜",
                        "is_empty": true,
                        "value": [
                            0,
                            0,
                            0,
                            0,

                        ]
                    }
                ],
                "total_download": [
                    {
                        "pid": 35496,
                        "name": "好搜",
                        "is_empty": false,
                        "value": [
                            161672,
                            161672,
                            161672,
                            161673,
                            161674,
                            161675,
                            161676,
                            161677,
                            161677,
                            161677,

                        ]
                    }
                ],
                "pv_mid": "1244",
                "uv_mid": "775",
                "time_mid": "131",
                "download_mid": "3",
                "dau_mid": "30968",
                "total_download_mid": "161661"
            }
        }
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
        console.log(categories, data)
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