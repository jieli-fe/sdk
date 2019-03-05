// import LS from "../../lib/index"
// window.LS = LS
import Ls from "../../src/index"
window.Ls = Ls
import "./app.styl"



var map = Ls.map("map", {
    center: [31, 122],
    // center: [39.73, -104.99],
    zoom: 8,
    mapType: 'map', //'map'/'sat'/'chart'
    key: '48755a5ab4064e7a91b60ddecc3d8c11'
});
var ship, trace;
window.map = map
window.ship = ship
window.trace = trace
//map.setMapType("sat");
/* 

//polygon
var latlng = [[30, 122], [33, 115]]

var ac = Ls.polygon(latlng).bindPopup("I am a polygon --ls.")
ac.addTo(map)


//polyline
var polyline = [
    [31, 122],
    [33, 133],
    [25, 144]
]
var polyline = Ls.polyline(polyline).bindPopup("i am a polyline.")
polyline.addTo(map)

//circleMarker
var circ = Ls.circleMarker([29, 121], {
    color: "red",
    radius: 1
}).bindPopup("123").openPopup();
circ.addTo(map)

//marker
var myIcon = Ls.icon({
    iconUrl: 'https://cdn.icon-icons.com/icons2/259/PNG/128/ic_location_on_128_28437.png',
    iconSize: [128, 128],
    iconAnchor: [64, 118],
    popupAnchor: [0, -100],
});


var marker = Ls.marker([29, 121], {
    icon: myIcon,
    title: "ttttttt"
}).bindPopup("marker").openPopup();
marker.addTo(map) */

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
layerContorlfn(2)
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
                fnName && lsActions[fnName].call(lsActions, value[0], value[1])
                return
            }

            if (valueInput) {
                value = document.getElementById(valueInput).value
                fnName && lsActions[fnName].call(lsActions, value)
                return
            }

            if (radioName) {
                value = getRadioValue(radioName)
                fnName && lsActions[fnName].call(lsActions, value)
                return
            }
            fnName && lsActions[fnName].call(lsActions)
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
    ship: null,
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
    addShip(shipId) {
        if (!isNaN(shipId)) {
            ship = Ls.ship(shipId, {
                // img: 'https://www.amap.com/assets/img/single_marker.png',
                img: '',
                offset: [20, 62],
                locate: false,
                rotate: 0,
                showTag: true,
                tag: '123'
            });
            ship.addTo(map)
        } else {
            throw new Error('请输入船舶的 mmis')
        }
    },
    remove: function () {
        ship.remove()
    },
    setImg: function (img) {
        ship.setImg(img)
    },
    setLocate: function (map) {
        ship.setLocate()
    },
    setRotate: function (deg) {
        ship.setRotate(deg)
    },
    setTag: function (tag) {
        ship.setTag(tag)
    },
    clearTag: function () {
        ship.clearTag()
    },
    setOffset: function (offset) {
        var arr = offset.split(',')
        arr && ship.setOffset(arr)

    },
    getShip: function () {
        ship.getShip().then((data) => {
            alert(JSON.stringify(data))
        })
    },
    addTrace: function () {
        trace = Ls.trace("636015511", 1544508577, 1545372577, {
            color: '#0033FF'
        })
        trace.addTo(map)
    },
    clearTrace: function () {
        trace && trace.remove()
    },
    setTraceOptions: function (value) {
        console.log(value)
        function getOpts(value) {
            try {
                return JSON.parse(value)
            } catch (error) {
                alert("检查对象是否按照标准格式输入")
            }
            
        }
        var opts = getOpts(value)
        console.log(opts)
        trace.setOptions(opts)
    },
    setFitBounds: function () {
        if (trace) {
            trace.setFitBounds()
        } else {
            alert("请先添加轨迹,然后再操作")
        }
    },
    setSparse: function (number) {
        trace.setSparse(number)
    },
    getTrace: function () {
        if (trace) {
            alert(JSON.stringify(trace.getTrace()))
        } else {
            alert("请先添加轨迹,然后在获取数据")
        }
    },

    dd: function () { },
    dd: function () { }
}

// window.onload = function () {
//     lsActions.addShip("200042456")
// }
