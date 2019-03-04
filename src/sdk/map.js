import L from "leaflet"
import Constants from "../config/Constants";
import { ChartLayer } from "../extends/ChartLayer";

(function () {
    L.Map.addInitHook(function () {
        let mapType = this.options.mapType;
        this.setMapType(mapType);
        this.saveParams("map",this.options)
    });
    L.Map.include({
        saveParams(key,value){
            if(!key) return
            L.params = {
                [key]: value
            }
        },
        getMapType: function () {
            return this.mapType
        },
        setMapType: function (mapType) {
            if (this.layer) {
                this.removeLayer(this.layer);
            }
            if (!mapType) return
            this.mapType = mapType
            switch (mapType) {
                case Constants.CHAT_MAP_TYPE:
                    this.drawChatLayer();
                    break;
                case Constants.MAP_MAP_TYPE:
                    this.drawMapLayer();
                    break;
                case Constants.SITE_MAP_TYPE:
                    this.drawSiteLayer();
                    break;
            }
        },
        /**
        *
        * 绘制海图
        * @memberof MapObject
        */
        drawChatLayer: function () {
            let layer = ChartLayer("", {
                maxZoom: Constants.MAX_ZOOM,
                minZoom: Constants.MIN_ZOOM,
                continuousWorld: true,
                id: 'chart'
            });
            L.Util.setOptions(this, {
                crs: L.CRS.EPSG3395
            });
            this.layer = layer;
            this.addLayer(layer);
        },

        /**
         *卫星图
         *
         * @memberof MapObject
         */
        drawSiteLayer: function () {
            let layer = new L.tileLayer(Constants.STATE_URL_NEW, {
                maxZoom: Constants.MAX_ZOOM,
                minZoom: Constants.MIN_ZOOM,
                continuousWorld: true,
                id: 'sate'
            });
            // var gridLayer = new L.tileLayer(Constants.STATE_URL_GIRD, {
            //     maxZoom: Constants.MAX_ZOOM,
            //     minZoom: Constants.MIN_ZOOM,
            //     continuousWorld: true,
            //     id: 'sate',
            //     zIndex: 10
            // });
            L.Util.setOptions(this, {
                crs: L.CRS.EPSG3857
            });
            this.layer = layer;
            this.addLayer(layer);
        },
        /**
         *
         * 地图
         * @memberof MapObject
         */
        drawMapLayer: function () {
            let layer = new L.tileLayer(Constants.MAP_URL2, {
                subdomains: [0, 1, 2, 3],
                maxZoom: Constants.MAX_ZOOM,
                minZoom: Constants.MIN_ZOOM,
                continuousWorld: true,
                id: 'mapbox.streets'
            });
            L.Util.setOptions(this, {
                crs: L.CRS.EPSG3857
            });
            this.layer = layer;
            this.addLayer(layer);
        },

        setCenter: function (lat, lng) {
            return this.setView(L.latLng(lat, lng))
        }
    });
})();