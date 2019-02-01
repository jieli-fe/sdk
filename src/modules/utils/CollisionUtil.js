/***  
 * 碰撞处理
 */
/**
 *
 * 抽稀轨迹
 * @param {*} dataArray 原始数组
 * @param {*} latfiled //纬度字段名
 * @param {*} lngfiled //经度字段名
 * @param {*} rate   倍率
 * @param {*} mapobject 地图对象
 */
function sparingLonLat(dataArray, latfiled, lngfiled, rate, mapobject) {
    var resultData = [];
    try {
        if (dataArray && dataArray.length > 2) {
            var lastlatlng = null;
            lastlatlng = new L.LatLng(dataArray[0][latfiled] / rate, dataArray[0][lngfiled] / rate);
            var pt = mapobject.latLngToLayerPoint(lastlatlng);
            resultData.push(dataArray[0]);
            var len = dataArray.length;
            for (var i = 1; i < len - 1; i++) {
                var newlatlng = new L.LatLng(dataArray[i][latfiled] / rate, dataArray[i][lngfiled] / rate);
                var newpt = mapobject.latLngToLayerPoint(newlatlng);
                if (newpt.distanceTo(pt) > L.Config._TYPHOON_MIN_POINT_DISTANCE) {
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
 *
 *
 * @param {*} boundsArray ，验证通过的数据
 * @param {*} layer 碰撞处理的图层
 * @param {*} options
 * @param {*} mapobject 地图对象
 */
var textinterval = 8;
var textHinterval = 10;

function tooltipNotCon(boundsArray, layer, mapobject) {
    try {
        var lnglat = layer.getLatLng();
        var targetTooltip = layer.getTooltip();
        var targetcontent = (targetTooltip._content).replace(/&nbsp;/g, "");
        var direction = targetTooltip.options.direction;
        var bounds = _getTargetBounds(lnglat, direction, targetcontent.length * textinterval, mapobject);
        var crossSign = _hasCross(boundsArray, bounds);
        if (crossSign) {
            if (direction == "left") {
                direction = "right";
            } else {
                direction = "left";
            }
            targetTooltip.options.direction = direction;
            var bounds2 = _getTargetBounds(lnglat, direction, targetcontent.length * textinterval, mapobject);
            var crossSign2 = _hasCross(boundsArray, bounds2);
            if (crossSign2) {
                layer.closeTooltip(); //将方向设置成另外一个方向
            } else {
                boundsArray.push(bounds2);
                layer.openTooltip(lnglat);
            }
        } else {
            boundsArray.push(bounds);
            layer.openTooltip(lnglat);
        }
    } catch (e) {
        console.log(e);
        layer.openTooltip(layer.getLatLng());
    }
}

/***
 *获取对象区间范围*
 *lnglat:经纬度值
 *direct：tooltip方向
 *textwith：对象宽度
 */
function _getTargetBounds(lnglat, direct, textwidth, mapobject) {
    var spoint = mapobject.latLngToLayerPoint(lnglat);
    var p1 = null;
    var p2 = null;
    var vlap = textHinterval;
    if (direct == "right") {
        p1 = new L.point(spoint.x, spoint.y + vlap);
        p2 = new L.point(spoint.x + textwidth, spoint.y - vlap);
    } else if (direct == "left") {
        p2 = new L.point(spoint.x, spoint.y - vlap);
        p1 = new L.point(spoint.x - textwidth, spoint.y + vlap);
    }
    var bounds = new L.bounds(p1, p2);
    return bounds;
}
/**
 *功能：判断目标区域和其他对象的区域是否存在交叉
 *boundsArray：区域数组
 *targetBounds：目标区域
 **/
function _hasCross(boundsArray, targetBounds) {
    try {
        var crossSign = false;
        for (var i in boundsArray) {
            if (boundsArray[i].overlaps(targetBounds)) {
                crossSign = true;
                break;
            }
        }
        return crossSign;
    } catch (e) {
        return false;
    }
}
export {
    tooltipNotCon,
    sparingLonLat
}