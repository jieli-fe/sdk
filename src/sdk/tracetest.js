
import L from "leaflet"
import "../extends/rotatedmarker"
import Constants from "../config/Constants";
import { LonLatTrans } from "../modules/utils/GpsCorrect";
import { shipStatu, getRuningIcon, getStopIcon } from "../utils/ShipUtils";
import { ShipPointUtil } from "../utils/VoyagePointUtil";
import { LongToStr2, TwoDateSub } from "../utils/DateUtils";
import { traceOpts } from "../config/paramConfig"

if (!L.plugin) {
    L.plugin = {}
}
L.plugin.Trace = L.Layer.extend({

    initialize: function (shipId, startTime, endTime, options) {
        this._defaultOptions = traceOpts
        this._traceOptions = Object.assign(this._defaultOptions, options)
        this._traceLayer = L.layerGroup()

        this.getTraceData(shipId, startTime, endTime)
            .then((response) => {
                if (parseInt(response.status) === Constants.LOAD_DATA_SUCESS) {
                    //存储数据到本地
                    this.saveDataLocal(response)
                    // this.drawController(response,options);
                } else {
                    throw "Load data error,errorcode is " + response.status;
                }
            })
            .catch((error) => {
                throw error;
            })
    },
    saveDataLocal(data) {
        data.updateTime = + new Date()  //用于后期是否缓存的问题
        this._traceData = this._traceSparseData = data
    },
    getTraceData(shipId, startUtcTime, endUtcTime, options) {
        var key = L.LsOptions && L.LsOptions.map && L.LsOptions.map.key || ''
        var postData = {
            key,
            shipid: shipId,
            startUtcTime,
            endUtcTime
        }
        return L.http.post(Constants.SHIP_TRACE_INFO_KEY, postData)
    },
    drawController(data, options) {

        var lineData = ShipPointUtil.dataListMerge(data.result, data.specialResul);
        //跨180读处理
        lineData = ShipPointUtil.calcuteDateLineVals(lineData, "longitude", Constants.LATLON);
        var startStopData = ShipPointUtil.getStartStopDateLine(data.specialResul, lineData, "longitude");
        var layerObject = this.drawHistroyInterface(lineData, startStopData, options);
        options && options.fitBounds && this.setFitBounds()

    },
    drawHistroyInterface(lineData, startStopData, options) {

        //地图对象
        let mapview = this._traceLayer.clearLayers();

        let LineLayer = this.drawVoyageLine(lineData, options);
        let PointLayer = this.drawVoyagePoint(lineData, options);
        //启停点
        // let StartStopLayer = this.drawStartStopPoint(startStopData);
        //方向处理
        let drectionLayer = this.drawVoyageDirection(lineData, options);
        mapview.addLayer(LineLayer);
        mapview.addLayer(PointLayer);
        mapview.addLayer(drectionLayer);

        return mapview;
    },
    /**
     * 绘制线的公共方法 Layers PointLayer DirectionLayer
     *
     * @param {*} voyageLineData
     * @param {*} rate
     * @param {*} dashMark  是否绘
     * @returns
     * @memberof VoyagePoint
     */
    drawVoyageLine(voyageLineData, options = {}) {
        let rate = Constants.LATLON;
        let weight = (options && options.lineWidth) || 2;
        let color = (options && options.lineColor) || "#0073f5";
        let stroke = (options && options.stroke) || true;
        let opacity = (options && options.opacity) || 1;
        let dashArray = null;
        if (options && options.lineStyle === "dashed") {
            dashArray = "10,5";
        }

        var shipVoyageLine = L.polyline([], {
            stroke,
            weight,
            color,
            opacity,
            dashArray
        });
        for (var i in voyageLineData) {
            var lnglat = LonLatTrans(voyageLineData[i].latitude / rate, voyageLineData[i].longitude / rate);
            shipVoyageLine.addLatLng(lnglat);
        }
        //记录下polyline的坐标,后面地图居中使用
        this._traceBounds = shipVoyageLine.getBounds()
        return shipVoyageLine;
    },
    /**
     *绘制点的方法
     *
     * @param {*} voyageLineData
     * @memberof VoyagePoint
     */
    drawVoyagePoint(voyageLineData, options) {
        //pointColor        pointWeight         sparse
        let rate = Constants.LATLON;
        if (!voyageLineData) return;
        let sparse = (options && options.sparse) || Constants.MIN_POINT_DISTANCE;
        //抽稀轨迹点
        var newVoyageData = ShipPointUtil.pointDataSparing(voyageLineData, "latitude", "longitude", rate, this._map, sparse);
        var pointLayerGroup = L.layerGroup([]);
        // var mapBounds = this._map.getBounds();
        for (var i in newVoyageData) {
            var lnglat = LonLatTrans(newVoyageData[i].latitude / rate, newVoyageData[i].longitude / rate);
            //如果点在屏幕外则不参与计算
            // if (!mapBounds.contains(lnglat)) continue;
            let speed = newVoyageData[i].speed;
            var pointColor = (options && options.pointColor) || Constants.SPEED_MORETHAN_ONE_COLOR;
            if (speed) {
                speed = parseFloat(speed);
                if (speed > 10) {
                    pointColor = Constants.SPEED_MORETHAN_TEN_COLOR;
                } else if (speed > 5) {
                    pointColor = Constants.SPEED_MORETHAN_FIVE_COLOR;
                } else if (speed > 1) {
                    pointColor = Constants.SPEED_MORETHAN_ONE_COLOR;
                }
            } else {
                speed = "";
            }
            //轨迹点问题
            var pointMarker = L.circleMarker(lnglat, {
                stroke: !0,
                color: pointColor,
                weight: ((options && options.pointWeight) || 1),
                opacity: 1,
                fillColor: pointColor,
                fillOpacity: 1,
                fill: !0,
            }).setRadius(3);
            pointMarker.leavel = 4;
            var pointCourse = newVoyageData[i].course || "";
            var pointTime = "";
            if (newVoyageData[i].postime) {
                // pointTime = LongToStr2(newVoyageData[i].postime * 1000).substring(5);
                pointTime = LongToStr2(newVoyageData[i].postime * 1000, options.timeFormat);
            }
            pointLayerGroup.addLayer(pointMarker);
            if (!speed && !pointCourse && !pointTime) {
                continue;
            }
            pointMarker.bindTooltip(`&nbsp;${pointTime} &nbsp;&nbsp;${speed}kn/${pointCourse}°`, {
                direction: "right",
                opacity: 0.8,
                permanent: true
            })
        }
        return pointLayerGroup;
    },

    /**
     *画线点放心
     *
     * @memberof VoyagePoint
     */
    drawVoyageDirection(lineData) {
        return ShipPointUtil.getDirectionLayer(lineData, this._map);
    },
    addTo(map) {
        this._map = map
        console.log("before",this._traceSparseData)
        debugger
        this._traceSparseData = ShipPointUtil.pointDataSparing(voyageLineData, "latitude", "longitude", rate, this._map, sparse);
        console.log("after",this._traceSparseData)
        this.drawController(this._traceSparseData, this._traceOptions);
        this._map.addLayer(this._traceLayer)
    },
    remove() {
        this._map.removeLayer(this._traceLayer)
    },
    /**
     *
     * 设置点的抽吸规则
     * @memberof ShipTrace
     */
    setSparse(number) {
        this._traceOptions = Object.assign(this._traceOptions, { "sparse": number })

        this._traceLayer.clearLayers()
        this.drawController(this._traceData, this._traceOptions);
    },
    /**
     *
     * 重新绘制线，当前或者历史的
     * @memberof VoyagePoint
     */
    redrawVoyagePoint() {
        let LineObject = this.LineObject;
        let mapview = L._map;
        var data = LineObject.data.lineData;
        if (mapview.hasLayer(LineObject.Layers.PointLayer)) {
            var pointLayer = this.drawVoyagePoint(data);
            mapview.removeLayer(LineObject.Layers.PointLayer);
            mapview.addLayer(pointLayer);
            this.LineObject.Layers.PointLayer = pointLayer;
        }
    },
    /**
     *船舶居中显示
     */
    setFitBounds() {
        this._traceBounds && this._map.fitBounds(this._traceBounds);
    },

    //输出船舶数据
    getTrace() {
        console.log("船舶轨迹数据", this._traceData)
        return this._traceData
    },

    /**
     *
     * 设置属性
     * @memberof ShipTrace
     */
    setOptions(options) {
        this._traceOptions = Object.assign(this._traceOptions, options)
        debugger
        this._traceLayer.clearLayers()
        this.drawController(this._traceData, this._traceOptions);
    }

});
L.plugin.Trace.addInitHook(function () {
})

L.plugin.trace = function (shipId, startTime, endTime, options) {
    if (this.hasTrace) {
        return this.hasTrace
    }
    this.hasTrace = new L.plugin.Trace(shipId, startTime, endTime, options);
    return this.hasTrace
};