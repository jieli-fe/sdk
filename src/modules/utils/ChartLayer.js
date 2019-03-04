// require('leaflet');
import Constants from "../constants/Constants";
/**
 * 海图Layer 继承自TileLayer
 * 
 * @param {Object}
 *            tomcat中映射该切片目录url
 * @param {Object}
 *            options
 *            http://enc-cmap2.myships.com/ChartMap/L02/R00000001/C00000003.png
 */
L.TileLayer.ChartLayer = L.TileLayer.extend({
    initialize: function (url, options) {
        options = L.setOptions(this, options);
        options.errorTileUrl = Constants.CHART_ERROR;
        var tempurl = Constants.CHART_URL[Math.floor(Math.random() *
            Constants.CHART_URL.length)];
        this.url = tempurl + "{s}/{x}.png";
        L.TileLayer.prototype.initialize.call(this, this.url, options);
    }
});
/**
 * 重写TileLayer中获取切片url方法
 * 
 * @param {Object}
 *            tilePoint
 */
L.TileLayer.ChartLayer.prototype.getTileUrl = function (tilePoint) {
    return L.Util.template(this._url, L.extend({
        s: function () {
            var zl = tilePoint.z;
            var ty = tilePoint.y;
            var dir = "",
                levDir = "",
                rowDir = "";
            if (zl < 2) {
                levDir = "LN" + (zl).toString();
            } else if (zl < 12) {
                levDir = "L0" + (zl - 2).toString();
            } else {
                levDir = "L" + (zl - 2).toString();
            }
            rowDir = "R" + L.tileLayer.getHexString(ty);
            dir = levDir + "/" + rowDir;
            return dir;
        },
        x: "C" + L.tileLayer.getHexString(tilePoint.x)
    }));
};
L.tileLayer.getHexString = function (value) {
    var strHex = value.toString(16);
    switch (strHex.length) {
        case 1:
            strHex = "0000000" + strHex;
            break;
        case 2:
            return strHex = "000000" + strHex;
            break;
        case 3:
            strHex = "00000" + strHex;
            break;
        case 4:
            strHex = "0000" + strHex;
            break;
        case 5:
            strHex = "000" + strHex;
            break;
            break;
        case 6:
            strHex = "00" + strHex;
            break;
        case 7:
            strHex = "0" + strHex;
            break;
        default:
    }
    return strHex;
};
let chartLyaer = null;
export var ChartLayer = function (url, options) {
    if (!chartLyaer) {
        chartLyaer = new L.TileLayer.ChartLayer(url, options);
    }
    return chartLyaer;
};