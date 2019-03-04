import L from "leaflet"
import "./sdk/map"
import "./sdk/ship"
// import ShipInfo from "./modules/ship/shipinfo";
// import ShipTrace from './modules/ship/shiptrace';
import { version } from "../package.json"
import { polygon, polyline, marker, addTo, circleMarker, icon } from "./modules/layer"

import "leaflet/dist/leaflet.css"
import "./stylus/index.styl"

function LoongshipMap(params) {

    //地图
    function map(mapId, options) {
        return L.map(mapId, options);
    }

    //船舶
    function ship(shipId, options) {
        this._ship = L.plugin.addShip(shipId, options)
        return this._ship
    }

    // //船舶基本信息
    // function shipInfo(options) {
    //     var shipInfo = new ShipInfo();
    //     shipInfo.getShipInfo();
    // }

    // //船舶基本轨迹
    // function trace(shipId, startTime, endTime, options) {
    //     return new ShipTrace(shipId, startTime, endTime, options);
    // }

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
        // shipInfo: shipInfo,
        // trace: trace
    }
};

export default LoongshipMap();