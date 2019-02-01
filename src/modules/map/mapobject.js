/***
 * 
 * 地图对象
 */
/**
 *
 *
 * @export
 * @class MapObject
 */
import L from "leaflet"

import Constants from "../constants/Constants";
import GlobalKey from "../constants/Globalkey";
import Eventkey from "../constants/Eventkey";
import {
    datastore
} from "../utils/DataStore";
import {
    Events
} from "../utils/EventManageUtil";
import {
    ChartLayer
} from "../utils/ChartLayer";
import {
    LonLatTrans
} from "../utils/GpsCorrect";
import Globalkey from "../constants/Globalkey";
export default class MapObject {
    constructor(containerId, customOptions) {
        this.options = Object.create({
            mapobject: "", //地图对象
            mapLayer: L.layerGroup([])
        });
        this.mapChangeEvent = this.mapChangeEvent.bind(this);
        Events.addEvent(Eventkey.MAP_TYPE_CHANGE_KEY, "MAPOBJECT-SELF-CHANGE", this.mapChangeEvent);
        L.Browser.touch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
        this.initmap(containerId, customOptions);
    }
    initmap(containerId, customOptions) {
        try {
            if (!containerId) {
                throw "container id con not be null";
            }
            if (customOptions && customOptions.key) {
                this.setKey(customOptions.key);
            }
            //是否可拖动
            let dragable = true;
            if (customOptions && customOptions.dragable === false) {
                dragable = false;
            }
            let zoomable = true;
            if (customOptions && customOptions.zoomable === false) {
                zoomable = false;
            }
            var map = new L.Map(containerId, {
                center: new L.latLng(customOptions.center[0] || Constants.DEFAULTY, customOptions.center[1] || Constants.DEFAULTX),
                zoom: customOptions.zoom || 4,
                crs: L.CRS.EPSG3857,
                scrollWheelZoom: zoomable, //不能缩放
                dragging: dragable, //是否可拖动
                closePopupOnClick: false,
                maxZoom: 18,
                minZoom: 2
            });
            this.options.mapobject = map;
            this.drawMapLayer();
            map.addLayer(this.options.mapLayer);
            this.mapbounds(map);
            this.mapZoomEvent(map);
            this.mapMouseMove(map);
            this.mapMoveEvent(map);
            //全局地图对象
            datastore.saveData(GlobalKey.MAPOBJECT, map);
            if (customOptions && customOptions.mapType) {
                this.setMapType(customOptions.mapType);
            }
        } catch (error) {
            console.log(error);
        }
    }

    mapbounds(mapview) {
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
    mapChangeEvent() {
        var mapType = datastore.getData(Globalkey.GLOBAL_MAP_TYPE);
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
            maxZoom: 18,
            minZoom: 2,
            continuousWorld: true,
            id: 'chart'
        });
        L.Util.setOptions(map, {
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
            maxZoom: 18,
            minZoom: 2,
            continuousWorld: true,
            id: 'sate'
        });
        var gridLayer = new L.tileLayer(Constants.STATE_URL_GIRD, {
            maxZoom: 18,
            minZoom: 2,
            continuousWorld: true,
            id: 'sate',
            zIndex: 10
        });
        L.Util.setOptions(this.options.mapobject, {
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
        var layer = new L.tileLayer(Constants.MAP_URL2, {
            subdomains: [0, 1, 2, 3],
            maxZoom: 21,
            minZoom: 2,
            continuousWorld: true,
            id: 'mapbox.streets'
        });
        L.Util.setOptions(this.options.mapobject, {
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
        try {
            /***
             * 
             * zoom center dragable  zoomable   
             * * */
            if (options && options.mapType) {
                this.setMapType(options.mapType);
            }
            if (options && options.key) {
                this.setKey(options.key);
            }
            let zoomable = true;
            let map = this.options.mapobject;
            //是否可缩放
            if (options && options.zoomable === false) {
                zoomable = false;
            }
            //是否可拖动
            let dragable = true;
            if (options && options.dragable === false) {
                dragable = false;
            }
            L.Util.setOptions(map, {
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
        } catch (error) {
            console.log(error);
        }
    }
    /**
     *
     * 获取地图的中心点
     * @memberof MapObject
     */
    setCenter(lat, lng) {
        let mapview = this.options.mapobject;
        let lonlat = LonLatTrans(lat, lng);
        mapview.setView(lonlat, mapview.getZoom());
    }
    getCenter() {
        return this.options.mapobject.getCenter();
    }
    /**
     *
     * 设置地图层级
     * @param {*} zoomNumber
     * @memberof MapObject
     */
    setZoom(zoomNumber) {
        this.options.mapobject.setZoom(zoomNumber);
    }
    //获取当前地图层级
    getZoom() {
        return this.options.mapobject.getZoom();
    }

    /**
     *
     * 设置地图类型
     * @param {*} maptype
     * @memberof MapObject
     */
    setMapType(maptype) {
        //触发事件
        if (maptype) {
            datastore.saveData(Globalkey.GLOBAL_MAP_TYPE, maptype);
            //触发事件
            Events.fire(Eventkey.MAP_TYPE_CHANGE_KEY);
        }
    }

    getMapType() {
        return datastore.getData(Globalkey.GLOBAL_MAP_TYPE);
    }
    /**
     *
     * 设置key值
     * @param {*} datakey
     * @memberof MapObject
     */
    setKey(datakey) {
        if (datakey) {
            datastore.saveData(GlobalKey.GLOBAL_DATA_KEY, datakey);
        }
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