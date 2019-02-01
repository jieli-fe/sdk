/***
 * 常量管理
 */
export default {
    MAP_URL: "http://mt{s}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&s=Gal&z={z}&x={x}&y={y}",
    MAP_URL2: "http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2szh-CN!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0",
    STATE_URL: "http://mt{s}.google.cn/vt?lyrs=y&hl=zh-CN&gl=CN&z={z}&x={x}&y={y}",
    STATE_URL_NEW: "http://www.google.cn/maps/vt?lyrs=s@804&gl=cn&x={x}&y={y}&z={z}",
    STATE_URL_GIRD: "http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i430134816!3m17!2szh-CN!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmapSatellite!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy50OjMzfHMuZTpsfHAudjpvZmYscy50OjJ8cy5lOmx8cC52Om9mZg!4e0!23i1301875&key=AIzaSyDer5qPNgUIqnhrYiunMgKT81mFtO4q2oA",
    CHART_URL: ["http://emap.shipdt.com/"],
    CHART_ERROR: "http://www.loongship.com/404.png",
    MIN_POINT_DISTANCE: 50,
    DEFAULTX: 106,
    DEFAULTY: 24,
    LATLON: 600000,
    SERVER_URL: "http://www.shipdt.com/lvservice",
    PORT_CALL_HIS: "PORT_CALL_HIS", //
    PORT_CALL_NOW: "PORT_CALL_NOW",
    PORT_CALL_TIME: "PORT_CALL_TIME", //按时间段查询轨迹
    VOYAGE_PLAN_DATA: "VOYAGE_PLAN_DATA",
    PORT_LOOK_EVENT: "PORT_LOOK_EVENT",
    PORT_ANALYSE_EVENT: "PORT_ANALYSE_EVENT",
    NO_DEPART_DEFAULT: 7,
    LOAD_DATA_SUCESS: 0,
    SPEED_MORETHAN_TEN_COLOR: "#17bf00",
    SPEED_MORETHAN_FIVE_COLOR: "#ff9f19",
    SPEED_MORETHAN_ONE_COLOR: "#f23030",
    SEARCH_COOLIKE_KEY: "SEARCH-COOKIE-KEY",
    DOM_CLICK_TYPE: "CANCEL", //取消弹窗或者关闭
    COMPARE_SHIP_LENGTH: 10,
    CHAT_MAP_TYPE: "chart",
    SITE_MAP_TYPE: "sat",
    MAP_MAP_TYPE: "map",
    GLOBAL_WEATHER_URL: "https://world-weather.oss-cn-beijing.aliyuncs.com/current/",
    MAP_EVENT_CLICK: "click",
    MAP_EVENT_MOVE: "move",
    MAP_EVENT_ZOOM: "zoom",
    /****ship_baseinfo */
    SHIP_BASEINFO_KEY: "http://api.shipdt.com/DataApiServer/getShipBasicInformation",
    DATA_API_TEST_KEY: "48755a5ab4064e7a91b60ddecc3d8c11",
    SHIP_POSITION_INFO_KEY: "http://api.shipdt.com/DataApiServer/getShipLatest",//最新船位查询服务
    SHIP_TRACE_INFO_KEY: "http://api.shipdt.com/DataApiServer/getShipHistoryTrack", //船舶轨迹
}