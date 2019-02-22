// import LS from "../../lib/index"
// window.LS = LS
import LS from "../../src/index"
window.LS = LS
import "./app.styl"



var map = LS.map("map", {
    center: [31, 122],
    zoom: 6,
    mapType: 'map', //'map'/'sat'/'chart'
    key: '48755a5ab4064e7a91b60ddecc3d8c11',
});

window.map = map

var shipObject = LS.ship(412001);

function displayControlLayer() {
    var layerIndex = 0;
    var layers = document.querySelectorAll(".layer_map");
    return function (index) {
        layers.forEach((item, i) => {
            if (i === index) {
                item.classList = "layer_map show "
                layerIndex = index
            } else {
                item.classList = "layer_map"
            }
        })
    }
}
var layerContorlfn = displayControlLayer()
layerContorlfn(0)
function getAttr(target, att) {
    return target.getAttribute(att) ? target.getAttribute(att) : null
}

var layerContorl = document.getElementById('tabs');
layerContorl.querySelectorAll('button').forEach((item, index) => {
    item.onclick = function () {
        layerContorlfn(index)
    }
})

//设置按钮事件
var actions = document.querySelectorAll('.layer_contol')
actions.forEach((item, index) => {
    item.onclick = function (e) {
        var e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toLocaleLowerCase() == 'button') {
            let fnName = getAttr(target, 'data-fn')
            let valueInput = getAttr(target, 'data-inputId')
            let radioName = getAttr(target, 'data-radioname')
            let value
            if (fnName === 'setCenter') {
                value = document.getElementById(valueInput).value.split(',')
                fnName && lsActions[fnName].call(null, value[0], value[1])
                return
            }

            if (valueInput) {
                value = document.getElementById(valueInput).value
                fnName && lsActions[fnName].call(null, value)
                return
            }

            if (radioName) {
                value = getRadioValue(radioName)
                fnName && lsActions[fnName].call(null, value)
                return
            }
            fnName && lsActions[fnName].call(null)
        }
    }
})

function getRadioValue(tagName) {
    var radio = document.getElementsByName(tagName)
    if (radio) {
        for (let index = 0; index < radio.length; index++) {
            if (radio[index].checked) {
                return radio[index].value
            }

        }
    }
    return false
}

var lsActions = {
    setCenter: function (lat, lng) {
        map.setCenter(lat, lng)
    },
    getCenter: function () {
        alert(map.getCenter())
    },
    getZoom: function () {
        alert("地图层级为:" + map.getZoom())
    },
    setZoom: function (zoom) {
        map.setZoom(zoom)
    },
    setMapType: function (mapType) {
        var mapTypeArr = ['map', "sat", "chart"]
        if (mapTypeArr.indexOf(mapType) > -1) {
            map.setMapType(mapType)
            return
        }
        alert("输入的值为:" + mapType + ",请检查地图类型是否设置正确")

    },
    getMapType: function () {
        var str = ''
        var mapType = map.getMapType()
        switch (mapType) {
            case 'map':
                str = "路地图"
                break;
            case 'sat':
                str = "海图"
                break;
            case 'chart':
                str = "卫星图"
                break;
            default:
                break;
        }
        alert("当前地图类型为: " + str)
    },
    dd: function () { },
    dd: function () { }
}