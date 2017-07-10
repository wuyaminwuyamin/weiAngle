var rqj = require('../../Template/Template.js');
var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        winWidth: 0,//选项卡
        winHeight: 0,//选项卡
        currentTab: 0,//选项卡
        firstName: "代",
        id: "",
        page: 0,
        user_id: 0,
        industy_sort: [],
        bp_title: "",//bp名称
        ipo_release: "",//
        pro_company_name: "",//公司的名称
        pro_company_start_name: "",//
        pro_goodness: "",//项目亮点
        projectName: "",
        companyName: "",
        pro_company_start_time: "",//项目创建时间
        pro_name: "",//项目名称
        pro_source: "",//项目来源
        pro_intro: "",//项目介绍
        stock: 0,
        page_end: false,
        pro_status: {},//运营状态
        loadMorecheck: true//下拉加载更多判断
    },
    onLoad: function (options) {
        //  投资人数据
        var that = this;
        var id = options.id;
        var index = options.index;
        var user_id = wx.getStorageSync('user_id');
        var page = this.data.page;
        var avatarUrl = wx.getStorageSync('avatarUrl');
        var investors = wx.getStorageSync('investors') || '';//所有项目对应四位投资人
        console.log(investors)
        app.console(index)
        that.setData({
            index: index,
            id: id,
            user_id: user_id,
            avatarUrl: avatarUrl,
            investor: investors[index],
            currentTab: options.currentTab
        });
        var investor = this.data.investor;
        var industry_tag = [];
        var scale_tag = [];
        var stage_tag = [];
        var pro_goodness = "";
        if (investors != '') {
            for (var i = 0; i < investor.length; i++) {
                industry_tag.push(investor[i].industry_tag);
                scale_tag.push(investor[i].scale_tag);
                stage_tag.push(investor[i].stage_tag);
            }
            that.setData({
                industry_tag: industry_tag,
                stage_tag: stage_tag,
                scale_tag: scale_tag
            });
        }
        //项目详情(不包括投资人)
        var other_id = wx.getStorageSync('user_id');
        if (user_id == other_id) {
            wx.request({
                url: url_common + '/api/project/getProjectDetail',
                data: {
                    user_id: user_id,
                    project_id: this.data.id,
                },
                method: 'POST',
                success: function (res) {
                    var project = res.data.data;
                    app.console("项目详情")
                    app.console(res);
                    var user = res.data.user;
                    let companyName = project.pro_company_name;
                    wx.setStorageSync("companyName", companyName)
                    let pro_goodness = res.data.data.pro_goodness;
                    let industy_sort = [];
                    var firstName = user.user_name.substr(0, 1);
                    let pro_finance_stock_after = Math.round(project.pro_finance_stock_after);
                    that.setData({
                        project: project,
                        user: user,
                        firstName: firstName,
                        company_name: company_name,
                        pro_finance_stock_after: pro_finance_stock_after
                    });
                    // 项目介绍的标签
                    var pro_industry = project.pro_industry;
                    for (var i = 0; i < pro_industry.length; i++) {
                        industy_sort.push(pro_industry[i].industry_name)
                    }
                    that.setData({
                        industy_sort: industy_sort
                    })
                    // 核心团队
                    if (project.core_users != 0) {
                        let core_memberArray = project.core_users;
                        core_memberArray.forEach((x, index) => {
                            core_memberArray[index] = x;
                            that.setData({
                                core_memberArray: core_memberArray
                            })
                        })
                    }
                    // 标签 type:0; 项目标签 type:1 团队标签
                    let infoTagArray = project.tag;
                    let tagOfPro = [];//项目资料的标签
                    let teamOfPro = [];//核心团队的标签
                    for (var i = 0; i < infoTagArray.length; i++) {
                        if (infoTagArray[i].type == 0) {
                            tagOfPro.push(infoTagArray[i])
                        } else if (infoTagArray[i].type == 1) {
                            teamOfPro.push(infoTagArray[i])
                        }
                    }
                    tagOfPro.forEach((x, index) => {
                        tagOfPro[index].tag_name = x.tag_name;
                        console.log(tagOfPro[index].tag_name)
                        that.setData({
                            tagOfPro: tagOfPro
                        })
                    })
                    teamOfPro.forEach((x, index) => {
                        teamOfPro[index].tag_name = x.tag_name;
                        that.setData({
                            teamOfPro: teamOfPro
                        })
                    })
                    // 融资信息
                    let pro_history_financeList = project.pro_history_finance;
                    pro_history_financeList.forEach((x, index) => {
                        pro_history_financeList[index].finance_time = app.changeTime(x.finance_time);
                        pro_history_financeList[index].pro_finance_scale = x.pro_finance_scale;
                        pro_history_financeList[index].pro_finance_investor = x.pro_finance_investor;
                        pro_history_financeList[index].belongs_to_stage.stage_name = x.belongs_to_stage.stage_name;
                        that.setData({
                            pro_history_financeList: pro_history_financeList
                        })
                    })
                    // 里程碑
                    let mileStoneArray = project.pro_develop;
                    console.log(project.pro_develop)
                    mileStoneArray.forEach((x, index) => {
                        mileStoneArray[index].dh_start_time = app.changeTime(x.dh_start_time);
                        mileStoneArray[index].dh_event = x.dh_event;
                        that.setData({
                            mileStoneArray: mileStoneArray
                        })
                    })
                    that.setData({
                        industy_sort: industy_sort,
                        pro_goodness: pro_goodness
                    });
                },
            })
        }
        //一键尽调
        //公司信息
        var that = this;
        // let company_name = wx.getStorageSync("companyName");
        // console.log(company_name)
        let company_name = "北京大杰致远信息技术有限公司";
        // let company_name = "上海艺娱信息科技有限公司";
        // let company_name = "杭州投着乐网络科技有限公司"
        wx.request({
            url: url_common + '/api/dataTeam/getCrawlerCompany',
            data: {
                user_id: user_id,
                company_name: company_name
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                let nothing = res.data.data.length;
                console.log(nothing)
                if (nothing == 0) {
                    that.setData({
                        nothing: nothing
                    })
                } else {
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
                                projectDetailsList[index].project_views = x.project_views;
                                // 分割字符串
                                var project_labelList = projectDetailsList[0].project_label;
                                var project_labelArray = new Array(); //定义一数组 
                                project_labelArray = project_labelList.split(","); //字符分割 
                                project_labelArray.forEach((x, index) => {
                                    project_labelArray[index] = x;
                                    that.setData({
                                        project_labelArray: project_labelArray
                                    })
                                })

                                let project_views = JSON.parse(projectDetailsList[0].project_views);
                                // app下载量
                                console.log(project_views)


                                // wxChart大小设定
                                var windowWidth = 320;
                                try {
                                    var res = wx.getSystemInfoSync();
                                    windowWidth = res.windowWidth;
                                } catch (e) {
                                    console.error('getSystemInfoSync failed!');
                                }
                                
                                // wxChart图表的数据处理
                                var mid = parseInt(project_views.data.total_download_mid);
                                var downLoad = project_views.data.total_download[0].value;
                                var midArr=[]
                                for(let i=0;i<90;i++){
                                    midArr.push(mid)
                                }
                                var categories = project_views.data.three_month;
                                console.log(categories)
                                //  wxChart图表
                                var simulationData={
                                    categories:project_views.data.three_month,
                                }
                                // var simulationData = that.createSimulationData();
                            
                                console.log(simulationData)
                                console.log(downLoad,midArr)
                                var lineChart = new wxCharts({
                                    canvasId: 'lineCanvas',
                                    type: 'line',
                                    categories: simulationData.categories,
                                    animation: true,
                                    background: '#f5f5f5',
                                    series: [{
                                        name: '微天使乐投平台',
                                        data: downLoad,
                                        format: function (val, name) {
                                            return val.toFixed(2) + '万';
                                        }
                                    }, {
                                        name: '行业平均',
                                        data: midArr,
                                        format: function (val, name) {
                                            return val.toFixed(2) + '万';
                                        }
                                    }],
                                    xAxis: {
                                        disableGrid: true
                                    },
                                    yAxis: {
                                        title: '',
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


                                var simulationData = that.createSimulationData();
                                console.log(simulationData)
                                /*var lineChart = new wxCharts({
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
                                    dataPointShape: true,
                                    extra: {
                                        lineStyle: 'curve'
                                    }
                                });*/
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
                                historyFinance[index].history_financing_time = app.changeTimeStyle(x.history_financing_time);
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
                                    mileStone[index].milestone_time = app.changeTimeStyle(x.milestone_time);
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
                            app.console("新聞")
                            app.console(res)
                            let newsList = res.data.data;
                            newsList.forEach((x, index) => {
                                newsList[index].project_news_label = x.project_news_label;
                                newsList[index].source = x.source;
                                newsList[index].project_news_time = app.changeTimeStyle(x.project_news_time);
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
                                competeList[index].competing_goods_Financing_time = app.changeTimeStyle(x.competing_goods_Financing_time);
                                competeList[index].competing_goods_Set_up = app.changeTimeStyle(x.competing_goods_Set_up);
                                competeList[index].competing_goods_industry = x.competing_goods_industry;
                                that.setData({
                                    competeList: competeList
                                })
                            })
                        }
                    })
                }
            }
        })

    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },
    /*滑动切换tab*/
    bindChange: function (e) {
        var that = this;
        var current = e.detail.current;
        that.setData({ currentTab: e.detail.current });
    },
    /*点击tab切换*/
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    //进入投资人用户详情
    detail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
        })
    },
    //触底加载
    loadMore: function () {
        var that = this;
        var page = this.data.page;
        var user_id = this.data.user_id;
        var pro_id = this.data.id;
        var page_end = this.data.page_end;
        var loadMorecheck = this.data.loadMorecheck;
        if (loadMorecheck) {
            if (page_end == false) {
                wx.showToast({
                    title: 'loading...',
                    icon: 'loading'
                })
                page++;
                that.setData({
                    page: page,
                });
                wx.request({
                    url: url + '/api/project/getProjectMatchInvestors',
                    data: {
                        user_id: user_id,
                        pro_id: pro_id,
                        page: page
                    },
                    method: 'POST',
                    success: function (res) {
                        var investor2 = res.data.data;
                        app.console(investor2)
                        that.setData({
                            investor2: investor2,
                            page_end: res.data.page_end
                        });
                        wx.hideToast({
                            title: 'loading...',
                            icon: 'loading'
                        })
                    }
                })
            } else {
                rqj.errorHide(that, "没有更多了", 3000)
            }
        }
        this.setData({
            loadMorecheck: false
        });
    },
    //维护项目
    maintainProject() {
        var id = this.data.id;
        var user_id = this.data.user_id;
        wx.navigateTo({
            url: '/pages/myProject/editProject/editProject?pro_id=' + id + "&&user_id=" + user_id,
        })
    },
    //分享当前页面
    onShareAppMessage: function () {
        var pro_intro = this.data.project.pro_intro;
        app.console(this.data.id)
        return {
            title: pro_intro,
            path: '/pages/projectDetail/projectDetail?id=' + this.data.id
        }
    },
    //跳转到我的页面
    toMy: function () {
        wx.switchTab({
            url: '/pages/my/my/my',
        })
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
    //查看全部
    checkMore: function (e) {
        let id = e.target.dataset.id;
        console.log(id)
        if (id == 1) {
            this.setData({
                more: 1
            })
        } else if (id == 2) {
            this.setData({
                more: 2
            })
        } else if (id == 3) {
            this.setData({
                more: 3
            })
        }
    },
    // 浏览
    viewProject: function () {
        wx.navigateTo({
            url: '/pages/message/viewProjectUser/viewProjectUser',
        })
    },
    // 完善公司信息
    writeCompanyName: function () {
    },
    // 查看bp
    sendBp: function () {
        let that = this;
        let user_id = wx.getStorageSync("user_id");
        wx.request({
            url: url + '/api/user/checkUserInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                let userEmail = res.data.user_email;
                console.log(userEmail)
                that.setData({
                    userEmail: userEmail,
                    sendPc: 1
                })
            }
        })
    }

});