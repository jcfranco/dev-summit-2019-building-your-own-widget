define(["require", "exports", "esri/Map", "esri/views/MapView", "./CustomWidget"], function (require, exports, Map, MapView, CustomWidget) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //----------------
    //  map setup
    //----------------
    var map = new Map({
        basemap: "streets-vector"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-117.1628487109789, 32.706813240831096],
        zoom: 15
    });
    //----------------
    //  widget setup
    //----------------
    var widget = new CustomWidget({ container: "widgetDiv" });
});
//# sourceMappingURL=main.js.map