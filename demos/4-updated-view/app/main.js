define(["require", "exports", "esri/Map", "esri/views/MapView", "./GuessWhere"], function (require, exports, Map, MapView, GuessWhere) {
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
    var widget = new GuessWhere({ container: "widgetDiv", view: view });
    console.log(widget);
});
//# sourceMappingURL=main.js.map