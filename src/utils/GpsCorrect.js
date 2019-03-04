import Constants from '../config/Constants';
import Globalkey from "../config/Globalkey";
import { datastore } from "./DataStore";
import offsermap from "../utils/exportGpsCorrectData"


const pi = 3.14159265358979324;
const a = 6378245.0;
const ee = 0.00669342162296594323;
const myLatLngBoundsArray = [
    L.latLngBounds(L.latLng(22.10658, 113.53833), L.latLng(22.21342, 113.60102)),
    L.latLngBounds(L.latLng(22.08333, 113.78333), L.latLng(22.45, 113.95222)),
    L.latLngBounds(L.latLng(22.08333, 113.9522), L.latLng(22.4898, 114.23667)),
    L.latLngBounds(L.latLng(22.147, 114.23539), L.latLng(22.55143, 114.42043))
]

function transform(wgLat, wgLon) {
    var lnglat = new L.latLng(wgLat, wgLon);
    var offsetPoint = getOffset(L.latLng(wgLat, wgLon));
    lnglat.lat = wgLat + (offsetPoint.offsetLat / 1000000);
    lnglat.lng = wgLon + (offsetPoint.offsetLng / 1000000);
    var latlngs = [];
    latlngs[0] = lnglat.lat;
    latlngs[1] = lnglat.lng;
    return latlngs;
}

function outOfChina(lat, lon) {
    if (lng < 72.004 || lng > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
}

function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

function inverseTransform(wgLat, wgLon) {
    var lnglat = new L.latLng(wgLat, wgLon);
    var offsetPoint = getOffset(L.latLng(wgLat, wgLon));
    lnglat.lat = wgLat - (offsetPoint.offsetLat / 1000000);
    lnglat.lng = wgLon - (offsetPoint.offsetLng / 1000000);
    return lnglat;
}

function getOffset(point) {
    var byteArray = null;
    var output = null;
    var lng = 0;
    var lat = 0;
    var offsetLng = 0;
    var offsetLat = 0;
    var latLng = point;
    var i = 0;
    var boundsArray = myLatLngBoundsArray;
    for (var i in boundsArray) {
        if (boundsArray[i].contains(latLng)) {
            return {
                offsetLat: 0,
                offsetLng: 0
            };
        }
    }
    var latValue = Math.round((latLng.lat * 10));
    var lngValue = Math.round((latLng.lng * 10));
    //利用hashmap实现
    var lnglatStr = (latValue + "_") + lngValue;
    var mapvalue = offsermap[lnglatStr];
    if (mapvalue != undefined && mapvalue != null) {
        return {
            offsetLat: mapvalue[0],
            offsetLng: mapvalue[1]
        };
    }
    return {
        offsetLat: 0,
        offsetLng: 0
    };
}
/**
 *
 * 经纬度转换
 * @param {*} lat
 * @param {*} lon
 * @returns
 */
function LonLatTrans(lat, lon) {
    var mapType = datastore.getData(Globalkey.GLOBAL_MAP_TYPE);
    if (mapType != Constants.CHAT_MAP_TYPE) {
        var arrxy = transform(lat, lon);
        lat = arrxy[0];
        lon = arrxy[1]
    }
    return L.latLng(lat, lon);
}
export {
    LonLatTrans
}