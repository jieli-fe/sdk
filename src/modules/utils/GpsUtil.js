/***
 *数值转换到度分
 *duStr：经纬度数值
 *duDir：经纬度方向表示值，n,e,s,w
 *fixednum:保留位数，默认2位
 */
function duToGpsDM(duStr, duDir, fixednum) {
    duStr = (duStr.toString()).replace(/\s+/g, "");
    // duDir=duDir.toUpperCase();
    var strLength = duStr.length;
    var tempString = "";
    var tempStrArray = new Array();
    var tempCount = 0;
    var tempPointFlag = 0;
    var gpsDM;
    for (var i = 0; i <= strLength; i++) {
        if (duStr[i] >= '0' && duStr[i] <= '9') {
            tempPointFlag = 1;
            tempString += duStr[i];
            continue;
        } else if (duStr[i] == '.') {
            tempStrArray[tempCount] = tempString;
            tempString = "";
            tempCount++;
            tempStrArray[tempCount] = '.';
            tempPointFlag = 1;
            tempCount++;
        } else if (tempString.length > 0) {
            tempStrArray[tempCount] = tempString;
            tempString = "";
            tempCount++;
        }
    }
    if (tempPointFlag == 1) {
        var num1 = tempStrArray[0];
        if (!fixednum) fixednum = 2;
        var num2 = (parseFloat('0' + tempStrArray[1] + tempStrArray[2], 10) * 60).toFixed(fixednum);
        // gpsDM=duDir+" "+num1+"°"+num2+"′";
        gpsDM = +num1 + "°" + num2 + "′" + " " + duDir;
        // console.log(gpsDM);
    }
    return gpsDM;
}

 /******
  * 经纬度转坐标值
  * gpsStr：经纬度坐标值
  ************/
function gpsToDu(gpsStr) {
    gpsStr = gpsStr.toLowerCase();
    gpsStr = gpsStr.replace(/\s+/g, "");
    var tempStrArray = new Array();
    var flag = 1;
    var lastFlag = 0;
    var strLength = gpsStr.length;
    var gpsDu = new Array();
    var gpsDir;
    var tempcount = 0;
    var tempString = "";
    var tempPointFlag = 0;
    if (gpsStr[0] == 'w' || gpsStr[0] == 's') {
        flag = -1;
        lastFlag = 0;
        gpsDir = gpsStr[0];
    } else if (gpsStr[strLength - 1] == 'w' || gpsStr[strLength - 1] == 's') {
        flag = -1;
        lastFlag = 1;
        gpsDir = gpsStr[strLength - 1];
    }
    for (var i = 0; i <= strLength; i++) {
        if (gpsStr[i] >= '0' && gpsStr[i] <= '9') {
            tempString += gpsStr[i];
            continue;
        } else if (gpsStr[i] == '.') {
            tempStrArray[tempcount] = tempString;
            tempString = "";
            tempcount++;
            tempStrArray[tempcount] = '.';
            tempPointFlag = 1;
            tempcount++;
        } else if (tempString.length > 0) {
            tempStrArray[tempcount] = tempString;
            tempString = "";
            tempcount++;
        }
    }
    if (tempPointFlag == 0) {
        var num1 = parseInt(tempStrArray[0], 10);
        var num2 = parseInt(tempStrArray[1], 10);
        var num3 = parseInt(tempStrArray[2], 10);
        console.log(num1 + '  ' + num2 / 60 + ' ' + num3 / (60 * 60));
        gpsDu[1] = num1 + num2 / 60 + num3 / (60 * 60);
        gpsDu[1] = gpsDu[1] * flag;
        gpsDu[0] = gpsDir;
    } else if (tempPointFlag == 1) {
        var num1 = parseInt(tempStrArray[0], 10);
        var num2 = parseFloat(tempStrArray[1] + '.' + tempStrArray[3], 10);
        gpsDu[1] = num1 + num2 / 60;
        gpsDu[1] = gpsDu[1] * flag;
        gpsDu[0] = gpsDir;
    }
    return gpsDu;
}
/*****
数值转换为度分秒*
*
*duStr：经纬度数值
*duDir：经纬度方向表示值，n,e,s,w
***********/
function duToGpsDMS(duStr, duDir) {
    // duStr=duStr.toLowerCase();
    duStr = (duStr.toString()).replace(/\s+/g, "");
    // duDir=duDir.toUpperCase();
    var strLength = duStr.length;
    var tempString = "";
    var tempStrArray = new Array();
    var tempCount = 0;
    var tempPointFlag = 0;
    var gpsDMS;
    for (var i = 0; i <= strLength; i++) {
        if (duStr[i] >= '0' && duStr[i] <= '9') {
            tempPointFlag = 1;
            tempString += duStr[i];
            continue;
        } else if (duStr[i] == '.') {
            tempStrArray[tempCount] = tempString;
            tempString = "";
            tempCount++;
            tempStrArray[tempCount] = '.';
            tempPointFlag = 1;
            tempCount++;
        } else if (tempString.length > 0) {
            tempStrArray[tempCount] = tempString;
            tempString = "";
            tempCount++;
        }
    }
    if (tempPointFlag == 1) {
        var num1 = tempStrArray[0];
        var num2 = parseFloat('0' + tempStrArray[1] + tempStrArray[2], 10) * 60;
        var num3 = parseInt(parseFloat((num2 - parseInt(num2, 10)) * 60, 10), 10);
        num2 = parseInt(num2, 10);
        //  console.log(tempStrArray);
        //  console.log(num1+"   "+num2+"   "+num3+ " ");
        //gpsDMS=duDir+" "+num1+"°"+num2+"′"+num3+"″";
        gpsDMS = +num1 + "°" + num2 + "′" + num3 + "″" + " " + duDir;
        // console.log(gpsDMS);
    }
    return gpsDMS;
}

export{
    duToGpsDMS,
    gpsToDu,
    duToGpsDM
}