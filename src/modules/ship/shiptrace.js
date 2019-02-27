import Constants from "../constants/Constants";
import GlobalKey from "../constants/Globalkey";
import Eventkey from "../constants/Eventkey";
import { Events } from "../utils/EventManageUtil";
import { datastore } from "../utils/DataStore";
import { getShipData, dealShipData, getStartStopIcon, getShipFiledValue, filterNowVoyageData } from "./ShipUtils";
import { ShipPointUtil } from "./VoyagePointUtil";
import { LonLatTrans } from "../utils/GpsCorrect";
import { LongToStr2, TwoDateSub } from "../utils/DateUtils";
import { getPlanStart, getPlanStop } from "./ShipCommon";
import { tooltipNotCon } from "../utils/CollisionUtil";
import http from "../utils/axios"
/** 
 * 船舶轨迹展示
 * * */
export default class ShipTrace {
    constructor(shipId, startTime, endTime, options) {
        this.defaultOptions = {
            mapview: datastore.getData(GlobalKey.MAPOBJECT),
            LineObject: {},
            traceoption: {}
        }
        this.options = Object.assign(this.defaultOptions, options)

        this.mapZoomEndEvent = this.mapZoomEndEvent.bind(this);
        this.mapChange = this.mapChange.bind(this);

        Events.addEvent(Eventkey.MAP_ZOOMED_KEY, "VOYAGE-ZOOM-END-KEY" + shipId, this.mapZoomEndEvent);
        Events.addEvent(Eventkey.MAP_TYPE_CHANGE_KEY, "ship-trace" + shipId, this.mapChange);
        
        this.getTraceData(shipId, startTime, endTime, options);
    }


    /**
     *
     * 获取轨迹数据
     * @param {*} ship
     * @param {*} startTime
     * @param {*} endTime
     * @param {*} options
     * @memberof ShipTrace
     */
    getTraceData(shipId, startTime, endTime, options) {
        //shipId=413472680&key=5cdd7336161c4ce2
        //a27a21d770b8aa53 & startUtcTime = 1512108577 & endUtcTime = 1512972577
        var key = datastore.getData(GlobalKey.GLOBAL_DATA_KEY) || Constants.DATA_API_TEST_KEY;
        var postData = {
            key,
            shipid: shipId,
            startUtcTime: startTime,
            endUtcTime: endTime
        }
        let _self = this;
        http.post(Constants.SHIP_TRACE_INFO_KEY, postData)
            .then((response) => {
                if (parseInt(response.status) === Constants.LOAD_DATA_SUCESS) {
                    //加载后
                    _self.drawController(response, shipId, options);
                    // Events.fire(_self.options.Loadend_Event_Key);
                } else {
                    //加载失败
                    // Events.fire(_self.options.Loaderror_Event_Key);
                    throw "Load data error,errorcode is " + response.status;

                }
            })
            .catch((error) => {
                throw error;
            })

        /* $.ajax({
            type: 'POST',
            url: Constants.SHIP_TRACE_INFO_KEY, //船舶基本信息地址
            async: false,
            data: postData,
            success: function (response) {
                if (parseInt(response.status) === Constants.LOAD_DATA_SUCESS) {
                    //加载后
                    _self.drawController(response, shipId, options);
                    // Events.fire(_self.options.Loadend_Event_Key);
                } else {
                    //加载失败
                    // Events.fire(_self.options.Loaderror_Event_Key);
                    throw "Load data error,errorcode is " + response.status;

                }
            },
            error: function (error) {
                // Events.fire(_self.options.Loaderror_Event_Key);
                throw error;
            },
            dataType: "json"
        }); */
    }

    drawController(data, shipid, options) {
        this.options.traceoption = options;
        var lineData = ShipPointUtil.dataListMerge(data.result, data.specialResul);
        //跨180读处理
        lineData = ShipPointUtil.calcuteDateLineVals(lineData, "longitude", Constants.LATLON);
        var startStopData = ShipPointUtil.getStartStopDateLine(data.specialResul, lineData, "longitude");
        var layerObject = this.drawHistroyInterface(lineData, startStopData);
        var handledData = {
            sourceData: data,
            lineData: lineData,
            startStopData: startStopData
        }
        this.options.LineObject = {
            Layers: layerObject,
            data: handledData
        };

    }

    /**
     *
     * 统一绘制接口
     * @param {*} lineData
     * @param {*} startStopData
     * @returns
     * @memberof ShipTrace
     */
    drawHistroyInterface(lineData, startStopData) {

        //地图对象
        let mapview = this.options.mapview;

        let LineLayer = this.drawVoyageLine(lineData);
        //点
        let PointLayer = this.drawVoyagePoint(lineData);
        //启停点
        // let StartStopLayer = this.drawStartStopPoint(startStopData);
        //方向处理
        let drectionLayer = this.drawVoyageDirection(lineData);
        mapview.addLayer(LineLayer);
        mapview.addLayer(PointLayer);
        // mapview.addLayer(StartStopLayer);
        mapview.addLayer(drectionLayer);
        let Layers = new Object();
        Layers["LineLayer"] = LineLayer;
        Layers["PointLayer"] = PointLayer;
        Layers["DirectionLayer"] = drectionLayer;
        let options = this.options.traceoption;
        if (options && options.fitBounds) {
            mapview.fitBounds(LineLayer.getBounds());
        }
        return Layers;
    }

    /**
     * 绘制线的公共方法 Layers PointLayer DirectionLayer
     *
     * @param {*} voyageLineData
     * @param {*} rate
     * @param {*} dashMark  是否绘
     * @returns
     * @memberof VoyagePoint
     */
    drawVoyageLine(voyageLineData) {
        let rate = Constants.LATLON;
        let options = this.options.traceoption;
        let weight = (options && options.lineWidth) || 2;
        let color = (options && options.lineColor) || "#0073f5";
        let dashArray = null;
        if (options && options.lineStyle === "dashed") {
            dashArray = "10,5";
        }
        var shipVoyageLine = L.polyline([], {
            stroke: !0,
            weight: weight,
            color: color,
            opacity: 1,
            dashArray: dashArray
        });
        for (var i in voyageLineData) {
            var lnglat = LonLatTrans(voyageLineData[i].latitude / rate, voyageLineData[i].longitude / rate);
            shipVoyageLine.addLatLng(lnglat);
        }
        return shipVoyageLine;
    }

    /**
     *绘制点的方法
     *
     * @param {*} voyageLineData
     * @memberof VoyagePoint
     */
    drawVoyagePoint(voyageLineData) {
        //pointColor        pointWeight         sparse
        let rate = Constants.LATLON;
        if (!voyageLineData) return;
        let options = this.options.traceoption;
        let sparse = (options && options.sparse) || Constants.MIN_POINT_DISTANCE;
        //抽稀轨迹点
        var newVoyageData = ShipPointUtil.pointDataSparing(voyageLineData, "latitude", "longitude", rate, this.options.mapview, sparse);
        var pointLayerGroup = L.layerGroup([]);
        // var mapBounds = this.options.mapview.getBounds();
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
                pointTime = LongToStr2(newVoyageData[i].postime * 1000).substring(5);
            }
            pointLayerGroup.addLayer(pointMarker);
            if (!speed && !pointCourse && !pointTime) {
                continue;
            }
            pointMarker.bindTooltip(`&nbsp;${pointTime} &nbsp;&nbsp;${speed}kn/${pointCourse}°`, {
                direction: "right",
                opacity: 0.8,
                permanent: true
            });

        }
        return pointLayerGroup;
    }

    /**
     *画线点放心
     *
     * @memberof VoyagePoint
     */
    drawVoyageDirection(lineData) {
        return ShipPointUtil.getDirectionLayer(lineData, this.options.mapview);
    }

    /**
     *
     * 地图切换
     * @memberof ShipTrace
     */
    mapChange() {
        this.redrawLine();
        this.redrawVoyagePoint();
        this.redrawDirection();
    }

    /**
     *
     * 设置属性
     * @memberof ShipTrace
     */
    setOptions(options) {
        try {
            this.options.traceoption = options;
            this.redrawLine();
            this.redrawVoyagePoint();
            if (options && options.fitBounds) {
                this.setFitBounds();
            }
        } catch (e) {
            console.log(e);
        }
    }
    /**
     *
     * 设置展示区域，航线
     * @memberof ShipTrace
     */
    setFitBounds() {
        try {
            let mapview = this.options.mapview;
            let LineLayer = this.options.LineObject.Layers.LineLayer;
            if (mapview.hasLayer(LineLayer)) {
                mapview.fitBounds(LineLayer.getBounds());
            }
        } catch (e) {
            console.log(e);
        }

    }

    /**
     *
     * 设置点的抽吸规则
     * @memberof ShipTrace
     */
    setSparse(number) {
        try {
            if (number && !isNaN(number)) {
                this.options.traceoption.sparse = parseInt(number);
                this.redrawVoyagePoint();
            }
        } catch (e) {
            console.log(e);
        }
    }
    /**
     *
     * 获取轨迹点
     * @memberof ShipTrace
     */
    getTrace() {
        if (Object.keys(this.options.LineObject).length > 0) {
            return this.options.LineObject.data.sourceData;
        }
    }
    /**
     *
     * 添加到地图上
     * @memberof ShipTrace
     */
    addTo() {
        let mapview = this.options.mapview;
        let layers = this.options.LineObject.Layers;
        for (var key in layers) {
            if (!mapview.hasLayer(layers[key])) {
                mapview.addLayer(layers[key]);
            }
        }
    }
    /**
     * 
     * 从地图上移除
     * @memberof ShipTrace
     */
    remove() {
        this.remveLayers(this.options.LineObject.Layers);
    }

    remveLayers(layerObject) {
        for (var key in layerObject) {
            this.options.mapview.removeLayer(layerObject[key]);
        }
    }

    /**
     *
     * 地图缩放事件
     * @memberof ShipTrace
     */
    mapZoomEndEvent() {
        this.redrawVoyagePoint();
        this.redrawDirection();
    }

    /**
     *
     * 
     * @memberof ShipTrace
     */
    redrawLine() {

        let LineObject = this.options.LineObject;
        let mapview = this.options.mapview;
        let data = LineObject.data.lineData;
        if (mapview.hasLayer(LineObject.Layers.LineLayer)) {
            let LineLayer = this.drawVoyageLine(data);
            mapview.removeLayer(LineObject.Layers.LineLayer);
            mapview.addLayer(LineLayer);
            this.options.LineObject.Layers.LineLayer = LineLayer;
        }
    }

    /**
     *
     * 重绘方向
     * @memberof ShipTrace
     */
    redrawDirection() {
        try {
            //Layers PointLayer DirectionLayer
            let LineObject = this.options.LineObject;
            let mapview = this.options.mapview;
            var data = LineObject.data.lineData;
            if (mapview.hasLayer(LineObject.Layers.DirectionLayer)) {
                var directionLayer = this.drawVoyageDirection(data);
                mapview.removeLayer(LineObject.Layers.DirectionLayer);
                mapview.addLayer(directionLayer);
                this.options.LineObject.Layers.DirectionLayer = directionLayer;
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     *
     * 重新绘制线，当前或者历史的
     * @memberof VoyagePoint
     */
    redrawVoyagePoint() {
        try {
            //Layers PointLayer
            let LineObject = this.options.LineObject;
            let mapview = this.options.mapview;
            var data = LineObject.data.lineData;
            if (mapview.hasLayer(LineObject.Layers.PointLayer)) {
                var pointLayer = this.drawVoyagePoint(data);
                this.options.mapview.removeLayer(LineObject.Layers.PointLayer);
                this.options.mapview.addLayer(pointLayer);
                this.options.LineObject.Layers.PointLayer = pointLayer;
            }
        } catch (e) {
            console.log(e);
        }

    }
}