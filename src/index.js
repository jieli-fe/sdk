import Map from "./modules/map/mapobject";
import ShipInfo from "./modules/ship/shipinfo";
import Ship from './modules/ship/ship';
import ShipTrace from './modules/ship/shiptrace';
import "leaflet/dist/leaflet.css"
import { version } from "../package.json"
import "./stylus/index.styl"
import { polygon, polyline, marker, addTo, circleMarker, icon } from "./modules/layer"
import L from "leaflet"
import "./modules/map/mbj"
import "./modules/map/test"

function LoongshipMap(params) {

    //地图
    function map(mapId, options) {
        //return new Map(mapId, options);
        return L.map(mapId, options);
    }

    //船舶
    function ship(shipId, options) {
        this._ship = L.plugin.addShip(shipId, options)
        return this._ship
    }

    //船舶基本信息
    function shipInfo(options) {
        var shipInfo = new ShipInfo();
        shipInfo.getShipInfo();
    }

    //船舶基本轨迹
    function trace(shipId, startTime, endTime, options) {
        return new ShipTrace(shipId, startTime, endTime, options);
    }

    return {
        updateTag: '1.0.03',
        polygon,
        polyline,
        marker,
        addTo,
        circleMarker,
        icon,
        version: version,
        map: map,
        ship: ship,
        shipInfo: shipInfo,
        trace: trace
    }
};

export default LoongshipMap();