/**
 * 全局事件管理类,添加时间，触发事件，删除事件，单列模式
 * 
 */
class EventManage {
    constructor() {
        //数组结构为 key,List<Object>类型
        this.eventmap = new Map();
    }
    /**
     * [andEvent 添加事件]
     * @param  {[type]} key          [事件名称]
     * @param  {[type]} keymark      [添加者标志]
     * @param  {[type]} functionname [方法名称]
     * @param  {[type]} paramobject  [注册事件时候参数，类型为对象]
     * @return {[type]}              [成功true，错误false]
     */
    addEvent(key, keymark, functionname, paramobject) {
        try {
            if (!this.eventmap.get(key)) {
                var dataList = [];
                this.eventmap.set(key, dataList);
            }
            this.eventmap.get(key).push({
                keymark: keymark,
                funcname: functionname,
                param: paramobject
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * [fire 触发事件]
     * @param  {[type]} key   [触发事件key]
     * @param  {[type]} param [触发时候所带参数，参数类型，对象]
     * @return {[type]}       [description]
     */
    fire(key, paramobject) {
        try {
            if (!this.eventmap.get(key)) {
                return false;
            }
            var funcList = this.eventmap.get(key);
            if (!paramobject) {
                paramobject = {};
            }
            //执行相关方法
            funcList.forEach((item) => {
                try {
                    //一个出问题了，其他可继续执行
                    if (!item.param) {
                        item.param = {};
                    }
                    var bothdata = Object.assign(paramobject, item.param);
                    (item.funcname)(bothdata);
                } catch (e) {
                    console.log(e);
                }
            });

        } catch (e) {
            return false;
        }
    }

    /**
     * [unbind 移除事件]
     * @param  {[type]} key     [事件名称]
     * @param  {[type]} keymark [事件所带标志符,如果不带此参数，则删除整个key]
     * @return {[type]}         [description]
     */
    clearEvent(key, keymark) {
        //移除时候将list中的给删除掉就行
        try {
            if (!this.eventmap.get(key)) {
                return false;
            } else if (!keymark) {
                this.eventmap.delete(key);
            } else {
                var dataindex = null;
                this.eventmap.get(key).forEach((item, index) => {
                    if (item.keymark === keymark) {
                        dataindex = index;
                    }
                });
                this.eventmap.get(key).splice(dataindex, 1);
                if (this.eventmap.get(key).length === 0) {
                    this.eventmap.delete(key);
                }
            }
            return true;
        } catch (e) {
            return false; 
        }
    }
}

let eventMap = null;
var Events = function () {
    if (!eventMap) {
        eventMap = new EventManage();
    }
    return eventMap;
}();

export {
    Events
}