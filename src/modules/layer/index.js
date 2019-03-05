import L from "leaflet"
import { datastore } from "../utils/DataStore";

export function polyline(latlngs, options) {
    return L.polyline(latlngs, options)
}
export function polygon(latlngs, options) {
    return L.polygon(latlngs, options)
}

export function marker(latlngs, options) {
    return L.marker(latlngs, options)
}

export function circleMarker(latlngs, options) {
    return L.circleMarker(latlngs, options)
}

export function icon(options) {
    return L.icon(options)
}

export function addTo(map) {
    console.log(map)
    return map ? map : datastore.getData(GlobalKey.MAPOBJECT)
}
export function latLng(lat, lng, alt) {
    return L.latLng(lat, lng, alt)
}
export function circle(latlng, options, legacyOptions) {
    return L.circle(latlng, options, legacyOptions)
}
