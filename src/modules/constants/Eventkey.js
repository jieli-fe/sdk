/***
 * 事件key值存储
 * 命名方式，模块名加事件名
 */
export default {
    SHIP_LIST_BOARD: "SHIP_LIST_BOARD", //创建船舶列表的触发key
    SHIP_DRAW_KEY: "SHIP_DRAW_KEY",
    MAP_ZOOMED_KEY: "MAP_ZOOMED_KEY", //地图切换事件key
    MAP_MOVEEND_KEY: "MAP_MOVEEND_KEY", //地图移动结束
    MAP_MOUSEMOVE_KEY: "MAP_MOUSEMOVE_KEY",
    MAP_TYPE_CHANGE_KEY: "MAP_TYPE_CHANGE_KEY", //地图切换事件
    SHIP_SHOW_HIDE_KEY: "SHIP_SHOW_HIDE_KEY", //船舶单条和批量展示的事件key
    //船舶弹窗处理与船舶定位处理
    SHIP_POSITION_KEY: "SHIP_POSITION_KEY",
    WIN_RESIZE_KEY: "WIN_RESIZE_KEY",
    SHIP_DETAIL_WIN_KEY: "SHIP_DETAIL_WIN_KEY", //船舶详情框处理
    SHIP_DETAIL_CLOSE_KEY: "SHIP_DETAIL_CLOSE_KEY", //关闭船舶弹窗页面
    SHIP_VOYAGE_SHOW_KEY: "SHIP_VOYAGE_SHOW_KEY", //船舶航行轨迹展示key
    SHIP_DETAIL_NEW_WIN: "SHIP_DETAIL_NEW_WIN", //点击另外一条船舶展示详情时候
    SHIP_SEARCH_FOCUS_KEY: "SHIP_SEARCH_FOCUS_KEY", //船舶输入框聚焦时候
    SHIP_SEARCH_CLOSE_KEY: "SHIP_SEARCH_CLOSE_KEY", //船舶输入内容时候
    SHIP_SEARCH_CLICK_KEY: "SHIP_SEARCH_CLICK_KEY",
    SHIP_MESSGAE_EDIT_KEY: "SHIP_MESSGAE_EDIT_KEY", //船舶信息编辑时候
    SHIP_GROUP_EDIT_KEY: "SHIP_GROUP_EDIT_KEY", //船舶分组编辑
    SHIP_VOYAGE_ANALYSE_KEY: "SHIP_VOYAGE_ANALYSE_KEY", //航线分析框
    SHIP_FOUCS_KEY: "SHIP_FOUCS_KEY", //用户关注船舶
    SHIP_UNFOUCS_KEY: "SHIP_UNFOUCS_KEY", //用户取消关注船舶
    SHIP_FOCUS_SUCESS_KEY: "SHIP_FOCUS_SUCESS_KEY", //船舶关注成功之后
    SHIP_UNFOCUS_SUCESS_KEY: "SHIP_UNFOCUS_SUCESS_KEY", //用户取消关注成功
    TIME_VOYAGE_SUCESS_KEY: "TIME_VOYAGE_SUCESS_KEY", //按时间段查询轨迹，成功之后
    VOYAGE_ANALYSE_CLOSE_KEY: "VOYAGE_ANALYSE_CLOSE_KEY", //船舶分析
    TIME_WIN_CLOSE_KEY: "TIME_WIN_CLOSE_KEY", //按时间段查询关闭时候
    SHIP_GROUP_EDIT_SUCESS_KEY: "SHIP_GROUP_EDIT_SUCESS_KEY", //船舶分组编辑成功之后
    SHIP_GROUP_DELETE_KEY: "SHIP_GROUP_DELETE_KEY", //船舶分组删除
    SHIP_MESSAGE_SAVED_KEY: "SHIP_MESSAGE_SAVED_KEY", //船舶信息编辑
    VOYAGE_PLAN_INIT_KEY: "VOYAGE_PLAN_INIT_KEY", //计划航线模块
    VOYAGE_PLAN_SUCESS_KEY: "VOYAGE_PLAN_SUCESS_KEY", //计划航线开始和结束成功之后
    UTILS_TOOLS_INIT_KEY: "UTILS_TOOLS_INIT_KEY", //地图初始化
    MEASURE_FISH_CLICK: "MEASURE_FISH_CLICK", // 地图测距关闭之后事件
    WEATHER_INIT_KEY: "WEATHER_INIT_KEY", //气象模块初始化
    OCEANWEAHTER_MODEL_KEY: "OCEANWEAHTER_MODEL_KEY",
    LAYER_MANAGE_INIT: "LAYER_MANAGE_INIT", //图层按钮初始化
    LAYER_DRAW_CONTROLL: "LAYER_DRAW_CONTROLL", //图层展示与隐藏
    PIRATE_DRAW_KEY: "PIRATE_DRAW_KEY", //海盗事件处理
    AIS_DATA_INIT_KEY: "AIS_DATA_INIT_KEY",
    CUSTOMER_MARK_INIT_KEY: "CUSTOMER_MARK_INIT_KEY", //标记初始化
    TOOLS_BAR_CONTENT_UP_KEY: "TOOLS_BAR_CONTENT_UP_KEY", //地图右侧功能框只展示一个

    /******用户自定义事件的标志健*****/
    CUSTOM_CLICK_EVENT_KEY: "CUSTOM_CLICK_EVENT_KEY", //用户自定义点击事件
    CUSTOM_MOVE_EVNET_KEY: "CUSTOM_MOVE_EVNET_KEY", // 用户自定义移动事件
    CUSTOM_ZOOM_EVENT_KEY: "CUSTOM_ZOOM_EVENT_KEY", // 用户自定义地图点击事件


}