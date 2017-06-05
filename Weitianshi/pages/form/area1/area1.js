var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        province: [],
        city: [],
        background: [],
        belongArea: '',
        console_province: ''
    },
    onLoad: function (options) {
        var that = this;
        console.log(options);
        var provinceNumFirst = wx.getStorageSync('provinceNum') || [];
        var cityNumFirst = wx.getStorageSync('cityNum') || [];
        var current = options.current;
        var provinceNum = parseInt(options.provinceNum) || parseInt(provinceNumFirst)//初始地区
        var cityNum = parseInt(options.cityNum) || parseInt(cityNumFirst);//市
        console.log(provinceNumFirst, provinceNum);
        that.setData({
            current: current
        });
        var provinceArr = [];
        var cityArr = [];
        var index=0;
        var cityindex=0
        // current==0发布融资项目 current==1 维护融资项目 current==2 添加投资案例
        wx.request({
            url:app.globalData.url_common+'/api/category/getArea',
            data: {
                pid: 0
            },
            method: 'POST',
            success: function (res) {
                //console.log(res)
                var province = res.data.data;
                // console.log(province)
                for(var i=0; i<province.length; i++){
                    provinceArr.push(province[i].area_id)        
                }
                index = provinceArr.indexOf(provinceNum)
                console.log(provinceArr, provinceNum)
                var backgrond = [];
                backgrond[index]=1;
                // console.log(backgrond);
                that.setData({
                    province: province,
                    backgrond:backgrond,
                    provinceNum: provinceNum
                })
                
                wx.request({
                    url: app.globalData.url_common+'/api/category/getArea',
                    data: {
                        pid: provinceNum//请求获取省的id
                    },
                    method: 'POST',
                    success: function (res) {                
                        var city = res.data.data;
                        // console.log(res)
                        // console.log(city)
                         for(var i=0; i<city.length; i++){
                            cityArr.push(city[i].area_id)    
                        }
                        cityindex=cityArr.indexOf(cityNum)
                        var backgroundcity = [];
                        
                        backgroundcity[cityindex]=1;

                        if (cityindex == -1) {
                          city=""
                        }

                        console.log(backgroundcity, city);
                        that.setData({
                            city: city,
                            backgroundcity: backgroundcity
                        })
                        console.log(backgroundcity);
                    }
                });
                
                //console.log(provinceArr,provinceNum)
                //console.log(provinceArr.indexOf(provinceNum))

            },
        })      
        
    },
    province: function (e) {
        var that = this;
        var background = [];
        var index = e.target.dataset.index;
        var id = e.target.dataset.id;
        var province = this.data.province;
        var backgroundcity=this.data.backgroundcity;

        var console_province = this.data.console_province;
        // console.log(index)
        background[index] = 1;
        console.log(background,province,console_province)
        that.setData({
            backgrond: background,
            belongArea: province[index],
            console_province: province[index].area_title,
            provinceNum: province[index].area_id,
            backgroundcity:[]
        });
        console.log(this.data.provinceNum)

        // console.log(this.data.console_province);
        wx.request({
            url: app.globalData.url_common+'/api/category/getArea',
            data: {
                pid: id 
            },
            method: 'POST',
            success: function (res) {
                // console.log(res)
                // console.log(city)
                var city = res.data.data;
                that.setData({
                    city: city,
                    backgroundcity:""
                })
            }
        });
        //   console.log(province[index])
        
    },
    city: function (e) {
        var that = this;
        var index = e.target.dataset.index;
        var id = e.target.dataset.id;
        var city = this.data.city;
        var current = this.data.current;
        that.setData({
            belongArea: this.data.console_province + city[index].area_title,
            cityNum: city[index].area_id
        });
        console.log(this.data.console_province,this.data.belongArea,this.data.provinceNum,this.data.cityNum)
        if (current == 0) {
            if (this.data.belongArea == "") {
                wx.setStorageSync('belongArea', "选择地区");
            } else {
                wx.setStorageSync('belongArea', this.data.belongArea);
                wx.setStorageSync('provinceNum', this.data.provinceNum);
                wx.setStorageSync('cityNum', this.data.cityNum);
            }
        } else if (current == 1) {
            if (this.data.belongArea == "") {
                wx.setStorageSync('m_belongArea', "选择地区")
            } else {
              
                wx.setStorageSync('m_belongArea', this.data.belongArea);
                wx.setStorageSync('m_provinceNum', this.data.provinceNum);
                wx.setStorageSync('m_cityNum', this.data.cityNum);
            }
        } else if(current ==2){
          console.log(this.data.belongArea)
            if(this.data.belongArea ==""){
                wx.setStorage({
                  key: 'addcase_belongArea',
                  data: {
                      belongArea:this.data.belongArea
                  },
                })
            }else{
                wx.setStorage({
                  key: 'addcase_belongArea',
                  data: {
                      belongArea:this.data.belongArea,
                      provinceNum:this.data.provinceNum,
                      cityNum:this.data.cityNum
                  },
                })
                wx.setStorageSync('provinceNum', this.data.provinceNum);
                wx.setStorageSync('cityNum', this.data.cityNum);
            }
        }

        // console.log(this.data.belongArea, this.data.provinceNum, this.data.cityNum);


        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })

    },
    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新")
        wx.stopPullDownRefresh()
    }
});