

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



//函数输出
module.exports = {
    errorHide:errorHide
}
