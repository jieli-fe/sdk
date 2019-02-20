// import $ from 'jquery';
import Map from "./modules/map/mapobject";
import ShipInfo from "./modules/ship/shipinfo";
import Ship from './modules/ship/ship';
import ShipTrace from './modules/ship/shiptrace';
import "leaflet/dist/leaflet.css"
import packageConfig from "../package.json"
// window.jQuery = $;
// window.$ = $;

var LoongshipMap = function name(params) {

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
        version: packageConfig.version,
        map: map,
        ship: ship,
        shipInfo: shipInfo,
        trace: trace
    }
}();
window.LS = LoongshipMap;

module.exports = LoongshipMap;
// if (typeof module != 'undefined' && module.exports) {  //CMD
//     module.exports = LoongshipMap;
// } else if (typeof define == 'function' && define.amd) {  //AMD
//     define(function() {
//         return LoongshipMap;
//     });
// } else {

//     window.LS= LoongshipMap;
// }