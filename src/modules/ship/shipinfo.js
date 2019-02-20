/**
 * 
 * 船舶基本信息展示
 * **  */
import Constants from "../constants/Constants";
import GlobalKey from "../constants/Globalkey";
import Eventkey from "../constants/Eventkey";
import { datastore } from "../utils/DataStore";
import { Events } from "../utils/EventManageUtil";
import http from "../utils/axios"
export default class ShipInfo {
    constructor() {
        this.options = Object.create({
            Loaderror_Event_Type: "loaderror",
            Loadstart_Event_Type: "loadstart",
            Loadend_Event_Type: "loadend",
            Loaderror_Event_Key: "Loaderror_Event_Key",
            Loadstart_Event_Key: "Loadstart_Event_Key",
            Loadend_Event_Key: "Loadend_Event_Key"
        });
    }
    /**
     *
     * 加载船舶数据
     * @memberof ShipInfo
    /**
     *
     *
     * @returns
     * @memberof ShipInfo
     */
    getShipInfo() {
        var datakey = datastore.getData(GlobalKey.GLOBAL_DATA_KEY) || Constants.DATA_API_TEST_KEY;
        if (!datakey) {
            throw "Api key con not be null";
        }
        let postData = {
            shipid: 636015511,
            key: datakey
        }
        let responseData = "";
        //加载前

        Events.fire(this.options.Loadstart_Event_Key);

        var _self = this;
        http.post(Constants.SHIP_BASEINFO_KEY, postData)
            .then((response) => {
                if (parseInt(response.status) === Constants.LOAD_DATA_SUCESS) {
                    //加载后
                    responseData = response.result;
                    Events.fire(_self.options.Loadend_Event_Key);
                } else {
                    //加载失败
                    Events.fire(_self.options.Loaderror_Event_Key);
                    throw "Load data error ,errorcode is " + response.status;
                }
            })
            .catch(()=>{
                Events.fire(_self.options.Loaderror_Event_Key);
                throw error;
            })

        /* $.ajax({
            type: 'POST',
            url: Constants.SHIP_BASEINFO_KEY, //船舶基本信息地址
            async: false,
            data: postData,
            success: function (response) {
                if (parseInt(response.status) === Constants.LOAD_DATA_SUCESS) {
                    //加载后
                    responseData = response.result;
                    Events.fire(_self.options.Loadend_Event_Key);
                } else {
                    //加载失败
                    Events.fire(_self.options.Loaderror_Event_Key);
                    throw "Load data error ,errorcode is " + response.status;

                }
            },
            error: function (error) {
                Events.fire(_self.options.Loaderror_Event_Key);
                throw error;
            },
            dataType: "json"
        }); */
        return responseData;
    }

    /**
     *
     * 添加相关事件
     * @param {*} eventtype
     * @param {*} callback
     * @memberof ShipInfo
     */
    on(eventtype, callback) {
        if (!eventtype && callback) {
            throw "event can not be null";
        }
        switch (eventtype) {
            case this.options.Loaderror_Event_Type:
                Events.addEvent(this.options.Loaderror_Event_Key, this.options.Loadend_Event_Type, callback);
                break;
            case this.options.Loadstart_Event_Type:
                Events.addEvent(this.options.Loadstart_Event_Key, this.options.Loadend_Event_Type, callback);
                break;
            case this.options.Loadend_Event_Type:
                Events.addEvent(this.options.Loadend_Event_Key, this.options.Loadend_Event_Type, callback);
                break;
        }
    }
    /**
     *
     * 移除相关事件
     * @param {*} eventtype
     * @memberof ShipInfo
     */
    off(eventtype) {
        if (!eventtype) {
            throw "event can not be null";
        }
        switch (eventtype) {
            case this.options.Loaderror_Event_Type:
                Events.clearEvent(this.options.Loaderror_Event_Key, this.options.Loadend_Event_Type);
                break;
            case this.options.Loadstart_Event_Type:
                Events.clearEvent(this.options.Loadstart_Event_Key, this.options.Loadend_Event_Type);
                break;
            case this.options.Loadend_Event_Type:
                Events.clearEvent(this.options.Loadend_Event_Key, this.options.Loadend_Event_Type);
                break;
        }
    }
}