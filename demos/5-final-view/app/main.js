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
        center: [-116.538433, 33.824775],
        zoom: 13
    });
    //----------------
    //  widget setup
    //----------------
    var widget = new GuessWhere({ view: view, container: "widgetDiv" });
});
//# sourceMappingURL=main.js.map