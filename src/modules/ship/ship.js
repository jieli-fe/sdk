/**
 * 船舶位置基本展示
 */
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
    LonLatTrans,
} from "../utils/GpsCorrect";
import {
    shipStatu,
    getRuningIcon,
    getStopIcon
} from "./ShipUtils";
require("../utils/rotatedmarker");
import testmarker from "../../images/end.png";
export default class Ship {
    constructor(shipid, customoptions) {
        this.options = Object.create({
            mapview: datastore.getData(GlobalKey.MAPOBJECT),
            shipmarker: ""
        });
        this.events = Object.create({
            Loaderror_Event_Type: "loaderror",
            Loadstart_Event_Type: "loadstart",
            Loadend_Event_Type: "loadend",
            Click_Event_Type: ("click" + shipid),
            Loaderror_Event_Key: "Loaderror_Event_Key",
            Loadstart_Event_Key: "Loadstart_Event_Key",
            Loadend_Event_Key: "Loadend_Event_Key",
            Click_Event_Key: "Click_Event_Key"
        });
        this.markerClick = this.markerClick.bind(this);
        //地图切换事件
        // Events.addEvent(this.events.Click_Event_Key, shipid, this.markerClick);
        Events.addEvent(Eventkey.MAP_TYPE_CHANGE_KEY, "ship-marker-change" + shipid, this.mapchange);
        //地图切换事件
        this.initShip(shipid, customoptions);
    }

    /**
     *
     * 获取船舶数据
     * @memberof Ship
     */
    initShip(shipid, customoptions) {
        var datakey = datastore.getData(GlobalKey.GLOBAL_DATA_KEY) || Constants.DATA_API_TEST_KEY;
        if (!datakey) {
            throw "Api key can not be null";
        }
        if (!shipid) {
            throw "shipid can not be null";
        }
        let postData = {
            shipid: shipid,
            key: datakey
        }
        var _self = this;
        Events.fire(this.events.Loadstart_Event_Key);
        $.ajax({
            type: 'POST',
            url: Constants.SHIP_POSITION_INFO_KEY, //船舶基本信息地址
            data: postData,
            success: function (response) {
                if (parseInt(response.status) === Constants.LOAD_DATA_SUCESS) {
                    //加载后
                    let responseData = response.result;
                    _self.drawShip(responseData[0], customoptions);
                    Events.fire(_self.events.Loadend_Event_Key);
                } else {
                    //加载失败
                    Events.fire(_self.events.Loaderror_Event_Key);
                    throw "Load data error ,errorcode is " + response.status;
                }
            },
            error: function (error) {
                Events.fire(_self.events.Loaderror_Event_Key);
                throw error;
            },
            dataType: "json"
        });
    }
    /**
     *
     * 内部绘制方法绘制船舶位置
     * @memberof Ship
     */
    drawShip(shipdata, cusoptions) {
        let lat = shipdata.latitude || 0;
        let lon = shipdata.longitude || 0;
        lat = parseFloat(lat) / Constants.LATLON;
        lon = parseFloat(lon) / Constants.LATLON
        var latlon = LonLatTrans(lat, lon);
        let heading = shipdata.heading || shipdata.course || 0;
        heading = parseFloat(heading);
        var shipicon = this.getShipIcon(shipdata, cusoptions);
        var Lmarker = L.marker(latlon, {
            rotationAngle: heading,
            icon: shipicon,
            mmsi: shipdata.mmsi
        });
        /***、
         * 
         * img locate rotate offset showTag  tag
         * 
         * * */
        if (cusoptions && cusoptions.showTag && cusoptions.tag) {
            Lmarker.bindTooltip("&nbsp;" + cusoptions.tag + "&nbsp;", {
                permanent: true,
                className: "leaflet-label-ship",
                direction: "right"
            })
        }
        Lmarker.on("click", this.markerClick);
        Lmarker.lat = lat;
        Lmarker.lon = lon;
        this.options.shipmarker = Lmarker;

        //设置偏移量和图片
        if (cusoptions && cusoptions.img) {
            this.setImg(cusoptions.img);
        }
        if (cusoptions && cusoptions.offset) {
            this.setOffset(cusoptions.offset);
        }

        this.options.mapview.addLayer(Lmarker);
        this.options.mapview.setView(latlon, this.options.mapview.getZoom());
        //        

    }

    /**
     *
     * 船舶点击事件
     * @param {*} e
     * @memberof Ship
     */
    markerClick(e) {
        //船舶点击事件处理
        Events.fire(this.events.Click_Event_Key, e);
    }
    /**
     *
     * 地图切换时候
     * @memberof Ship
     */
    mapchange() {
        if (this.options.shipmarker) {
            var shipmarker = this.options.shipmarker;
            let mapobject = this.options.mapview;
            if (mapobject.hasLayer(shipmarker)) {
                let lonlat = LonLatTrans(shipmarker.lat, shipmarker.lon);
                shipmarker.setLatLng(lonlat);
            }
        }
    }

    /**
     *
     * 更改相关属性
     * @memberof Ship
     */
    setOptions(options) {
        try {

            //img  locate rotate offset showTag tag
            if (options && options.img) {
                this.setImg(options.img);
            }
            if (options && options.offset) {
                this.setOffset(options.offset);
            }
            if (options && options.locate) {
                this.setLocate();
            }
            if (options && options.rotate) {
                this.setRotate(options.rotate);
            }
            if (options && options.showTag && showTag.tag) {
                this.setTag(showTag.tag);
            }
        } catch (e) {
            console.log(e);
        }
    }
    /**
     *
     * 更改船舶图标
     * @memberof Ship
     */
    setImg(impagepath) {
        try {
            if (impagepath && this.options.shipmarker) {
                var shipmarker = this.options.shipmarker;
                var iconObject = shipmarker.options.icon;
                iconObject.options.iconUrl = impagepath;
                shipmarker.setIcon(iconObject);
            }
        } catch (e) {
            console.log(e);
        }

    }

    /**
     *
     * 船舶图标的偏移量
     * @memberof Ship
     */
    setOffset(offset) {
        try {
            if (offset && this.options.shipmarker) {
                var shipmarker = this.options.shipmarker;
                var iconObject = shipmarker.options.icon;
                iconObject.options.iconAnchor = offset;
                shipmarker.setIcon(iconObject);
            }
        } catch (e) {
            console.log(e);
        }
    }
    //将船舶位置移动到最中央
    setLocate() {
        //存在船舶图标
        try {
            if (this.options.shipmarker) {
                let mapview = this.options.mapview;
                mapview.setView(this.options.shipmarker.getLatLng(), mapview.getZoom());
            }
        } catch (error) {
            console.log(error);
        }

    }
    /**
     *
     * 设置船舶旋转角度
     * @memberof Ship
     */
    setRotate(rotate) {
        if (!isNaN(rotate) && this.options.shipmarker) {
            this.options.shipmarker.setRotationAngle(parseFloat(rotate));
        }
    }
    /**
     *
     * 设置船舶标签内容
     * @memberof Ship
     */
    setTag(tagname) {
        //更改提示内容
        var shipmarker = this.options.shipmarker;
        if (shipmarker) {

            shipmarker.unbindTooltip().bindTooltip("&nbsp;" + tagname + "&nbsp;", {
                permanent: true,
                className: "leaflet-label-ship",
                direction: "top",
                offset:[0,-10]
            });
            shipmarker.openTooltip(shipmarker.getLatLng());
        }
    }

    // getShip() { }

    /**
     *
     * 添加到地图上
     * @memberof Ship
     */
    addTo() {
        try {
            //判断船舶是否在地图上，若未在，则添加到地图，若在，则不予添加
            let mapview = this.options.mapview;
            let shipMarker = this.options.shipmarker;
            if (!shipMarker) return;
            if (!mapview.hasLayer(shipMarker)) {
                mapview.addLayer(shipMarker);
            }
        } catch (e) {
            console.log(e);
        }
    }
    //从地图上移除船舶图标
    remove() {
        let mapview = this.options.mapview;
        let shipMarker = this.options.shipmarker;
        if (!shipMarker) return;
        mapview.removeLayer(shipMarker);
    }
    /**
     *
     * 创建船舶图标
     * @memberof Ship
     */
    getShipIcon(shipdata, cusoptions) {
        let stopmark = shipStatu(shipdata.nav_status, shipdata.speed);
        if (stopmark) {
            return getRuningIcon();
        } else {
            return getStopIcon();
        }
    }

    on(eventtype, callback) {
        if (!eventtype && callback) {
            throw "event or callback  can not be null";
        }
        switch (eventtype) {
            case this.events.Loaderror_Event_Type:
                // Events.addEvent(this.events.Loaderror_Event_Key, this.events.Loadend_Event_Type, callback);
                break;
            case this.events.Loadstart_Event_Type:
                // Events.addEvent(this.events.Loadstart_Event_Key, this.events.Loadend_Event_Type, callback);
                break;
            case this.events.Loadend_Event_Type:
                // Events.addEvent(this.events.Loadend_Event_Key, this.events.Loadend_Event_Type, callback);
                break;
            case this.events.Click_Event_Type:
                Events.addEvent(this.events.Click_Event_Key, this.events.Loadend_Event_Type, callback);
                break;
        }
    }
    /**
     *
     * 取消相关事件
     * @param {*} eventtype
     * @memberof Ship
     */
    off(eventtype) {
        if (!eventtype) {
            throw "event can not be null";
        }
        switch (eventtype) {
            case this.events.Loaderror_Event_Type:
                Events.clearEvent(this.events.Loaderror_Event_Key, this.events.Loadend_Event_Type);
                break;
            case this.events.Loadstart_Event_Type:
                Events.clearEvent(this.events.Loadstart_Event_Key, this.events.Loadend_Event_Type);
                break;
            case this.events.Loadend_Event_Type:
                Events.clearEvent(this.events.Loadend_Event_Key, this.events.Loadend_Event_Type);
                break;
            case this.events.Click_Event_Type:
                Events.clearEvent(this.events.Click_Event_Key, this.events.Loadend_Event_Type);
                break;
        }
    }
}