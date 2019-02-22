import L from "leaflet"
import Constants from "../constants/Constants";
import GlobalKey from "../constants/Globalkey";
import Eventkey from "../constants/Eventkey";
import { datastore as dataStore } from "../utils/DataStore";
import { Events } from "../utils/EventManageUtil";
import { ChartLayer } from "../utils/ChartLayer";
import { LonLatTrans } from "../utils/GpsCorrect";

export default class MapObject {
    constructor(mapId = "map", options) {
        this.defaultOptions = {
            //初始地图中心点
            center: [Constants.DEFAULTY, Constants.DEFAULTX],
            // 初始地图缩放级别
            zoom: Constants.DEFAULT_ZOOM,
            //坐标系统
            crs: L.CRS.EPSG3857,
            //是否支持地图拖拽
            dragable: true,
            //是否支持 canvas
            preferCanvas: false,
            //版权组件
            attributionControl: false,
            //缩放组件
            zoomControl: true,
            //点击时候关闭 popup
            closePopupOnClick: false,
            //地图最大/最小缩放级别
            maxZoom: 18,
            minZoom: 2,
            //鼠标滚轴事件
            zoomable: true,
            //用户 key
            key: '',
            mapType: "map", //'map'/'sat'/'chart'
            mapobject: "", //地图对象
            mapLayer: L.layerGroup([])  //图层
        }
        if (options.key.length < 18) {
            throw new Error ("Please enter the correct key")
        }
        this.options = Object.assign(this.defaultOptions, options)

        Events.addEvent(Eventkey.MAP_TYPE_CHANGE_KEY, "MAPOBJECT-SELF-CHANGE", this.mapChangeEvent);
        L.Browser.touch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        this.initialize(mapId, options);
    }
    _arrayToLatLng(arr) {
        return Array.isArray(arr) && arr.length > 1
            ? new L.latLng(arr[0], arr[1])
            : null
    }
    initialize = (mapId, options) => {
        //转换中心点坐标
        this.options.center = this._arrayToLatLng(this.options.center)
        //设置用户的 key
        this.setKey(this.options.key);
        //初始化 map 对象
        var map = new L.Map(mapId, this.options);

        //挂在到 this.map
        this.map = map

        //初始化图层嵌入
        this.map.addLayer(this.options.mapLayer);

        //设置地图类型
        this.setMapType(this.options.mapType);

        //限制地图边界
        this.mapBounds(map);

        //地图放大结束事件
        this.mapZoomEvent(map);

        //地图鼠标移动事件
        this.mapMouseMove(map);
        this.mapMoveEvent(map);

        //全局地图对象
        dataStore.saveData(GlobalKey.MAPOBJECT, this.map);
    }

    mapBounds(mapview) {
        //限制地图边界
        let southWest = new L.latLng(-90, -720);
        let northEast = new L.latLng(90, 720);
        let bounds = new L.latLngBounds(southWest, northEast);
        mapview.setMaxBounds(bounds);
    }
    /**
     *
     * 地图鼠标移动事件
     * @param {*} mapview
     * @memberof MapObject
     */
    mapMouseMove(mapview) {
        mapview.on("mousemove", function (e) {
            Events.fire(Eventkey.MAP_MOUSEMOVE_KEY, e);
        });
    }

    mapZoomEvent(mapview) {
        mapview.on("zoomend", function (e) {
            Events.fire(Eventkey.MAP_ZOOMED_KEY);
        });
    }

    /**
     *
     * 地图移动事件
     * @memberof MapObject
     */
    mapMoveEvent(mapview) {
        mapview.on("moveend", function (e) {
            Events.fire(Eventkey.MAP_MOVEEND_KEY);
        });
    }
    /**
     *地图切换事件
     * @memberof MapObject
     */
    mapChangeEvent = () => {
        var mapType = dataStore.getData(GlobalKey.GLOBAL_MAP_TYPE);
        console.log("当前地图类型: ", mapType)
        this.options.mapLayer.clearLayers();
        switch (mapType) {
            case Constants.CHAT_MAP_TYPE:
                this.drawChatLayer();
                break;
            case Constants.MAP_MAP_TYPE:
                this.drawMapLayer();
                break;
            case Constants.SITE_MAP_TYPE:
                this.drawSiteLayer();
                break;
        }
    }

    /**
     *
     * 绘制海图
     * @memberof MapObject
     */
    drawChatLayer() {
        var chatLayer = ChartLayer("", {
            maxZoom: Constants.MAX_ZOOM,
            minZoom: Constants.MIN_ZOOM,
            continuousWorld: true,
            id: 'chart'
        });
        L.Util.setOptions(this.map, {
            crs: L.CRS.EPSG3395
        });
        this.options.mapLayer.addLayer(chatLayer);
    }

    /**
     *卫星图
     *
     * @memberof MapObject
     */
    drawSiteLayer() {
        var imgLayer = new L.tileLayer(Constants.STATE_URL_NEW, {
            maxZoom: Constants.MAX_ZOOM,
            minZoom: Constants.MIN_ZOOM,
            continuousWorld: true,
            id: 'sate'
        });
        var gridLayer = new L.tileLayer(Constants.STATE_URL_GIRD, {
            maxZoom: Constants.MAX_ZOOM,
            minZoom: Constants.MIN_ZOOM,
            continuousWorld: true,
            id: 'sate',
            zIndex: 10
        });
        L.Util.setOptions(this.map, {
            crs: L.CRS.EPSG3857
        });
        this.options.mapLayer.addLayer(imgLayer);
        this.options.mapLayer.addLayer(gridLayer);
    }

    /**
     *
     * 地图
     * @memberof MapObject
     */
    drawMapLayer() {
        let layer = new L.tileLayer(Constants.MAP_URL2, {
            subdomains: [0, 1, 2, 3],
            maxZoom: Constants.MAX_ZOOM,
            minZoom: Constants.MIN_ZOOM,
            continuousWorld: true,
            id: 'mapbox.streets'
        });
        L.Util.setOptions(this.map, {
            crs: L.CRS.EPSG3857
        });
        this.options.mapLayer.addLayer(layer);
    }

    /**
     *
     * 设置相关属性
     * @param {*} options
     * @memberof MapObject
     */
    setOptions(options) {
        if (!options) return null

        if (options.mapType) {
            this.setMapType(options.mapType);
        }
        if (options.key) {
            this.setKey(options.key);
        }

        let zoomable = true;

        //是否可缩放
        if (options && options.zoomable === false) {
            zoomable = false;
        }
        //是否可拖动
        let dragable = true;
        if (options && options.dragable === false) {
            dragable = false;
        }
        L.Util.setOptions(this.map, {
            scrollWheelZoom: zoomable,
            dragging: dragable
        });
        //设置中心点
        if (options && options.center) {
            this.setCenter(options.center[0], options.center[1]);
        }
        //设置层级
        if (options && options.zoom) {
            this.setZoom(options.zoom);
        }

        return this

    }
    /**
     *
     * 获取地图的中心点
     * @memberof MapObject
     */
    setCenter(lat, lng) {
        let mapview = this.map;
        let lonlat = LonLatTrans(lat, lng);
        this.map.setView(lonlat, mapview.getZoom());
        return this
    }
    getCenter() {
        return this.map.getCenter();
    }
    /**
     *
     * 设置地图层级
     * @param {*} zoomNumber
     * @memberof MapObject
     */
    setZoom(zoomNumber) {
        this.map.setZoom(zoomNumber);
        return this
    }
    //获取当前地图层级
    getZoom() {
        return this.map.getZoom();
    }

    /**
     *
     * 设置地图类型
     * @param {*} maptype
     * @memberof MapObject
     */
    setMapType(maptype) {
        if (!maptype) return
        dataStore.saveData(GlobalKey.GLOBAL_MAP_TYPE, maptype);
        //触发事件
        Events.fire(Eventkey.MAP_TYPE_CHANGE_KEY);
        return this
    }

    getMapType() {
        return dataStore.getData(GlobalKey.GLOBAL_MAP_TYPE);
    }
    /**
     *
     * 设置key值
     * @param {*} datakey
     * @memberof MapObject
     */
    setKey(datakey) {
        datakey && dataStore.saveData(GlobalKey.GLOBAL_DATA_KEY, datakey);
        return this
    }

    /**
     *
     * 各种监听事件
     * @param {*} event
     * @param {*} callback
     * @memberof MapObject
     */
    on(event, callback) {
        if (!event || !callback) {
            console.log("event or callback can not be null");
            return;
        }
        switch (event) {
            case Constants.MAP_EVENT_CLICK:
                //注册事件
                Events.addEvent(Eventkey.MAP_MOUSEMOVE_KEY, Eventkey.CUSTOM_CLICK_EVENT_KEY, callback);
                break;
            case Constants.MAP_EVENT_MOVE:
                //注册移动事件
                Events.addEvent(Eventkey.MAP_MOVEEND_KEY, Eventkey.CUSTOM_MOVE_EVNET_KEY, callback);
                break;
            case Constants.MAP_EVENT_ZOOM:
                //注册缩放事件
                Events.addEvent(Eventkey.MAP_ZOOMED_KEY, Eventkey.CUSTOM_ZOOM_EVENT_KEY, callback);
                break;
        }
    }
    /**
     *
     * 解除监听的事件
     * @memberof MapObject
     */
    off(eventType) {
        if (eventType) {
            switch (event) {
                case Constants.MAP_EVENT_CLICK:
                    //取消点击事件 CUSTOM_CLICK_EVENT_KEY
                    Events.clearEvent(Eventkey.MAP_MOUSEMOVE_KEY, Eventkey.CUSTOM_CLICK_EVENT_KEY);
                    break;
                case Constants.MAP_EVENT_MOVE:
                    //取消移动事件 CUSTOM_MOVE_EVNET_KEY
                    Events.clearEvent(Eventkey.MAP_MOVEEND_KEY, Eventkey.CUSTOM_MOVE_EVNET_KEY);
                    break;
                case Constants.MAP_EVENT_ZOOM:
                    //取消缩放事件 CUSTOM_ZOOM_EVENT_KEY
                    Events.clearEvent(Eventkey.MAP_ZOOMED_KEY, Eventkey.CUSTOM_ZOOM_EVENT_KEY);
                    break;
            }
        }
    }
}