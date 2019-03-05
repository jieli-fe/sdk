/***  
 * 船舶选择公共方法 多余类，抽到ShipUtils 类中
 */
import Eventkey from "../config/Eventkey";
import {Events} from "./EventManageUtil";
import directionImg from "../images/voyage_direction.png";

var selectMarker = "";

var directMarker = "";
var startIcon = "";
var stopIcon = "";
var isLoadAnalyseJs = false;

function getselectedMarker() {
    if (!selectMarker) {
        selectMarker = L.marker([10, 10], {
            icon: L.icon({
                iconUrl: "../images/ship_select.png",
                iconAnchor: [16, 16]
            })
        });
    }
    return selectMarker;
}
/**
 *
 * 航线方向处理
 * @returns
 */
function getDirecIcon() {
    if (!directMarker) {
        directMarker = L.icon({
            iconUrl: directionImg,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
            shadowSize: [0, 0]
        });
    }
    return directMarker;
}

function getPlanStart() {
    if (!startIcon) {
        startIcon = L.icon({
            iconUrl: 'images/end.png',
            iconSize: [20, 26],
            iconAnchor: [10, 26]
        });
    }
    return startIcon;
}

function getPlanStop() {
    if (!stopIcon) {
        stopIcon = L.icon({
            iconUrl: 'images/start.png',
            iconSize: [20, 26],
            iconAnchor: [10, 26]
        });
    }
    return stopIcon;
}

/**
 *触发分析事件
 *
 * @param {*} paramsObject
 */
function fireAnalyseEvent(paramsObject) {
   /* if (!isLoadAnalyseJs) {
        var _self = this;
        require.ensure(['./VoyageAnalyse'], (e) => {
            let VoyageAnalyse = require('./VoyageAnalyse').default;
            //初始化该对象
            new VoyageAnalyse();
            isLoadAnalyseJs = true;
            Events.fire(Eventkey.SHIP_VOYAGE_ANALYSE_KEY, paramsObject);
        });
    } else {
        Events.fire(Eventkey.SHIP_VOYAGE_ANALYSE_KEY, paramsObject);
    }*/
}


function getShipVoyageDom(departPortName, destinationPort, departDateStr, arriveTimeStr) {
    return `<div style="float:left;display:block;">
                <div class="detail-voyage-portbox">
                    <div class="detail-voyage-depart hidden-text" style="padding-right:20px;">${departPortName}</div>
                    <div class="detail-voyage-arrive hidden-text" style="padding-left:5px;">${destinationPort}</div>
                </div>
                <div class="detail-dotted-box">
                    <div class="detail-dotted-depart"><span></span></div>
                    <div class="detail-dotted-line"><b></b></div>
                    <div class="detail-dotted-arrive"><span></span></div>
                </div>
                <div class="detail-time-box">
                    <div class="detail-voyage-depart hidden-text">${departDateStr}</div>
                    <div class="detail-voyage-arrive hidden-text">${arriveTimeStr}</div>
                </div>
                <div class="detail-voyage-img"></div>
            </div>`;
}



export {
    getselectedMarker,
    getDirecIcon,
    getPlanStart,
    getPlanStop,
    fireAnalyseEvent,
    getShipVoyageDom
}