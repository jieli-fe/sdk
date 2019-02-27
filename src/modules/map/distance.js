/**
*  测距工具 
*/
L.control.measureControl = function (options) {
    return new L.Control.MeasureControl(options);
};

L.Control.MeasureControl = L.Control.extend({
    _map: null,
    options: {
        position: 'bottomleft',
        maxWidth: 100,
        metric: true,
        imperial: true
    },
    mouseStatus: function (status) {
        if(status === "starting"){
            L.DomUtil.addClass(this.map)
        }else{

        }
    },
    onAdd: function (map) {
        this._map = map
        this._div = L.DomUtil.create('div', 'measureControl');
        this._div.onclick = () => {
            console.log('buttonClicked');
        }
        this._measure();
        return this._div;
    },
    onRemove: function (map) {
        this._map = null;
        this._div = null;
        this._measure = null;
    },
    _measure: function () {
        var map = this._map;
        var layer = L.layerGroup();
        layer.addTo(this._map);
        var measurePoints = [];
        var totalDistance = 0;
        var start = false;
        var lines;
        var tempLine;
        var markers = [];
        var cc = function (e) {
            map.doubleClickZoom.disable();
            start = true;

            // L.tools.addClass(map, "acdccccc")

            if (measurePoints.length > 0) {
                if (e.latlng.lat != measurePoints[measurePoints.length - 1].lat && e.latlng.lng != measurePoints[measurePoints.length - 1].lng) {
                    measurePoints.push(e.latlng);
                    if (measurePoints.length == 2) {
                        lines = new L.Polyline(measurePoints, {
                            "color": "blue",
                            "weight": 1
                        });
                        lines.addTo(layer)
                    }
                    var s = L.circleMarker(e.latlng, {
                        color: "blue"
                    });
                    s.setRadius(1);
                    if (measurePoints.length >= 2) {
                        var d = measurePoints[measurePoints.length - 1].distanceTo(measurePoints[measurePoints.length - 2]);
                        totalDistance += d;
                        var txt = (d / 1852).toFixed(3) + "（海里）";

                        s.bindTooltip(txt, { direction: 'right', permanent: true });

                    }
                    s.addTo(layer);
                    s.toggleTooltip();

                    markers.push(s);
                    lines.setLatLngs(measurePoints)
                }
            } else {
                measurePoints.push(e.latlng);
                var s = L.circleMarker(e.latlng, {
                    color: "blue"
                });
                s.setRadius(1);


                s.bindTooltip("起点", { direction: 'right', permanent: true });
                s.addTo(layer);
                s.toggleTooltip();
                markers.push(s)
            }
        };
        var mm = function (e) {
            if (start) {
                if (tempLine != null) {
                    layer.removeLayer(tempLine)
                }
                tempLine = new L.Polyline([measurePoints[measurePoints.length - 1], e.latlng], {
                    stroke: !0, dashArray: '10,5', weight: 1, color: 'blue', opacity: 1
                });
                tempLine.addTo(layer)
            }
        };

        var dc = function (e) {
            if (measurePoints.length > 1) {
                if (markers.length > 1) {
                    var m = markers[markers.length - 1];
                    var lab = m.getTooltip();
                    var strhtml = "";
                    var tt = document.createTextNode(lab._content + "  总长度：" + (totalDistance / 1852).toFixed(3) + "（海里）");

                    var span = "<span class='spanclose' id='distanceCloseBtn' style='color: #ff0000;'>【关闭】</span>";

                    strhtml = tt.data + span;

                    var s = L.circleMarker(m._latlng, {
                        color: "blue"
                    });
                    s.setRadius(1);
                    s.bindTooltip(strhtml, { direction: 'right', permanent: true, interactive: true });
                    s.addTo(layer);
                    s.toggleTooltip();

                    layer.removeLayer(m);
                    document.querySelector('#distanceCloseBtn') && document.querySelector('#distanceCloseBtn').on('click', function (e) {
                        map.removeLayer(layer);
                    });

                }
                start = false;
                map.off("click", cc).off("mousemove", mm).off("dblclick", dc);
            }
        };

        var mu = function (e) {
            map.doubleClickZoom.enable()
        };
        map.on("click", cc).on("mousemove", mm).on("dblclick", dc).on("mouseup", mu);
        this.cancelMeasure = function () {
            map.off("click", cc).off("mousemove", mm).off("dblclick", dc).off("mouseup", mu)
        }
    }
});