import {
    datastore
} from "../utils/DataStore";
import Globalkey from "../constants/Globalkey";
import driveshipimg from "../../images/unshipfleetdrive.png";
import stopshipimg from "../../images/unshipfleetstop.png";

import {
    duToGpsDMS,
    gpsToDu,
    duToGpsDM
} from "../utils/GpsUtil";
import {
    LongToStr2,
    formatAnchorTime,
    formatAisTime
} from "../utils/DateUtils";
import Constants from "../constants/Constants";
/**
 *
 * 获取船舶方向
 * @param {*} data
 */
function getheading(data) {
    var heading = data.heading;
    if (!heading) {
        heading = data.course;
    }
    if (heading && heading == "N/A") {
        heading = 0;
    }
    return heading;
}

/**
 *
 * 根据船舶自身状态和速度来获取船舶状态
 * @param {*} status
 * @param {*} speed
 * @returns
 */
function shipStatu(status, speed) {
    try {
        speed = parseFloat(speed);
        if ((!status || status == "1") && speed > 0.3 || speed > 3) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

/**
 *
 *判断船舶是否在船队中
 * @param {*} mmsi
 */
function getFleetShipData(mmsi) {
    var shipdata = "";
    try {
        var shipListdata = datastore.getData(Globalkey.GLOBAL_SHIP_DATA);
        for (var i in shipListdata) {
            if (parseInt(shipListdata[i].mmsi) === parseInt(mmsi)) {
                shipdata = shipListdata[i];
                break;
            }
        }
        return shipdata;
    } catch (e) {}
    return shipdata;
}
/**
 *
 * 获取船舶数据
 * @param {*} mmsi
 */
function getShipData(mmsi) {
    var shipdata = "";
    try {
        var shipListdata = datastore.getData(Globalkey.GLOBAL_SHIP_DATA);
        for (var i in shipListdata) {
            if (parseInt(shipListdata[i].mmsi) === parseInt(mmsi)) {
                shipdata = shipListdata[i];
                break;
            }
        }
        if (!shipdata) {
            var searchData = datastore.getData(Globalkey.GLOBAL_SEARCH_SHIP_DATA);
            if (searchData.mmsi === mmsi) shipdata = searchData;
        }
    } catch (error) {
        shipdata = "";
    }
    return shipdata;
}

/**
 *
 *根据船舶mmsi和字段名称来获取字段的值
 * @param {*} shipmmsi
 * @param {*} filedName
 */
function getShipFiledValue(shipMmsi, filedName) {
    var shipData = getShipData(shipMmsi);
    if (!shipData) return "";
    return shipData[filedName] || "";
}
/**
 *
 * 判断船舶是否是停泊或者是在航
 * @param {*} status
 * @param {*} speed
 * @returns
 */
function isShipOnline(status, speed) {
    try {
        if ((!status || status == "1") && speed > 0.3 || speed > 3) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

/**
 *
 * 获取船舶状态
 * @param {*} params
 * @returns
 */
function getShipStatus(status, speed) {
    var statuStr = "在途";
    if (!isShipOnline(status, speed) && status) {
        if (status == "2") {
            statuStr = "已靠泊";
        } else if (status == "3") {
            statuStr = "已锚泊";
        } else {
            statuStr = "已停泊";
        }
    }
    return statuStr;
}

function usTimeToZh(surplusTime) {
    try {
        if (surplusTime && surplusTime.indexOf("m") > 0) {
            surplusTime = surplusTime.substring(0, surplusTime.indexOf("m")) + "m";
        }
        /* else {
                   return surplusTime;
               } */
        if (surplusTime.indexOf("d") > 0) surplusTime = surplusTime.replace(/d/, "天");
        if (surplusTime.indexOf("h") > 0) surplusTime = surplusTime.replace(/h/, "时");
        if (surplusTime.indexOf("m") > 0) surplusTime = surplusTime.replace(/m/, "分");
        return surplusTime;
    } catch (e) {
        console.log(e);
        return "";
    }
}

/*******
 *value:经纬度数值，浮点型
 *valuetype：经度、纬度类型判断lon，lat
 *GpsUtil.duToGpsDMS
 *****/
function lonLatTranslate(value, valuetype) {
    var backvalue = "";
    if (valuetype == "lon") {
        if (value < 0) {
            if (value < -180) {
                value = 360 + value;
                backvalue = duToGpsDM(value, "E");
            } else {
                backvalue = duToGpsDM(value, "W");
            }
        } else {
            if (value > 180) {
                value = 360 - value;
                backvalue = duToGpsDM(value, "W");
            } else {
                backvalue = duToGpsDM(value, "E");
            }
        }
    } else if (valuetype == "lat") {
        if (value < 0) {
            backvalue = duToGpsDM(value, "S");
        } else {
            backvalue = duToGpsDM(value, "N");
        }
    }
    return backvalue;
}

/**
 * 船舶出发港是否为空
 * @param {*} shipdata 
 */
function shipDepartPortIsEmpty(shipData) {
    try {
        if (shipData && shipData.departurePortName && shipData.departurePortName != "未知") return true;
        return false;
    } catch (e) {
        return false;
    }
}

/**
 *
 * 判断船舶目的港是否为空
 * @param {*} shipData
 * @returns
 */
function shipDestiPortIsEmpty(shipData) {
    try {
        if (shipData && shipData.destinationPort && shipData.destinationPort != "未知") {
            return true;
        } else if (shipData && shipData.anchorPortName && shipData.anchorPortName != "未知") {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function dealShipData(shipData) {
    try {
        /****航次信息对象****/
        var optionsObject = new Object();
        var ship_status = shipData.ship_status;
        var status_str = "在航"; //"在航";//port_underway
        var departTimeStr = "";
        var departDateStr = "";
        if (shipData.departTime) {
            departDateStr = LongToStr2(shipData.departTime * 1000).substring(5).substring(0, 11);
            departTimeStr = departDateStr.substring(0, 6);
        }
        var posTimeStr = formatAisTime(shipData.posTime);
        var shipSpeed = 0.0;
        if (shipData.speed) {
            shipSpeed = shipData.speed;
        }
        //锚泊时间
        var anchorTime = "";
        if (shipData.anchorTime) {
            anchorTime = formatAnchorTime(shipData.anchorTime);
        }
        //航迹象
        var shipCourse = "";
        if (shipData.course) {
            shipCourse = shipData.course + "°";
        }
        var departPortName = "";
        if (shipData.departurePortName) {
            departPortName = shipData.departurePortName;
        }
        var shipopenName = shipData.shipename || shipData.shipname;
        if (shipData.shipname) {
            shipopenName = shipData.shipname;
        }
        if (!shipopenName) {
            shipopenName = shipData.mmsi;
        }
        status_str = getShipStatus(ship_status, shipSpeed); // this.getShipStatus(shipData);
        var destinationPort = "";
        if (shipData.destinationPort) {
            destinationPort = shipData.destinationPort
        } else if (shipData.eta_dest_port) {
            destinationPort = shipData.eta_dest_port;
        }
        var eta_timeStr = "";
        if (shipData.eta != null) {
            eta_timeStr = (shipData.eta).replace("-", "/");
        }
        if (!ship_status) {
            ship_status = "1";
            departPortName = "", destinationPort = "";
        }
        var shipNoMePosttime = shipData.postime;
        /***对象信息复制***/
        optionsObject.departTimeStr = departTimeStr;
        optionsObject.departDateStr = departDateStr;
        optionsObject.status_str = status_str;
        optionsObject.destinationPort = destinationPort;
        optionsObject.eta_timeStr = eta_timeStr;
        optionsObject.shipname = shipopenName;
        optionsObject.departPortName = departPortName;
        optionsObject.shipCourse = shipCourse;
        optionsObject.posTimeStr = posTimeStr;
        optionsObject.shipNoMePosttime = shipNoMePosttime;
        optionsObject.ship_status = ship_status;
        optionsObject.anchorTime = anchorTime;
        optionsObject.shipSpeed = shipSpeed;
        return optionsObject;
    } catch (e) {
        console.log(e);
    }
}

/**
 *
 * 获取32位的UUID
 * @returns
 */
function getUUID() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    let UUID = (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    return UUID.replace(/-/g, "");
}

/**
 *获取船舶停泊图标
 *
 * @param {*} status
 * @returns
 */
function getStartStopIcon(status) {
    var imgURL = "images/stay_unknown_icon.png";
    if (status === "2") {
        imgURL = "images/stay_stop_icon.png";
    } else if (status === "3") {
        imgURL = "images/stay_anchor_icon.png";
    }
    return L.icon({
        iconUrl: "images/stay_unknown_icon.png",
        iconSize: [20, 30],
        iconAnchor: [10, 30]
    });
}
/**
 * 获取船舶运行中的icon
 *
 */
function getRuningIcon() {
    return L.icon({
        iconUrl: driveshipimg,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        shadowSize: [0, 0],
    });
}
/**
 *获取停泊的icon
 *
 */
function getStopIcon() {
    return L.icon({
        iconUrl: stopshipimg,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        shadowSize: [0, 0]
    });
}

/**
 * 轨迹点不能超过船舶位置点
 *
 * @param {*} voyageData
 * @param {*} shipMmsi
 * @returns
 * @memberof VoyagePoint
 */
function filterNowVoyageData(voyageData, shipMmsi) {
    let shipPostTime = getShipFiledValue(shipMmsi, "postime");
    try {
        /***
         *说明：用户未付费时候
         *且数据是按倒序排序的
         ***/
        var pointlist = voyageData.data;
        for (var i = pointlist.length - 1; i >= 0; i--) {
            if (parseInt(shipPostTime) < parseInt(pointlist[i].pos_time)) {
                delete pointlist[i];
                pointlist.length = pointlist.length - 1;
            } else {
                break;
            }
        }
        /***
         *所有停泊点时间处理*
         *数据节点按照倒序来的
         */
        var stoppointlist = voyageData.othervalue;
        var newstoppoint = [];
        if (stoppointlist.length > 0) {
            for (var i = 0; i < stoppointlist.length; i++) {
                //存在停泊点小于，启动点大于的情况，则启动点点时候应该为当前时间
                if (parseInt(shipPostTime) >= parseInt(stoppointlist[i].pos_time)) {
                    if (stoppointlist[i].navigate_status != "1" && i > 0 && newstoppoint.length == 0) {
                        stoppointlist[i - 1].pos_time = shipPostTime;
                        newstoppoint.push(stoppointlist[i - 1]);
                    }
                    newstoppoint.push(stoppointlist[i]);
                }
            }
        }
        voyageData.data = pointlist;
        voyageData.othervalue = newstoppoint;
        return voyageData;
    } catch (e) {}
    return voyageData;
}


export {
    getUUID,
    shipStatu,
    usTimeToZh,
    getheading,
    getStopIcon,
    getShipData,
    dealShipData,
    isShipOnline,
    getRuningIcon,
    getShipStatus,
    lonLatTranslate,
    getFleetShipData,
    getStartStopIcon,
    getShipFiledValue,
    filterNowVoyageData,
    shipDestiPortIsEmpty,
    shipDepartPortIsEmpty
}