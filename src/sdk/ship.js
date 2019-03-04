
import L from "leaflet"
import "../extends/rotatedmarker"
import Constants from "../modules/constants/Constants";
import http from "../utils/axios"
import { LonLatTrans } from "../utils/GpsCorrect";
import { shipStatu, getRuningIcon, getStopIcon } from "../utils/ShipUtils";
import defaultMarker from "../images/single_marker.png"

if (!L.plugin) {
    L.plugin = {}
}
L.plugin.AddShip = L.Class.extend({
    initialize: function (shipId, options = {}) {
        this.time = + new Date()
        this.shipId = shipId;
        this.shipMarker = null
        // L.setOptions(this.options, options)
        this._arrayLayers = []
        this.layers = L.layerGroup()
        this.initShip(shipId, options)
            .then((shipData) => {
                // console.log(shipData)
                this.drawShip(shipData[0], options);
            })
    },
    getShip() {
        return this.initShip(this.shipId, this.options)
    },
    _addLayer(layer) {
        this._arrayLayers.push(layer)
        this.layers.addLayer(layer)
    },
    post(url, params) {
        return new Promise((resolve, reject) => {
            http.post(url, params)
                .then((response) => {
                    if (parseInt(response.status) === Constants.LOAD_DATA_SUCESS) {
                        resolve(response.result)
                    } else {
                        //加载失败
                        Events.fire(_self.events.Loaderror_Event_Key);
                        reject(response.status)
                    }
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    initShip(shipId, options = {}) {
        var key = L.params.map.key

        if (!shipId) {
            throw "没有船舶 id";
        }

        if (!key) {
            throw " 不正确的 key";
        }
        let postData = {
            shipid: shipId,
            key
        }

        return this.post(Constants.SHIP_POSITION_INFO_KEY, postData)
    },
    drawShip(shipdata, opts) {

        var that = this;
        let lat = shipdata.latitude || 0;
        let lon = shipdata.longitude || 0;
        lat = parseFloat(lat) / Constants.LATLON;
        lon = parseFloat(lon) / Constants.LATLON
        var latlon = LonLatTrans(lat, lon);
        let heading = shipdata.heading || shipdata.course || 0;
        heading = parseFloat(heading);
        var shipicon = this.getShipIcon(shipdata, opts);

        this.shipMarker = L.marker(latlon, {
            rotationAngle: heading,
            icon: shipicon,
            mmsi: shipdata.mmsi
        })

        if (opts && opts.showTag && opts.tag) {
            this.shipMarker.bindTooltip("&nbsp;" + opts.tag + "&nbsp;", {
                permanent: true,
                className: "leaflet-label-ship",
                direction: "right"
            })
        }
        if (opts && opts.click && typeof opts.click === "function") {
            this.shipMarker.on("click", function () {
                opts.click.call(that, arguments)
            });
        }
        this.shipMarker.lat = lat;
        this.shipMarker.lon = lon;


        //设置偏移量和图片
        if (opts && opts.img) {
            this.setImg(opts.img);
        }
        if (opts && opts.offset) {
            this.setOffset(opts.offset);
        }
        this._addLayer(this.shipMarker)
    },
    addTo(map) {
        this._map = map
        this._map.addLayer(this.layers)

    },
    remove() {
        this.layers.clearLayers()
    },

    getShipIcon(shipdata, cusoptions) {
        let stopmark = shipStatu(shipdata.nav_status, shipdata.speed);
        if (stopmark) {
            return getRuningIcon();
        } else {
            return getStopIcon();
        }
    },
    // _getImgWH(url) {
    //     if (url) {
    //         var img = new Image()
    //         img.onload = function () {
    //             console.log([img.width, img.height])
    //             return [img.width, img.height]
    //         }
    //         img.onerror = function () {
    //             return [0, 0]
    //         }
    //         img.src = url
    //     }
    //     return [0, 0]
    // },
    _createIcon(opts = {}) {
        var defaultIcon = {
            iconUrl: defaultMarker,
            iconSize: [39, 62],
            iconAnchor: [20, 62],
            popupAnchor: [0, 0],
            shadowUrl: '',
            shadowSize: [0, 0],
            shadowAnchor: [0, 0]
        }
        // if (opts.iconUrl) {
        //     defaultIcon.iconSize = this._getImgWH(opts.iconUrl)
        //     defaultIcon.iconAnchor = [0, 0]
        // }

        // if (opts.shadowUrl) {
        //     defaultIcon.shadowSize = [0, 0]
        //     defaultIcon.shadowAnchor = [0, 0]
        // }
        var tmpIcon = Object.assign(defaultIcon, opts)
        this.shipMarker.setIcon(L.icon(tmpIcon))
    },
    /**
     *
     * 更改船舶图标
     * @memberof Ship
     */
    setImg(iconUrl) {
        iconUrl && this._createIcon({ iconUrl })
    },

    /**
     *
     * 船舶图标的偏移量
     * @memberof Ship
     */
    setOffset(iconAnchor) {
        iconAnchor && this._createIcon({ iconAnchor })
    },
    //将船舶位置移动到最中央
    setLocate() {
        if (this.shipMarker) {
            console.log(this.shipMarker.getLatLng(), this._map.getZoom())
            this._map.setView(this.shipMarker.getLatLng(), this._map.getZoom())
        }
    },

    /**
     *
     * 设置船舶旋转角度
     * @memberof Ship
     */
    setRotate(rotate) {
        rotate && !isNaN(rotate) && this.shipMarker.setRotationAngle(parseFloat(rotate))
    },

    /**
     *
     * 设置船舶标签内容
     * @memberof Ship
     */
    setTag(tag) {
        //更改提示内容
        if (tag) {
            this.shipMarker.unbindTooltip().bindTooltip("&nbsp;" + tag + "&nbsp;", {
                permanent: true,
                className: "leaflet-label-ship",
                direction: "top",
                offset: [0, -10]
            });
            this.shipMarker.openTooltip(this.shipMarker.getLatLng());
        }
    },
    clearTag() {
        this.shipMarker.unbindTooltip()
    },
    markerClick() {
        console.log(this)
    }
});
L.plugin.AddShip.addInitHook(function () {
    console.log("addInitHook")
})

L.plugin.addShip = function (shipId, options) {
    return new L.plugin.AddShip(shipId, options);
};