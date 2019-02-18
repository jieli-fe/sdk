/**
 * 全局变量管理类,单列模式
 */

class DataStore {
    constructor() {
        this.datamap = new Map();
    }
    /**
     * [saveData 保存数据]
     * @param  {[type]} datakey [数据key]
     * @param  {[type]} data    [数据]
     * @return {[type]}         [成功返回true，错误返回false]
     */
    saveData(datakey, data) {
        try {
            this.datamap.set(datakey, data);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * [getData 通过key 获取相应的值]
     * @param  {[type]} datakey [key]
     * @return {[type]}         [没有值时候返回null,有值则返回]
     */
    getData(datakey) {
        try {
            var data = this.datamap.get(datakey);
            if (!data) {
                return null;
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    /**
     * [deleteData 删除存储的数据]
     * @param  {[type]} datakey [description]
     * @return {[type]}         [成功true,否则返回false]
     */
    deleteData(datakey) {
        try {
            return this.datamap.delete(datakey);
        } catch (e) {
            return false;
        }
    }
}

var storeObject = null;
var datastore = function datastore() {
    if (!storeObject) {
        storeObject = new DataStore();
    }
    return storeObject;
}();

export {datastore}