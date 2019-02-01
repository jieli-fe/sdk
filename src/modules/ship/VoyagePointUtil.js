//跨180度经度处理
import Constants from "../constants/Constants";
import {
    LonLatTrans
} from "../utils/GpsCorrect";
import {
    getDirecIcon
} from "./ShipCommon";

class VoyagePointUtil {

    calcuteLngLat(lonmark, val) {
        if (lonmark < 0) {
            val = parseFloat(val) - 360;
        } else if (lonmark > 0) {
            val = parseFloat(val) + 360;
        }
        return val;
    }

    getCalcuteLtlg(lonmark, val, rate) {
        if (lonmark < 0) {
            val = parseFloat(val) - 360 * rate;
        } else if (lonmark > 0) {
            val = parseFloat(val) + 360 * rate;
        }
        return val;
    }

    /**
     *
     * 跨180度处理
     * @param {*} dataArray
     * @param {*} filedname
     * @param {*} rate
     * @returns
     * @memberof VoyagePointUtil
     */
    calcuteDateLineVals(dataArray, filedname, rate) {
        try {
            if (!dataArray || dataArray.length <= 1) return dataArray;
            var course_targ = false;
            var latLonmark = dataArray[0][filedname];
            dataArray[0].oldlon = dataArray[0][filedname];
            /***顺序执行，从第二个点开始***/
            for (var i = 1; i < dataArray.length; i++) {
                dataArray[i].oldlon = dataArray[i][filedname];
                var subValue = Math.abs(dataArray[i - 1].oldlon - dataArray[i][filedname]) / rate;
                if (subValue >= 180 && !course_targ) {
                    latLonmark = dataArray[i - 1].oldlon;
                    dataArray[i][filedname] = this.getCalcuteLtlg(latLonmark, dataArray[i][filedname], rate);
                    course_targ = true;
                } else if (subValue >= 180 && course_targ) {
                    course_targ = false;
                } else if (course_targ) {
                    dataArray[i][filedname] = this.getCalcuteLtlg(latLonmark, dataArray[i][filedname], rate);
                }
            }
            return dataArray;
        } catch (e) {
            console.log(e);
            return dataArray;
        }
    }

    /**
     *根据船舶位置来处理跨180问题
     *
     * @param {*} dataList
     * @param {*} shipLon
     * @param {*} filedName
     * @memberof VoyagePointUtil
     */
    getDateLineByShip(dataList, shipLon, filedName) {
        if (!dataList) return;
        //第一个点和船舶位置相反即需要倒序数组
        if ((parseFloat(shipLon) > 0 && dataList[0][filedName] < 0) || (parseFloat(shipLon) < 0 && dataList[0][filedName] > 0)) {
            dataList = this.calcuteDateLineVals(dataList.reverse(), filedName, Constants.LATLON);
            return dataList.reverse();
        } else {
            return this.calcuteDateLineVals(dataList, filedName, Constants.LATLON);
        }
    }

    /**
     *轨迹点抽稀
     *
     * @param {*} dataArray
     * @param {*} latfiled
     * @param {*} lngfiled
     * @param {*} rate
     * @param {*} map
     * @returns
     * @memberof VoyagePointUtil
     */
    pointDataSparing(dataArray, latfiled, lngfiled, rate, map, sparsevalue) {
        var resultData = [];
        try {
            sparsevalue = sparsevalue || Constants.MIN_POINT_DISTANCE;
            if (dataArray && dataArray.length > 2) {
                var lastlatlng = null;
                lastlatlng = new L.LatLng(dataArray[0][latfiled] / rate, dataArray[0][lngfiled] / rate);
                var pt = map.latLngToLayerPoint(lastlatlng);
                resultData.push(dataArray[0]);
                var len = dataArray.length;
                for (var i = 1; i < len - 1; i++) {
                    var newlatlng = new L.LatLng(dataArray[i][latfiled] / rate, dataArray[i][lngfiled] / rate);
                    var newpt = map.latLngToLayerPoint(newlatlng);
                    if (newpt.distanceTo(pt) > sparsevalue) {
                        resultData.push(dataArray[i]);
                        lastlatlng = newlatlng;
                        pt = newpt;
                    }
                }
                /**最后一个点需要存储到数组中**/
                resultData.push(dataArray[len - 1]);
            } else {
                resultData = dataArray;
            }
        } catch (e) {
            console.log(e);
            resultData = dataArray;
        }
        return resultData;
    }

    /**
     *轨迹点180度判断处理
     *
     * @param {*} stopArray 启停轨迹点
     * @param {*} voyageArray 正常轨迹点
     * @memberof DateLineUtil
     */
    getStartStopDateLine(stopArray, voyageArray, lngfiled) {
        var timeobject = new Object();
        if (!stopArray || stopArray.length <= 0) return;
        for (var keys in voyageArray) {
            var status = voyageArray[keys].navigate_status;
            if (status == "2" || status == "3" || status == "4") {
                timeobject[voyageArray[keys].postime] = (voyageArray[keys]);
            }
        }
        for (var i in stopArray) {
            var timedata = timeobject[stopArray[i].postime]
            if (timedata) {
                stopArray[i][lngfiled] = timedata[lngfiled];
            }
        }
        return stopArray;
    }


    /**
     *
     * 数据合并处理
     * @param {*} voyagePoint
     * @param {*} startStopPoint
     * @returns
     * @memberof VoyagePointUtil
     */
    dataListMerge(voyagePoint, startStopPoint) {
        if (!voyagePoint || voyagePoint.length == 0) {
            return startStopPoint;
        } else if (!startStopPoint || startStopPoint.length == 0) {
            return voyagePoint;
        } else {
            var i = 0,
                j = startStopPoint.length - 1,
                NdataArray = [];
            // alert(voyagePoint.length);
            while (i < voyagePoint.length && j >= 0) {
                if (voyagePoint[i].postime > startStopPoint[j].postime) {
                    if (startStopPoint[j].navigate_status != "1") {
                        NdataArray.push(startStopPoint[j]);
                    }
                    j--;
                } else if (voyagePoint[i].postime < startStopPoint[j].postime) {
                    NdataArray.push(voyagePoint[i++]); // i++;

                } else if (voyagePoint[i].postime == startStopPoint[j].postime) {
                    voyagePoint[i].navigate_status = startStopPoint[j].navigate_status //将部分信息合并，做跨时间变更线的时候有用
                    NdataArray.push(voyagePoint[i++]); //  i++;
                    j--;
                }
            }
            while (i < voyagePoint.length) {
                NdataArray.push(voyagePoint[i++]); // i++;
            }
            while (j >= 0) {
                if (startStopPoint[j].navigate_status != "1") {
                    NdataArray.push(startStopPoint[j]); //j--;
                }
                j--;
            }
            return NdataArray;
        }
    }


    curTracksUtil(dataArray, curlon) {
        try {
            if (dataArray == null || dataArray.length <= 1) return;
            var course_targ = false;
            var culonvalue = parseFloat(curlon);
            //从第二个点开始,记录跨越前的一个点
            for (var i = dataArray.length - 1; i >= 0; i--) {
                //判断当前点的经纬度值是否大于180或者小于-180
                dataArray[i].oldlon = dataArray[i].longitude;
                var subValue = 0;
                if (i == dataArray.length - 1) {
                    subValue = Math.abs(dataArray[i].longitude - culonvalue) / Constants.LATLON;
                } else {
                    subValue = Math.abs(dataArray[i].longitude - dataArray[i + 1].oldlon) / Constants.LATLON;
                }
                if (subValue >= 180 && !course_targ) {
                    culonvalue = dataArray[i + 1].oldlon;
                    dataArray[i].longitude = this.getCalcuteLtlg(culonvalue, dataArray[i].longitude, Constants.LATLON);
                    course_targ = true;
                } else if (subValue >= 180 && course_targ) { //解决多次跨越问题，第二次跨越
                    course_targ = false;
                } else if (course_targ) { //第一次跨域时候以及后面的点
                    dataArray[i].longitude = this.getCalcuteLtlg(culonvalue, dataArray[i].longitude, Constants.LATLON);
                }
            }
        } catch (e) {
            console.log(e);
        }
        return dataArray;
    }

    /********船舶轨迹方向处理********** */

    /******
     *计划航线，转向点的方向计算
     *
     *lnglat1, lnglat2 两个坐标点
     * @return 返回计算后的旋转方向
     ***/
    getVoMarkerRotate(lnglat1, lnglat2) {
        var course = 0;
        if (lnglat2.lng == lnglat1.lng) {
            if (lnglat2.lat > lnglat1.lat) {
                course = 0;
            } else {
                course = 180;
            }
        } else {
            var tan = Math.atan((lnglat2.lat - lnglat1.lat) / (lnglat2.lng - lnglat1.lng)) * 180 / Math.PI;
            if (tan > 0) {
                if ((lnglat2.lng - lnglat1.lng) < 0) {
                    course = 270 - tan;
                } else {
                    course = 90 - tan;
                }
            } else {
                if ((lnglat2.lng - lnglat1.lng) > 0) {
                    course = -tan + 90;
                } else {
                    course = 270 - tan;
                }
            }
        }
        return course;
    }
    //求相连两个点的中间点
    getRotatePoint(dataArray, mapview) {
        var zoomValue = mapview.getZoom();
        var newDataArray = [];
        if (dataArray == undefined || dataArray.length <= 1) return;
        for (var i in dataArray) {
            if (parseInt(i) == dataArray.length - 1) break;
            var pointxvalue = ((dataArray[i].latitude / Constants.LATLON) + (dataArray[parseInt(i) + 1].latitude / Constants.LATLON)) / 2;
            var pointyvalue = ((dataArray[i].longitude / Constants.LATLON) + (dataArray[parseInt(i) + 1].longitude / Constants.LATLON)) / 2;
            var midpointlnglat = L.latLng(pointxvalue, pointyvalue);
            var midObject = {};
            midObject.postionvalue = parseInt(parseInt(i) + 1);
            midObject.midpointlnglat = midpointlnglat;
            newDataArray.push(midObject);
        }
        return newDataArray;
    }
    /**
     *dataArray:原始数据
     *
     */
    getDirectionLayer(dataArray, mapview) {
        if (!dataArray) return;
        var midArray = this.getRotatePoint(dataArray, mapview); //取两个点的中间点
        if (!midArray) return;
        /*******抽吸点，并获取方向点的值***********/
        var newMidArray = this.spaVoyageDirec(midArray, dataArray, mapview);
        var directGroup = L.layerGroup([]);
        if (newMidArray.length <= 1) return directGroup;
        try {
            for (var key in newMidArray) {
                var lnglat = newMidArray[key].value;
                lnglat = LonLatTrans(lnglat.lat, lnglat.lng);
                //判断点是否在屏幕内，如果在则画上，不在则不画上，比leaflet自身计算快很多//contains
                var curbounds = mapview.getBounds()
                if (curbounds.contains(lnglat)) {
                    var dircLnglat = newMidArray[key].directvalue;
                    if (!lnglat || !dircLnglat) continue;
                    var heading = 0;
                    heading = this.getVoMarkerRotate(lnglat, dircLnglat); //计算方向
                    //转换
                    var Lmarker = L.marker(lnglat, {
                        rotationAngle: heading,
                        icon: getDirecIcon()
                    });
                    directGroup.addLayer(Lmarker);
                } else {
                    continue;
                }
            }
        } catch (e) {
            console.log(e);
        }
        directGroup.setZIndex(-1);
        return directGroup;
    }
    /*
     *data：两个点的中间点数组*
     *olddataArray：原始数组*
     */
    spaVoyageDirec(data, olddataArray, mapview) {
        var max_distance = 200000;
        var resultData = [];
        var pixdistance = 50;
        /***只有三个点的时候并不参与计算***/
        if (data != null && data.length >= 2) {
            var lastlatlng = null;
            lastlatlng = data[0].midpointlnglat;
            var pt = mapview.latLngToLayerPoint(lastlatlng);
            var len = data.length;
            for (var i = 2; i < len - 1; i++) {
                var newlatlng = null;
                newlatlng = data[i].midpointlnglat;
                var newpt = mapview.latLngToLayerPoint(newlatlng);
                var distancevalue = mapview.distance(data[i].midpointlnglat, data[parseInt(i) + 1].midpointlnglat); //L.Config._TYPHOON_MIN_POINT_DISTANCE
                if (i == 2) {
                    pixdistance = 30;
                } else {
                    pixdistance = 55;
                }
                /****抽吸点并获取方向点***/
                if (newpt.distanceTo(pt) > pixdistance && distancevalue < max_distance) {
                    lastlatlng = newlatlng;
                    pt = newpt;
                    var positionObj = {};
                    positionObj.value = data[i].midpointlnglat;
                    //获取方向点，计算中间的时候存入的值，且方向由下一个点确定
                    var oldlatlngOb = olddataArray[data[i].postionvalue];

                    var direclnglat = LonLatTrans(oldlatlngOb.latitude / Constants.LATLON, oldlatlngOb.longitude / Constants.LATLON); //L.latLng(oldlatlngOb.lat / L.Config.LAT_LON_CONVSERSION, oldlatlngOb.lon / L.Config.LAT_LON_CONVSERSION);

                    positionObj.directvalue = direclnglat;
                    resultData.push(positionObj);
                }
            }
        } else {
            resultData = data;
        }
        return resultData;
    }
}
var PointUtil = null;
var ShipPointUtil = function () {
    if (!PointUtil) {
        PointUtil = new VoyagePointUtil();
    }
    return PointUtil;
}();

export {
    ShipPointUtil
}