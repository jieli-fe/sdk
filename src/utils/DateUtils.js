/**** 
 * 日期工具类
 */
/**
 *  日期处理工具类
 *
 */
//DateUtils.strToLong

/**
 * 格式化为几天前、几小时（4d5h,4h5m,5m20s）
 * @param anchorTime
 * @returns {String}
 */
function formatAnchorTime(anchorTime) {
    if (anchorTime == "") {
        return "";
    }
    var strFormat = "";
    var byTime = [365 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000];
    var unit = ["y", "d", "h", "m", "s"];
    var date = new Date();
    var nowtime = date.getTime();
    var difftime = nowtime - anchorTime * 1000;
    strFormat = difftime / 3600;
    if (difftime < 0) {
        return "";
    }

    var sb = [];
    for (var i = 0; i < byTime.length; i++) {
        if (difftime < byTime[i]) {
            continue;
        }
        var temp = Math.floor(difftime / byTime[i]);
        difftime = difftime % byTime[i];
        if (temp > 0) {
            sb.push(temp + unit[i]);
        }

        if (sb.length >= 2) {
            break;
        }
    }
    strFormat = sb.toString().replace(",", "");

    return strFormat;
}
/**
 * 格式化为（4d5h,4h5m,5m20s）
 * @param anchorTime
 * @returns {String}
 * difftime 为秒
 */
function formatDiffTime(difftime) {
    if (difftime == "") {
        return "";
    }
    var strFormat = "";
    var byTime = [365 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000];
    var unit = ["y", "d", "h", "m", "s"];
    difftime = difftime * 1000;
    if (difftime < 0) {
        return "";
    }

    var sb = [];
    for (var i = 0; i < byTime.length; i++) {
        if (difftime < byTime[i]) {
            continue;
        }
        var temp = Math.floor(difftime / byTime[i]);
        difftime = difftime % byTime[i];
        if (temp > 0) {
            sb.push(temp + unit[i]);
        }

        if (sb.length >= 2) {
            break;
        }
    }
    strFormat = sb.toString().replace(",", "");

    return strFormat;
}
/**
 * 格式化AIS时间显示（小于1小时的不显示，大于1小时的显示几天前或几小时前更新）
 * @param anchorTime
 * @returns {String}
 */
function formatAisTime(anchorTime) {
    if (anchorTime == "") {
        return "";
    }
    var strFormat = "";
    var byTime = [24 * 60 * 60 * 1000, 60 * 60 * 1000];
    var unit = ["d前更新", "h前更新"];
    var date = new Date();
    var nowtime = date.getTime();
    var difftime = nowtime - anchorTime * 1000;
    strFormat = difftime / 3600;
    if (difftime < 0) {
        return "";
    }
    var sb = [];
    for (var i = 0; i < byTime.length; i++) {
        if (difftime < byTime[i]) {
            continue;
        }
        var temp = Math.floor(difftime / byTime[i]);
        difftime = difftime % byTime[i];
        if (temp > 0) {
            sb.push(temp + unit[i]);
        }

        if (sb.length >= 1) {
            break;
        }
    }
    strFormat = sb.toString();
    return strFormat;
}
/**   
 * 得到日期在一年当中的周数
 */
function getISOYearWeek(date) {
    var commericalyear = getCommerialYear(date);
    var date2 = getYearFirstWeekDate(commericalyear);
    var day1 = date.getDay();
    if (day1 == 0) day1 = 7;
    var day2 = date2.getDay();
    if (day2 == 0) day2 = 7;
    var d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24 * 60 * 60 * 1000)) / 86400000);
    return Math.floor(d / 7) + 1;
}
/**   
 * 得到一年之中的第一周的日期
 */
function getYearFirstWeekDate(commericalyear) {
    var yearfirstdaydate = new Date(commericalyear, 0, 1);
    var daynum = yearfirstdaydate.getDay();
    var monthday = yearfirstdaydate.getDate();
    if (daynum == 0) daynum = 7;
    if (daynum <= 4) {
        return new Date(yearfirstdaydate.getFullYear(), yearfirstdaydate.getMonth(), monthday + 1 - daynum);
    } else {
        return new Date(yearfirstdaydate.getFullYear(), yearfirstdaydate.getMonth(), monthday + 8 - daynum);
    }
}
/**   
 * 获取当前日期的年份
 */
function getCommerialYear(date) {
    var daynum = date.getDay();
    var monthday = date.getDate();
    if (daynum == 0) daynum = 7;
    var thisthurdaydate = new Date(date.getFullYear(), date.getMonth(), monthday + 4 - daynum);
    return thisthurdaydate.getFullYear();
}
/**   
 * 获取周一
 */
function getWeekStartDate(date) {
    var nowDayOfWeek = (date.getDay() == 0) ? 6 : date.getDay() - 1;
    var t = new Date(date); //复制并操作新对象，避免改动原对象     
    //t.setDate(t.getDate() - nowDayOfWeek);
    t.setTime(t.getTime() - nowDayOfWeek * 86400000);
    return t;
}
/**   
 * 获取周日。本周一+6天 
 */
function getWeekEndDate(date) {
    var t = new Date(date); //复制并操作新对象，避免改动原对象     
    //t.setDate(this.getWeekStartDate(date).getDate() + 6); //date来计算会有出错的情况出现比如10.1这一周
    t.setTime(getWeekStartDate(date).getTime() + 6 * 86400000);
    return t;
}
/**   
 * 日期格式化，第一个参数为日期，第二个参数为日期格式化的格式，返回一个格式化后的字符串
 */
function dateFormat(date, format) {
    var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "h+": date.getHours(), //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        "S": date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
/**   
 * 判断输入的日期格式是否为 yyyy-mm-dd 或 yyyy-m-d
 */
function isDate(dateString) {
    //判断日期是否为空
    if (dateString.trim() == "") {
        alert("日期为空！请输入格式正确的日期\n\r日期格式：yyyy-mm-dd\n\r例    如：2013-08-08\n\r");
        return false;
    } else {
        dateString = dateString.trim();
    }

    //年月日正则表达式
    var r = dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) {
        alert("请输入格式正确的日期\n\r日期格式：yyyy-mm-dd\n\r例    如：2013-08-08\n\r");
        return false;
    }
    var d = new Date(r[1], r[3] - 1, r[4]);
    var num = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
    if (num == 0) {
        alert("请输入格式正确的日期\n\r日期格式：yyyy-mm-dd\n\r例    如：2013-08-08\n\r");
    }
    return (num != 0);

}
//调用该方法(主方法) 
function dateDiff(date1, date2) {
    var type1 = typeof date1,
        type2 = typeof date2;
    if (type1 == 'string')
        date1 = stringToTime(date1);
    else if (date1.getTime)
        date1 = date1.getTime();
    if (type2 == 'string')
        date2 = stringToTime(date2);
    else if (date2.getTime)
        date2 = date2.getTime();
    return (date1 - date2) / 1000; //结果是秒 
}

//字符串转成Time(dateDiff)所需方法 
function stringToTime(string) {
    try {
        var f = string.split(' ', 2);
        var d = "";
        if (string.indexOf("-") >= 0) {
            d = (f[0] ? f[0] : '').split('-', 3);
        } else if (string.indexOf("/") >= 0) {
            d = (f[0] ? f[0] : '').split('/', 3);
        }
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime();
    } catch (e) {
        return string;
    }
}
//格式为"YYYY-mm-dd hh:mm:ss"  "2014-07-10 10:21:12";
//将字符串时间改为时间戳,返回格式yyyy-MM-dd h:m:s safari浏览器不支持
function strToLong(stringTime) {
    return stringToTime(stringTime); /*Date.parse(new Date(stringTime)) 此种写法Safari不兼容*/;
}
//将时间戳转换为格式化时间,
function LongToStr(timemills) {
    var newDate = new Date();
    newDate.setTime(timemills);
    return newDate.Format('yyyy-MM-dd hh:mm:ss');
}

function LongToStr2(timemills, format = 'yyyy/MM/dd hh:mm:ss') {
    var newDate = new Date();
    newDate.setTime(timemills);
    return newDate.Format(format);
}
/******
 *
 * 两个时间戳相减，返回格式化后的日期，如1d6h
 *
 */
function TwoDateSub(time1, time2) {
    if (time1 == "" || time2 == "") {
        return "";
    }
    var strFormat = "";
    var byTime = [365 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000];
    var unit = ["y", "d", "h", "m", "s"];
    var date = new Date();
    var nowtime = date.getTime();
    var difftime = Math.abs(time1 - time2);
    strFormat = difftime / 3600;
    if (difftime < 0) {
        return "";
    }
    var sb = [];
    for (var i = 0; i < byTime.length; i++) {
        if (difftime < byTime[i]) {
            continue;
        }
        var temp = Math.floor(difftime / byTime[i]);
        difftime = difftime % byTime[i];
        if (temp > 0) {
            sb.push(temp + unit[i]);
        }
        if (sb.length >= 2) {
            break;
        }
    }
    strFormat = sb.toString().replace(",", "");
    return strFormat;
}
/******
 *
 * 两个时间戳相减，生成几点几小时等等ƒ
 *
 */
function TwoDateSubNumTime(time1, time2) {
    if (!(time1 && time2)) {
        return "";
    }
    var strFormat = "";
    var byTime = [365 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000];
    var unit = ["年", "天", "时", "分", "秒"];
    var date = new Date();
    var nowtime = date.getTime();
    var difftime = Math.abs(time1 - time2);
    strFormat = difftime / 3600;
    if (difftime < 0) {
        return "";
    }
    var sb = [];
    var i = 0;
    for (i; i < byTime.length; i++) {
        if (difftime < byTime[i]) {
            if (sb.length > 0) {
                sb.push(0);
            }
            continue;
        }
        var temp = Math.floor(difftime / byTime[i]);
        difftime = difftime % byTime[i];
        if (temp > 0) {
            sb.push(temp);
        }
        if (sb.length >= 2) {
            break;
        }
    }
    var str = '';
    if (sb.length === 1) {
        str = sb[0] + unit[i];
    } else {
        switch (i) {
            case 1: //年天
                str = (parseFloat(sb[0]) + parseFloat(sb[1] / 365)).toFixed(1) + unit[i - 1];
                break;
            case 2: //天时
                str = (parseFloat(sb[0]) + parseFloat(sb[1] / 24)).toFixed(1) + unit[i - 1];
                break;
            case 3: //时分
                str = (parseFloat(sb[0]) + parseFloat(sb[1] / 60)).toFixed(1) + unit[i - 1];
                break;
            default:
                str = "0.1时";
        }
    }
    return str;
}
/***两个时间戳相减***/
function TwoDateSub2(time1, time2) {
    if (time1 == "" || time2 == "") {
        return "";
    }
    var strFormat = "";
    var byTime = [365 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000];
    var unit = ["y", "d", "h", "m", "s"];
    var date = new Date();
    var nowtime = date.getTime();
    var difftime = Math.abs(time1 - time2);
    strFormat = difftime / (3600 * 1000 * 24);
    return Math.ceil(strFormat);
}
/*****两个日期相减
 * 格式为 yyyy-mm-dd
 ***/
function DateSub(date1, date2) {
    if (date1 == null || date1 == "" || date2 == null || date2 == "") return;
    date1 = date1.replace(/-/g, "/");
    date2 = date2.replace(/-/g, "/");
    date1 = new Date(date1);
    date2 = new Date(date2);
    var days = date1.getTime() - date2.getTime();

    var time = days / (1000 * 60 * 60 * 24); // parseInt(
    return time;
}
//返回减了指定月份后的数据
function monthSubDay(num, sdate) {
    var d = sdate || new Date();
    //当前月份  
    var oldMonth = d.getMonth();
    //当前几号  
    var oldDay = d.getDate();
    //每月多少天，平年  
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //闰年二月为29天  
    var fullYear = d.getFullYear();
    if ((fullYear % 4 == 0 && fullYear % 100 != 0) || fullYear % 400 == 0) {
        days[1] = 29;
    }
    //加月，设置月为：当前月份+要加的月数  
    d.setMonth(oldMonth + num);
    //计算月日  
    var newDay = d.getDate();
    if (oldDay == days[oldMonth]) {
        if (newDay != oldDay) {
            //设置新日期为：新日期的上个月的最后一天  
            d.setDate(0);
        } else {
            //设置为当月最后一天  
            d.setDate(1);
            d.setMonth(d.getMonth() + 1);
            d.setDate(0);
        }
    }
    return d;
}
/****基于某个时间点增加月份，sdate为空则是当前时间***/
function monthAdd(num, sdate) {
    try {
        var d = monthSubDay(num, sdate);
        //输出年月日，月日不足10前面补0  
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        var dd = d.getDate();
        if (m < 10) {
            m = '0' + m;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        return y + "-" + m + "-" + dd;
    } catch (e) {
        console.log(e)
    }
}


Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/,
        (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 8 ? (this.getMonth() + 1)
        .toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes()
        .toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds()
        .toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}
Date.prototype.DateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's':
            return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n':
            return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h':
            return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd':
            return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w':
            return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3,
                dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
                    .getSeconds());
        case 'm':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp
                .getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
                    .getSeconds());
        case 'y':
            return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp
                .getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
                    .getSeconds());
    }
}
//日期格式化
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
export {
    LongToStr2,
    formatAnchorTime,
    formatAisTime,
    dateDiff,
    formatDiffTime,
    TwoDateSub2,
    TwoDateSub,
    strToLong,
    LongToStr,
    monthAdd
}