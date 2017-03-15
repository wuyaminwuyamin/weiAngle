

var _this

//错误提示消失
function errorHide(target, errorText, time) {
    var that = target;
    that.setData({
        error: "1",
        error_text: errorText
    })
    var errorTime = setTimeout(function () {
        that.setData({
            error: "0"
        });
    }, time)
}

//循环出用户投资信息
function userNeed(that) {
    var userNeed={};
    var user_industry=[];
    var user_industryId=[];
    var user_area=[];
    var user_areaId=[];
    var user_stage=[];
    var user_stageId=[];
    var user_scale=[];
    var user_scaleId=[];
    var user_id = wx.getStorageSync('user_id')
    if (user_id != 0) {
        wx.request({
            url: 'https://www.weitianshi.com.cn/api/investors/checkInvestorInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                var investor = res.data.data;
                var industry = investor.industry_tag;
                for (var i = 0; i < industry.length; i++) {
                    user_industry.push(industry[i].industry_name);
                    user_industryId.push(industry[i].industry_id)
                }
                var area = investor.area_tag;
                for (var i = 0; i < area.length; i++) {
                    user_area.push(area[i].area_title);
                    user_areaId.push(area[i].area_id)
                }
                var scale = investor.scale_tag;
                for (var i = 0; i < scale.length; i++) {
                    user_scale.push(scale[i].scale_money)
                    user_scaleId.push(scale[i].scale_id)
                }
                var stage = investor.stage_tag;
                for (var i = 0; i < stage.length; i++) {
                    user_stage.push(stage[i].stage_name)
                    user_stageId.push(stage[i].stage_id)
                }
            }
        })
    }
    userNeed.user_industry = user_industry;
    userNeed.user_industryId = user_industryId;
    userNeed.user_area = user_area;
    userNeed.user_areaId = user_areaId;
    userNeed.user_stage = user_stage;
    userNeed.user_stageId = user_stageId;
    userNeed.user_scale = user_scale;
    userNeed.user_scaleId = user_scaleId;
    return userNeed;
}



//函数输出
module.exports = {
    errorHide: errorHide,
    userNeed: userNeed
}
