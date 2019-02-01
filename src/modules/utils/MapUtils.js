/**
 * 自定义实现map功能
 */
export default class MapUtil {
    constructor() {
        this._mapobject = new Object();
    }
    put(key, value) {
        if (!this._mapobject) {
            this._mapobject = new Object();
        }
        this._mapobject[key] = value;
    }
    /***删除元素***/
    remove(key) {
        delete this._mapobject[key];
    }
    /**获取长度***/
    length() {
        return Object.keys(this._mapobject).length;
    }
    /***清除数据***/
    clear() {
        this._mapobject = new Object();
    }
    /**是否为空**/
    isEmpty() {
        if (Object.keys(this._mapobject).length <= 0) return true;
        return false;
    }
    /**包含键值对的对象**/
    contians(key, value) {
        var _thisobject = this._mapobject[key];
        if (_thisobject == undefined || _thisobject != value) return false;
        return true;
    }
    /**是否包含该值***/
    containskey(key) {
        if (this._mapobject == undefined) return false;
        var _thiskey = this._mapobject[key];
        if (_thiskey != undefined) return true;
        return false;
    }
    /***包含值***/
    containsvalue(values) {
        var hasmark = false;
        for (var key in this._mapobject) {
            if (this._mapobject[key] == values) {
                hasmark = true;
                break;
            }
        }
        return hasmark;
    }
    /**返回一个key-value对象***/
    entryset() {
        return this._mapobject;
    }
    /**返回一个键的数组**/
    getKeys() {
        return Object.keys(this._mapobject);
    }
    
    get(key) {
        return this.getValue(key);
    }

    getValue(key) {
        if (this._mapobject == undefined) return null;
        return this._mapobject[key];
    }
}