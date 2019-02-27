import Map from "./modules/map/mapobject";
import ShipInfo from "./modules/ship/shipinfo";
import Ship from './modules/ship/ship';
import ShipTrace from './modules/ship/shiptrace';
import "leaflet/dist/leaflet.css"
import { version } from "../package.json"
import "./stylus/index.styl"
import L from "leaflet"
function LoongshipMap(params) {

    //地图
    function map(mapId, options) {
        return new Map(mapId, options);
    }

    //船舶
    function ship(shipId, options) {
        return new Ship(shipId, options);
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
        updateTag: 1,
        L: L,
        version: version,
        map: map,
        ship: ship,
        shipInfo: shipInfo,
        trace: trace
    }
};

export default LoongshipMap();