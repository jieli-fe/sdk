export default {
    map: {
        distance: {
            polyLineType: {
                "color": "blue",
                "weight": 1
            },
            toolTips: {
                direction: 'right',
                permanent: true
            }
        }
    },
    ship: {
        marker: {
            permanent: true,
            className: "leaflet-label-ship",
            direction: "right"
        }
    },
    trace:{
        "lineColor": "#0073f5",
        "lineWidth": 2,
        "lineStyle": "bold",
        "pointColor": "#f23030",
        "pointWeight": 3,
        "sparse": 0,
        "timeFormat": "MM-dd HH:mm:ss",
        "timeAnti": false,
        "fitBounds": true
    }
}